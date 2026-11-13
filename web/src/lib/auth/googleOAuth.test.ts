// @vitest-environment node
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import { handleGoogleAuth } from "./googleOAuth";

const ORIGIN = "https://quantavault.pages.dev";
const ID = "567990028938-03d27ug65h8bcj5o1m20polgho680ed4.apps.googleusercontent.com";
const envBase = { GOOGLE_CLIENT_ID: ID, GOOGLE_CLIENT_SECRET: "test-server-secret" };
let rsa: { privateKey: webcrypto.CryptoKey; publicKey: webcrypto.CryptoKey }, jwk: JsonWebKey;
const encoder = new TextEncoder();
const b64 = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");
const jsonb64 = (v: unknown) => b64(encoder.encode(JSON.stringify(v)));

class FakeD1 {
  users = new Map<string, { id: string; googleSub: string; email: string; name: string }>();
  sessions = new Map<string, { userId: string; expires: number }>();
  prepare(sql: string) {
    let args: unknown[] = [];
    return {
      bind(...values: unknown[]) { args = values; return this; },
      first: async <T>(): Promise<T | null> => {
        if (sql.includes("FROM oauth_sessions s JOIN")) {
          const session = this.sessions.get(args[0] as string);
          const user = session && session.expires > Number(args[1]) ? this.users.get(session.userId) : null;
          return user ? { id: user.id, email: user.email, name: user.name } as T : null;
        }
        return null;
      },
      run: async () => {
        if (sql.startsWith("INSERT INTO oauth_google_users")) {
          const [id, googleSub, email, name] = args as string[];
          this.users.set(id, { id, googleSub, email, name });
        } else if (sql.startsWith("INSERT INTO oauth_sessions")) {
          this.sessions.set(args[0] as string, { userId: args[1] as string, expires: args[2] as number });
        } else if (sql.startsWith("DELETE FROM oauth_sessions")) this.sessions.delete(args[0] as string);
        else throw new Error("Unknown SQL");
        return { meta: { changes: 1 } };
      },
    };
  }
}
let db: FakeD1;

