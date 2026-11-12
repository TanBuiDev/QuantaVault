import { currentSessionHash, readGoogleAccount, type OAuthEnv, type GoogleAccount } from "./googleOAuth";
import { verifyTOTP } from "../interview/totp";

const ORIGIN = "https://quantavault.pages.dev";
const ADMIN_COOKIE = "__Host-qv_admin";
const ELEVATED_SECONDS = 15 * 60;
const NO_STORE = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };
type Database = NonNullable<OAuthEnv["INTERVIEW_DB"]>;
type AdminEnv = OAuthEnv & { ADMIN_PIN?: string; TOTP_SECRET?: string };
export type AuthenticatedAdmin = { user: GoogleAccount; sessionHash: string };

function response(data: unknown, status = 200, extra?: HeadersInit): Response {
  return Response.json(data, { status, headers: { ...NO_STORE, ...extra } });
}
function bearerCookie(value: string, seconds: number): string {
  return `${ADMIN_COOKIE}=${value}; Path=/; Max-Age=${seconds}; Secure; HttpOnly; SameSite=Lax`;
}
function getCookie(request: Request, name: string): string | null {
  const match = request.headers.get("Cookie")?.split(";").map(s => s.trim()).find(s => s.startsWith(name + "="));
  return match?.slice(name.length + 1) ?? null;
}
async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map(x => x.toString(16).padStart(2, "0")).join("");
}
async function passwordEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder(), result = await Promise.all([a, b].map(v => crypto.subtle.digest("SHA-256", enc.encode(v))));
  const x = new Uint8Array(result[0]), y = new Uint8Array(result[1]);
  let difference = 0;
  for (let i = 0; i < 32; i++) difference |= x[i] ^ y[i];
  return difference === 0;
}
function secretConfigured(env: AdminEnv): boolean {
  return Boolean(env.ADMIN_PIN && env.TOTP_SECRET && env.INTERVIEW_DB);
}
function sameOrigin(request: Request): boolean {
  return request.headers.get("Origin") === ORIGIN;
}
async function parseBody(request: Request): Promise<Record<string, unknown> | null> {
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") return null;
  if (Number(request.headers.get("Content-Length") || 0) > 4096) return null;
  const text = await request.text();
  if (text.length > 4096) return null;
  try {
    const data = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch { return null; }
}
async function attemptCheck(db: Database, userId: string): Promise<{ locked: boolean; retry: number }> {
  const now = Math.floor(Date.now() / 1000);
  const row = await db.prepare("SELECT failures, locked_until FROM oauth_admin_auth_attempts WHERE user_id=?")
    .bind(userId).first<{ failures: number; locked_until: number }>();
  return { locked: Boolean(row && row.locked_until > now), retry: row ? Math.max(0, row.locked_until - now) : 0 };
}
async function recordFailure(db: Database, userId: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await db.prepare(
    "INSERT INTO oauth_admin_auth_attempts(user_id,failures,locked_until,updated_at) VALUES (?,1,0,?) " +
    "ON CONFLICT(user_id) DO UPDATE SET failures=CASE WHEN updated_at<? THEN 1 ELSE failures+1 END, " +
    "locked_until=CASE WHEN updated_at<? THEN 0 WHEN failures+1>=5 THEN ? ELSE locked_until END, updated_at=?"
  ).bind(userId, now, now - 900, now - 900, now + 3600, now).run();
}
async function credentialCheck(env: AdminEnv, userId: string, password: unknown, otp?: unknown, requireOtp = false): Promise<"ok" | "invalid" | "locked"> {
  const db = env.INTERVIEW_DB!;
  const attempted = await attemptCheck(db, userId);
  if (attempted.locked) return "locked";
  const pass = typeof password === "string" && password.length <= 256 && await passwordEqual(password.trim(), env.ADMIN_PIN!);
  const validOtp = !requireOtp || (typeof otp === "string" && /^\d{6}$/.test(otp) && await verifyTOTP(otp, env.TOTP_SECRET!, { window: 1 }));
  if (!pass || !validOtp) {
    await recordFailure(db, userId);
    return "invalid";
  }
  await db.prepare("DELETE FROM oauth_admin_auth_attempts WHERE user_id=?").bind(userId).run();
  return "ok";
}
async function requireUser(request: Request, env: OAuthEnv) {
  const user = await readGoogleAccount(request, env);
  return user ?? null;
}
export async function authorizedAdmin(request: Request, env: OAuthEnv, elevated = true): Promise<AuthenticatedAdmin | null> {
  const user = await requireUser(request, env);
  if (!user || user.role !== "admin" || !env.INTERVIEW_DB) return null;
  const sessionHash = await currentSessionHash(request);
  if (!sessionHash) return null;
  if (elevated) {
    const token = getCookie(request, ADMIN_COOKIE);
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const found = await env.INTERVIEW_DB.prepare(
      "SELECT token_hash FROM oauth_admin_elevations WHERE token_hash=? AND user_id=? AND session_hash=? AND expires_at > ?"
    ).bind(await digest(token), user.id, sessionHash, Math.floor(Date.now()/1000)).first<{ token_hash: string }>();
    if (!found) return null;
  }
  return { user, sessionHash };
}
async function hasBootstrap(db: Database): Promise<boolean> {
  const row = await db.prepare("SELECT owner_user_id FROM oauth_admin_bootstrap WHERE id=1").first<{ owner_user_id: string }>();
  return Boolean(row);
}
/** Owner membership is provisioned in D1 after verifying the Google sub.
 * It is never inferred from a client-supplied email or a shared password. */
async function mayBootstrap(db: Database, userId: string): Promise<boolean> {
  const row = await db.prepare("SELECT user_id FROM oauth_admin_owner_allowlist WHERE user_id=?")
    .bind(userId).first<{ user_id: string }>();
  return row?.user_id === userId;
}
async function audit(db: Database, actor: string, action: string, subject: string | null) {
  await db.prepare("INSERT INTO oauth_admin_audit(actor_user_id,action,subject_user_id) VALUES (?,?,?)")
    .bind(actor, action, subject).run();
}
export async function handleAccountAdmin(request: Request, env: AdminEnv): Promise<Response> {
  const url = new URL(request.url);
  if (url.origin !== ORIGIN) return response({ ok: false, code: "HOST_NOT_ALLOWED" }, 404);
  const route = url.pathname.replace(/\/$/, "");
  if (!route.startsWith("/api/admin/")) return response({ ok: false }, 404);
  if (!secretConfigured(env)) return response({ ok: false, code: "ADMIN_UNAVAILABLE" }, 503);
  const db = env.INTERVIEW_DB!;
  try {
    const user = await requireUser(request, env);
    if (!user) return response({ ok: false, code: "UNAUTHENTICATED" }, 401);
    if (request.method === "GET" && route === "/api/admin/bootstrap-status") {
      return response({ ok: true, needsSetup: !(await hasBootstrap(db)) && await mayBootstrap(db, user.id) });
    }
    if (request.method === "GET" && route === "/api/admin/status") {
      const elevated = Boolean(await authorizedAdmin(request, env, true));
      return response({ ok: true, role: user.role, elevated });
    }
    if (request.method === "GET" && route === "/api/admin/users") {
      if (!await authorizedAdmin(request, env, true)) return response({ ok: false, code: "ADMIN_AUTH_REQUIRED" }, 403);
      const statement = db.prepare("SELECT u.id, u.email, u.display_name AS name, CASE WHEN r.role='admin' THEN 'admin' ELSE 'user' END AS role FROM oauth_google_users u LEFT JOIN oauth_user_roles r ON r.user_id=u.id ORDER BY u.created_at DESC LIMIT 200");
      // D1 .all() is intentionally called only on this read statement.
      const users = await (statement as typeof statement & { all<T>(): Promise<{ results: T[] }> }).all<Pick<GoogleAccount, "id" | "email" | "name" | "role">>();
      return response({ ok: true, users: users.results });
    }
    if (request.method !== "POST") return response({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
    if (!sameOrigin(request)) return response({ ok: false, code: "INVALID_ORIGIN" }, 403);
    const body = await parseBody(request);
    if (!body) return response({ ok: false, code: "INVALID_BODY" }, 400);
    if (route === "/api/admin/bootstrap") {
      // Check owner identity BEFORE accepting any credential attempts.
      if (!await mayBootstrap(db, user.id)) return response({ ok: false, code: "NOT_BOOTSTRAP_OWNER" }, 403);
      if (await hasBootstrap(db)) return response({ ok: false, code: "BOOTSTRAP_CLOSED" }, 409);
      const status = await credentialCheck(env, user.id, body.password, body.otp, true);
      if (status !== "ok") return response({ ok: false, code: status === "locked" ? "LOCKED" : "INVALID_CREDENTIALS" }, status === "locked" ? 429 : 401);
      // Exactly one atomic INSERT. D1 trigger atomically assigns the role and
      // audits the bootstrap; a failed role insert rolls back the claim.
      const claimed = await db.prepare(
        "INSERT INTO oauth_admin_bootstrap(id,owner_user_id) SELECT 1,? " +
        "WHERE EXISTS (SELECT 1 FROM oauth_admin_owner_allowlist WHERE user_id=?) " +
        "ON CONFLICT(id) DO NOTHING"
      ).bind(user.id, user.id).run();
      if (claimed.meta?.changes !== 1) return response({ ok: false, code: "BOOTSTRAP_CLOSED" }, 409);
      return response({ ok: true, role: "admin" });
    }
    if (user.role !== "admin") return response({ ok: false, code: "ADMIN_ONLY" }, 403);
    if (route === "/api/admin/step-up") {
      const status = await credentialCheck(env, user.id, body.password);
      if (status !== "ok") return response({ ok: false, code: status === "locked" ? "LOCKED" : "INVALID_CREDENTIALS" }, status === "locked" ? 429 : 401);
      const sessionHash = await currentSessionHash(request);
      if (!sessionHash) return response({ ok: false }, 401);
      const token = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
      const expires = Math.floor(Date.now() / 1000) + ELEVATED_SECONDS;
      await db.prepare("INSERT INTO oauth_admin_elevations(token_hash,user_id,session_hash,expires_at) VALUES (?,?,?,?)")
        .bind(await digest(token), user.id, sessionHash, expires).run();
      return response({ ok: true, expiresAt: expires }, 200, { "Set-Cookie": bearerCookie(token, ELEVATED_SECONDS) });
    }
    if (route === "/api/admin/roles") {
      if (!await authorizedAdmin(request, env, true)) return response({ ok: false, code: "STEP_UP_REQUIRED" }, 403);
      if (typeof body.targetUserId !== "string" || !/^[a-f0-9]{64}$/.test(body.targetUserId)
        || (body.role !== "admin" && body.role !== "user")) return response({ ok: false, code: "INVALID_ROLE_REQUEST" }, 400);
      const status = await credentialCheck(env, user.id, body.password, body.otp, true);
      if (status !== "ok") return response({ ok: false, code: status === "locked" ? "LOCKED" : "INVALID_CREDENTIALS" }, status === "locked" ? 429 : 401);
      const target = await db.prepare("SELECT id FROM oauth_google_users WHERE id=?").bind(body.targetUserId).first<{ id: string }>();
      if (!target) return response({ ok: false, code: "UNKNOWN_ACCOUNT" }, 404);
      if (body.role === "admin") {
        await db.prepare("INSERT INTO oauth_user_roles(user_id,role,granted_by) VALUES (?,'admin',?) ON CONFLICT(user_id) DO NOTHING")
          .bind(target.id, user.id).run();
        await audit(db, user.id, "grant_admin", target.id);
      } else {
        const active = await db.prepare("SELECT COUNT(*) AS total FROM oauth_user_roles WHERE role='admin'")
          .first<{ total: number }>();
        if (!active || active.total <= 1) return response({ ok: false, code: "LAST_ADMIN_REQUIRED" }, 409);
        const revoked = await db.prepare(
          "DELETE FROM oauth_user_roles WHERE user_id=? AND (SELECT COUNT(*) FROM oauth_user_roles WHERE role='admin') > 1"
        ).bind(target.id).run();
        if (revoked.meta?.changes !== 1) return response({ ok: false, code: "LAST_ADMIN_REQUIRED" }, 409);
        await db.prepare("DELETE FROM oauth_admin_elevations WHERE user_id=?").bind(target.id).run();
        await audit(db, user.id, "revoke_admin", target.id);
      }
      return response({ ok: true });
    }
    return response({ ok: false, code: "UNKNOWN_ACTION" }, 404);
  } catch {
    return response({ ok: false, code: "ADMIN_DATABASE_ERROR" }, 503);
  }
}
