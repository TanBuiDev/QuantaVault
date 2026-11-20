// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import { handleAccountAdmin, authorizedAdmin } from "./adminAccess";
import { readGoogleAccount, currentSessionHash } from "./googleOAuth";
import { generateTOTP } from "../interview/totp";

vi.mock("./googleOAuth", () => ({
  readGoogleAccount: vi.fn(),
  currentSessionHash: vi.fn(),
}));
const ORIGIN = "https://quantavault.pages.dev";
const OWNER = "a".repeat(64), OTHER = "b".repeat(64);
const envBase = { ADMIN_PIN: "test-secure-password", TOTP_SECRET: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ" };
let nowUser: { id: string; name: string; email: string; role: "user" | "admin" };
class FakeD1 {
  bootstrap: string | null = null;
  roles = new Set<string>();
  people = new Set([OWNER, OTHER]);
  allowedBootstrapOwners = new Set([OWNER]);
  audits: string[] = [];
  elevations = new Map<string, { userId: string; sessionHash: string; expires: number }>();
  failures = new Map<string, { failures: number; locked_until: number; updated_at: number }>();
  prepare(sql: string) {
    let params: unknown[] = [];
    return {
      bind(...args: unknown[]) { params = args; return this; },
      first: async <T>(): Promise<T | null> => {
        if (sql.startsWith("SELECT owner_user_id")) return this.bootstrap ? { owner_user_id: this.bootstrap } as T : null;
        if (sql.startsWith("SELECT user_id FROM oauth_admin_owner_allowlist")) return this.allowedBootstrapOwners.has(params[0] as string) ? {user_id:params[0]} as T : null;
        if (sql.startsWith("SELECT failures")) return (this.failures.get(params[0] as string) as T) || null;
        if (sql.startsWith("SELECT token_hash FROM oauth_admin_elevations")) {
          const a = this.elevations.get(params[0] as string);
          return a && a.userId === params[1] && a.sessionHash === params[2] && a.expires > Number(params[3])
            ? { token_hash: params[0] } as T : null;
        }
        if (sql.startsWith("SELECT id FROM oauth_google_users")) return this.people.has(params[0] as string) ? { id: params[0] } as T : null;
        if (sql.startsWith("SELECT COUNT(*) AS total")) return { total: this.roles.size } as T;
        throw new Error("Unexpected SELECT: " + sql);
      },
      all: async <T>(): Promise<{ results: T[] }> => ({
        results: [...this.people].map(id => ({ id, email: id===OWNER ? "owner@example.com":"other@example.com", name: id, role: this.roles.has(id) ? "admin":"user" } as T)),
      }),
      run: async (): Promise<{ meta: { changes: number } }> => {
        if (sql.startsWith("INSERT INTO oauth_admin_auth_attempts")) {
          const user = params[0] as string;
          const prev = this.failures.get(user);
          const now = Number(params[1]);
          const count = prev && prev.updated_at >= now-900 ? prev.failures + 1 : 1;
          this.failures.set(user, { failures:count, locked_until:count>=5 ? now+3600 : 0, updated_at:now });
        } else if (sql.startsWith("DELETE FROM oauth_admin_auth_attempts")) {
          this.failures.delete(params[0] as string);
        } else if (sql.startsWith("INSERT INTO oauth_admin_bootstrap")) {
          const owner = params[0] as string;
          if (this.bootstrap || !this.allowedBootstrapOwners.has(owner) || owner !== params[1]) return { meta:{changes:0} };
          this.bootstrap = owner;
          this.roles.add(owner); // D1 AFTER INSERT trigger, atomic with bootstrap
          this.audits.push("admin_bootstrap");
        } else if (sql.startsWith("INSERT INTO oauth_user_roles")) {
          this.roles.add(params[0] as string);
        } else if (sql.startsWith("DELETE FROM oauth_user_roles")) {
          this.roles.delete(params[0] as string);
        } else if (sql.startsWith("INSERT INTO oauth_admin_elevations")) {
          this.elevations.set(params[0] as string, { userId:params[1] as string, sessionHash:params[2] as string, expires:params[3] as number });
        } else if (sql.startsWith("DELETE FROM oauth_admin_elevations")) {
          for (const [key, val] of this.elevations) if (val.userId === params[0]) this.elevations.delete(key);
        } else if (sql.startsWith("INSERT INTO oauth_admin_audit")) {
          this.audits.push(params[1] as string);
        } else throw new Error("Unexpected RUN: " + sql);
        return { meta:{changes:1} };
      },
    };
  }
}
let db: FakeD1;
const req = (path: string, body?: unknown, origin = ORIGIN) => new Request(ORIGIN + path, {
  method: body === undefined ? "GET" : "POST",
  headers: body === undefined ? {} : { Origin: origin, "Content-Type":"application/json" },
  ...(body === undefined ? {} : { body:JSON.stringify(body) }),
});
const env = () => ({ ...envBase, INTERVIEW_DB:db });

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto);
  db = new FakeD1();
  nowUser = { id: OWNER, email:"owner@example.com", name:"Owner", role:"user" };
  vi.mocked(readGoogleAccount).mockImplementation(async () => nowUser);
  vi.mocked(currentSessionHash).mockResolvedValue("signed-in-session-hash");
});
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("Google admin permissions and privileged actions", () => {
  it("does not automatically grant admin for a signed-in Google user", async () => {
    expect((await handleAccountAdmin(req("/api/admin/bootstrap-status"), env()).then(r=>r.json())).needsSetup).toBe(false);
    expect((await handleAccountAdmin(req("/api/admin/users"), env())).status).toBe(403);
    expect((await authorizedAdmin(req("/api/admin/status"), env(), false))).toBeNull();
    expect(db.roles.size).toBe(0);
  });

  it("retires browser-based first-admin activation even with valid credentials", async () => {
    const otp = await generateTOTP(envBase.TOTP_SECRET);
    const response = await handleAccountAdmin(req("/api/admin/bootstrap", { password:envBase.ADMIN_PIN, otp }), env());
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ ok:false, code:"BOOTSTRAP_CLOSED" });
    expect(db.roles.size).toBe(0);
    expect(db.bootstrap).toBeNull();
    expect(db.audits).toHaveLength(0);
  });

  it("hides bootstrap from non-owners and refuses their direct API requests", async () => {
    nowUser = { ...nowUser, id:OTHER, email:"other@example.com" };
    const status = await handleAccountAdmin(req("/api/admin/bootstrap-status"), env());
    expect(await status.json()).toMatchObject({ ok:true, needsSetup:false });
    const denied = await handleAccountAdmin(req("/api/admin/bootstrap", { password:envBase.ADMIN_PIN, otp:await generateTOTP(envBase.TOTP_SECRET), email:"owner@example.com" }), env());
    expect(denied.status).toBe(409);
    expect(db.roles.size).toBe(0);
    expect(db.failures.has(OTHER)).toBe(false);
  });

  it("recognizes the verified owner role provisioned in D1 without a bootstrap form", async () => {
    db.bootstrap = OWNER;
    db.roles.add(OWNER);
    nowUser = { ...nowUser, role:"admin" };
    expect((await authorizedAdmin(req("/api/admin/status"), env(), false))?.user.id).toBe(OWNER);
    const otp = await generateTOTP(envBase.TOTP_SECRET);
    expect((await handleAccountAdmin(req("/api/admin/bootstrap", { password:envBase.ADMIN_PIN, otp }), env())).status).toBe(409);
    nowUser = { ...nowUser, id:OTHER, role:"user" };
    expect((await handleAccountAdmin(req("/api/admin/bootstrap", { password:envBase.ADMIN_PIN, otp }), env())).status).toBe(409);
    expect(db.roles.has(OTHER)).toBe(false);
  });

  it("admin step-up is bound to session and never granted to ordinary users", async () => {
    const userDenied = await handleAccountAdmin(req("/api/admin/step-up", { password:envBase.ADMIN_PIN }), env());
    expect(userDenied.status).toBe(403);
    nowUser = { ...nowUser, role:"admin" };
    db.roles.add(OWNER);
    const wrong = await handleAccountAdmin(req("/api/admin/step-up", { password:"wrong" }), env());
    expect(wrong.status).toBe(401);
    const accepted = await handleAccountAdmin(req("/api/admin/step-up", { password:envBase.ADMIN_PIN }), env());
    expect(accepted.status).toBe(200);
    const set = accepted.headers.get("set-cookie")!;
    expect(set).toContain("HttpOnly; SameSite=Lax");
    const cookie = set.split(";")[0];
    const cookieReq = new Request(ORIGIN + "/api/admin/status", { headers:{Cookie:cookie} });
    expect((await authorizedAdmin(cookieReq, env(), true))?.user.role).toBe("admin");
    vi.mocked(currentSessionHash).mockResolvedValueOnce("other-device-session");
    expect(await authorizedAdmin(cookieReq, env(), true)).toBeNull();
  });

  it("refuses cross-site admin writes and blocks unauthorized role grants", async () => {
    nowUser = { ...nowUser, role:"admin" };
    db.roles.add(OWNER);
    const badOrigin = await handleAccountAdmin(req("/api/admin/roles", { targetUserId:OTHER, role:"admin" }, "https://attacker.example"), env());
    expect(badOrigin.status).toBe(403);
    const withoutElevation = await handleAccountAdmin(req("/api/admin/roles", { targetUserId:OTHER, role:"admin", password:envBase.ADMIN_PIN, otp:await generateTOTP(envBase.TOTP_SECRET) }), env());
    expect(withoutElevation.status).toBe(403);
    expect(db.roles.has(OTHER)).toBe(false);
  });

  it("requires TOTP to grant/revoke admin and protects the last admin", async () => {
    nowUser = { ...nowUser, role:"admin" };
    db.roles.add(OWNER);
    const elevated = await handleAccountAdmin(req("/api/admin/step-up", { password:envBase.ADMIN_PIN }), env());
    const cookie = elevated.headers.get("set-cookie")!.split(";")[0];
    const post = (body: unknown) => new Request(ORIGIN + "/api/admin/roles", { method:"POST", headers:{Origin:ORIGIN,Cookie:cookie,"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const noOtp = await handleAccountAdmin(post({ targetUserId:OTHER, role:"admin", password:envBase.ADMIN_PIN }), env());
    expect(noOtp.status).toBe(401);
    const otp = await generateTOTP(envBase.TOTP_SECRET);
    const result = await handleAccountAdmin(post({ targetUserId:OTHER, role:"admin", password:envBase.ADMIN_PIN, otp }), env());
    expect(result.status).toBe(200);
    expect(db.roles.has(OTHER)).toBe(true);
    const revoke = await handleAccountAdmin(post({ targetUserId:OTHER, role:"user", password:envBase.ADMIN_PIN, otp }), env());
    expect(revoke.status).toBe(200);
    const last = await handleAccountAdmin(post({ targetUserId:OWNER, role:"user", password:envBase.ADMIN_PIN, otp }), env());
    expect(last.status).toBe(409);
    expect(db.roles.has(OWNER)).toBe(true);
    expect(db.audits).toContain("grant_admin");
    expect(db.audits).toContain("revoke_admin");
  });
});