async function issueIdToken(nonce: string, claims: Record<string, unknown> = {}) {
  const header = jsonb64({ typ: "JWT", alg: "RS256", kid: "test-google-key" });
  const now = Math.floor(Date.now() / 1000);
  const payload = jsonb64({
    iss: "https://accounts.google.com", aud: ID, sub: "google-user-unique-123",
    email: "demo@example.com", email_verified: true, name: "Demo User",
    nonce, iat: now - 20, exp: now + 1800,
    ...claims,
  });
  const signature = new Uint8Array(await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", rsa.privateKey, encoder.encode(header + "." + payload)));
  return header + "." + payload + "." + b64(signature);
}
const send = (path: string, options?: RequestInit) => new Request(ORIGIN + path, options);
const cookieValue = (setCookies: string, name: string) => {
  const part = setCookies.split(/,(?=\s*__Host-)/).find(s => s.trim().startsWith(name + "="));
  if (!part) throw new Error("Missing cookie " + name + " in " + setCookies);
  return part.trim().split(";")[0];
};
async function begin() {
  const start = await handleGoogleAuth(send("/api/auth/google/start"), { ...envBase, INTERVIEW_DB: db });
  expect(start.status).toBe(303);
  const destination = new URL(start.headers.get("Location")!);
  const oauth = cookieValue(start.headers.get("set-cookie")!, "__Host-qv_oauth");
  const data = JSON.parse(Buffer.from(oauth.split("=")[1], "base64url").toString("utf8"));
  return { start, oauth, destination, data };
}
function mockGoogle(token: string) {
  const fn = vi.fn(async (input: unknown, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://oauth2.googleapis.com/token") {
      const params = new URLSearchParams(init?.body as string);
      expect(params.get("client_secret")).toBe(envBase.GOOGLE_CLIENT_SECRET);
      expect(params.get("grant_type")).toBe("authorization_code");
      expect(params.get("redirect_uri")).toBe(ORIGIN + "/api/auth/google/callback");
      return Response.json({ id_token: token });
    }
    if (url === "https://www.googleapis.com/oauth2/v3/certs") {
      return Response.json({ keys: [{ ...jwk, kid: "test-google-key", use: "sig", alg: "RS256" }] });
    }
    throw new Error("Unexpected fetch " + url);
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("Cloudflare Google OpenID Connect login", () => {
  beforeAll(async () => {
    vi.stubGlobal("crypto", webcrypto);
    rsa = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
    jwk = await webcrypto.subtle.exportKey("jwk", rsa.publicKey);
  });
  beforeEach(() => { db = new FakeD1(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("fails closed when Client Secret is missing", async () => {
    const response = await handleGoogleAuth(send("/api/auth/google/start"), { GOOGLE_CLIENT_ID: ID, INTERVIEW_DB: db });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toContain("authError=unavailable");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("starts a secure state + PKCE authorization code flow", async () => {
    const { start, data, destination } = await begin();
    expect(destination.origin).toBe("https://accounts.google.com");
    expect(destination.searchParams.get("client_id")).toBe(ID);
    expect(destination.searchParams.get("redirect_uri")).toBe(ORIGIN + "/api/auth/google/callback");
    expect(destination.searchParams.get("code_challenge_method")).toBe("S256");
    expect(destination.searchParams.get("state")).toBe(data.state);
    expect(destination.searchParams.get("scope")).toBe("openid email profile");
    expect(start.headers.get("set-cookie")).toMatch(/Secure; HttpOnly; SameSite=Lax/);
  });

  it("rejects missing/mismatched OAuth state before token exchange", async () => {
    const { oauth } = await begin();
    const fn = vi.fn();
    vi.stubGlobal("fetch", fn);
    const bad = await handleGoogleAuth(send("/api/auth/google/callback?code=fake&state=wrong", { headers: { Cookie: oauth } }), { ...envBase, INTERVIEW_DB: db });
    expect(bad.status).toBe(303);
    expect(bad.headers.get("Location")).toContain("authError=expired");
    expect(fn).not.toHaveBeenCalled();
    expect(bad.headers.get("set-cookie")).toMatch(/Max-Age=0/);
  });

  it("verifies Google signature and claims, creates an opaque session, then signs out", async () => {
    const { oauth, data } = await begin();
    const token = await issueIdToken(data.nonce);
    const mock = mockGoogle(token);
    const callback = await handleGoogleAuth(send("/api/auth/google/callback?state=" + data.state + "&code=4%2Ftest", { headers: { Cookie: oauth } }), { ...envBase, INTERVIEW_DB: db });
    expect(callback.status).toBe(303);
    expect(callback.headers.get("Location")).toBe(ORIGIN + "/interview/?auth=connected");
    expect(mock).toHaveBeenCalledTimes(2);
    const sessionCookie = cookieValue(callback.headers.get("set-cookie")!, "__Host-qv_session");
    expect(sessionCookie).not.toContain("google-user-unique-123");
    expect(db.sessions.size).toBe(1);
    const session = await handleGoogleAuth(send("/api/auth/session", { headers: { Cookie: sessionCookie } }), { ...envBase, INTERVIEW_DB: db });
    expect((await session.json()).user).toMatchObject({ email: "demo@example.com", name: "Demo User" });
    const blockedLogout = await handleGoogleAuth(send("/api/auth/logout", { method: "POST", headers: { Cookie: sessionCookie, Origin: "https://evil.example" } }), { ...envBase, INTERVIEW_DB: db });
    expect(blockedLogout.status).toBe(403);
    const logout = await handleGoogleAuth(send("/api/auth/logout", { method: "POST", headers: { Cookie: sessionCookie, Origin: ORIGIN } }), { ...envBase, INTERVIEW_DB: db });
    expect(logout.status).toBe(200);
    expect(db.sessions.size).toBe(0);
  });


  it("preserves the intended lesson, query, and hash after OAuth", async () => {
    const returnTo = "/courses/postgresql/lesson-01/?view=notes#summary";
    const start = await handleGoogleAuth(send("/api/auth/google/start?returnTo=" + encodeURIComponent(returnTo)), { ...envBase, INTERVIEW_DB: db });
    const oauth = cookieValue(start.headers.get("set-cookie")!, "__Host-qv_oauth");
    const flow = JSON.parse(Buffer.from(oauth.split("=")[1], "base64url").toString("utf8"));
    mockGoogle(await issueIdToken(flow.nonce));
    const callback = await handleGoogleAuth(send("/api/auth/google/callback?state=" + flow.state + "&code=mock", { headers: { Cookie: oauth } }), { ...envBase, INTERVIEW_DB: db });
    expect(callback.status).toBe(303);
    const result = new URL(callback.headers.get("Location")!);
    expect(result.pathname).toBe("/courses/postgresql/lesson-01/");
    expect(result.searchParams.get("view")).toBe("notes");
    expect(result.searchParams.get("auth")).toBe("connected");
    expect(result.hash).toBe("#summary");
  });

  it.each(["//evil.example", "https://evil.example/path", "/%2f%2fevil", "/%2e%2e/admin", "/\\\\evil.example"])("rejects unsafe OAuth return destinations: %s", async returnTo => {
    const start = await handleGoogleAuth(send("/api/auth/google/start?returnTo=" + encodeURIComponent(returnTo)), { ...envBase, INTERVIEW_DB: db });
    expect(start.status).toBe(303);
    const oauth = cookieValue(start.headers.get("set-cookie")!, "__Host-qv_oauth");
    const flow = JSON.parse(Buffer.from(oauth.split("=")[1], "base64url").toString("utf8"));
    expect(flow.returnTo).toBe("/interview/");
  });

  it("returns to the lesson on Google cancellation without creating a session", async () => {
    const start = await handleGoogleAuth(send("/api/auth/google/start?returnTo=%2Fproblems%2F1"), { ...envBase, INTERVIEW_DB: db });
    const oauth = cookieValue(start.headers.get("set-cookie")!, "__Host-qv_oauth");
    const flow = JSON.parse(Buffer.from(oauth.split("=")[1], "base64url").toString("utf8"));
    const cancel = await handleGoogleAuth(send("/api/auth/google/callback?error=access_denied&state=" + flow.state, { headers: { Cookie: oauth } }), { ...envBase, INTERVIEW_DB: db });
    expect(cancel.status).toBe(303);
    expect(cancel.headers.get("Location")).toBe(ORIGIN + "/problems/1?authError=cancelled");
    expect(db.sessions.size).toBe(0);
  });

  it.each([
    { aud: "attacker.apps.googleusercontent.com" },
    { nonce: "not-the-requested-nonce" },
    { email_verified: false },
    { exp: 0 },
    { iss: "https://attacker.example" },
  ])("rejects invalid Google ID token claims %j", async override => {
    const { oauth, data } = await begin();
    const mock = mockGoogle(await issueIdToken(data.nonce, override));
    const response = await handleGoogleAuth(send("/api/auth/google/callback?code=x&state=" + data.state, { headers: { Cookie: oauth } }), { ...envBase, INTERVIEW_DB: db });
    expect(response.status).toBe(303);
    expect(response.headers.get("Location")).toContain("authError=unavailable");
    expect(db.sessions.size).toBe(0);
    expect(mock).toHaveBeenCalled();
  });
});
