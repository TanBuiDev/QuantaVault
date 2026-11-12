/**
 * Google OpenID Connect login for Cloudflare Pages advanced-mode Worker.
 * Authentication is independent of interview progress and the existing sync-code.
 * NEVER include this server module in client components.
 */
const ORIGIN = "https://quantavault.pages.dev";
export const GOOGLE_CALLBACK = ORIGIN + "/api/auth/google/callback";
const OAUTH_COOKIE = "__Host-qv_oauth";
const SESSION_COOKIE = "__Host-qv_session";
const MAX_SESSION_AGE = 14 * 24 * 60 * 60;
const MAX_OAUTH_AGE = 10 * 60;
const HEADERS = {
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<{ meta?: { changes?: number } }>;
}
export interface OAuthEnv {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  INTERVIEW_DB?: { prepare(sql: string): D1Statement };
}
interface GoogleClaims {
  iss?: string; aud?: string; sub?: string; email?: string; email_verified?: boolean;
  name?: string; exp?: number; iat?: number; nonce?: string;
}
export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
}

function json(data: unknown, status = 200, extra?: HeadersInit): Response {
  return Response.json(data, { status, headers: { ...HEADERS, ...extra } });
}
function redirect(url: string, cookies: string[] = []): Response {
  const headers = new Headers({ ...HEADERS, Location: url });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}
function cookie(name: string, value: string, seconds: number): string {
  return `${name}=${value}; Path=/; Max-Age=${seconds}; Secure; HttpOnly; SameSite=Lax`;
}
function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie") || "";
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`).exec(header);
  return match?.[1] ?? null;
}
function bytesToUrl(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromUrl(value: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("invalid base64url");
  const text = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(new ArrayBuffer(text.length));
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  return bytes;
}
function randomToken(): string { return bytesToUrl(crypto.getRandomValues(new Uint8Array(32))); }
async function sha256(input: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input)));
  return Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
}
async function challenge(input: string): Promise<string> {
  return bytesToUrl(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))));
}
function encodeFlow(data: { state: string; nonce: string; verifier: string; at: number }): string {
  return bytesToUrl(new TextEncoder().encode(JSON.stringify(data)));
}
function decodeFlow(value: string): { state: string; nonce: string; verifier: string; at: number } | null {
  try {
    if (value.length > 1500) return null;
    const data = JSON.parse(new TextDecoder().decode(fromUrl(value)));
    if (!data || typeof data !== "object" || !Number.isSafeInteger(data.at)) return null;
    if (![data.state, data.nonce, data.verifier].every((s: unknown) => typeof s === "string" && /^[A-Za-z0-9_-]{40,100}$/.test(s))) return null;
    if (data.at > Date.now() + 60_000 || Date.now() - data.at > MAX_OAUTH_AGE * 1000) return null;
    return data;
  } catch { return null; }
}
async function verifyGoogleIdToken(raw: string, clientId: string, nonce: string): Promise<GoogleClaims> {
  if (raw.length > 20000) throw new Error("id token too large");
  const segments = raw.split(".");
  if (segments.length !== 3) throw new Error("invalid jwt");
  const header = JSON.parse(new TextDecoder().decode(fromUrl(segments[0]))) as { alg?: string; kid?: string };
  const claims = JSON.parse(new TextDecoder().decode(fromUrl(segments[1]))) as GoogleClaims;
  if (header.alg !== "RS256" || !header.kid || header.kid.length > 200) throw new Error("unsupported jwt");
  const now = Math.floor(Date.now() / 1000);
  if ((claims.iss !== "accounts.google.com" && claims.iss !== "https://accounts.google.com")
    || claims.aud !== clientId || !claims.sub || claims.sub.length > 255
    || !Number.isFinite(claims.exp) || (claims.exp ?? 0) <= now
    || !Number.isFinite(claims.iat) || (claims.iat ?? 0) > now + 60
    || claims.nonce !== nonce || claims.email_verified !== true
    || typeof claims.email !== "string" || claims.email.length > 320) {
    throw new Error("invalid id token claims");
  }
  const keysResponse = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
    headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000),
  });
  if (!keysResponse.ok) throw new Error("google keys unavailable");
  const jwks = await keysResponse.json() as { keys?: Array<JsonWebKey & { kid?: string; use?: string; alg?: string }> };
  const key = jwks.keys?.find(k => k.kid === header.kid && k.kty === "RSA" && (!k.use || k.use === "sig") && (!k.alg || k.alg === "RS256"));
  if (!key) throw new Error("unknown google signing key");
  const imported = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const verified = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", imported, fromUrl(segments[2]), new TextEncoder().encode(segments[0] + "." + segments[1]));
  if (!verified) throw new Error("id token signature mismatch");
  return claims;
}
async function exchangeCode(code: string, flow: { verifier: string }, env: OAuthEnv): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      code,
      code_verifier: flow.verifier,
      redirect_uri: GOOGLE_CALLBACK,
      grant_type: "authorization_code",
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("google token exchange failed");
  const data = await response.json() as { id_token?: unknown };
  if (typeof data.id_token !== "string") throw new Error("missing google id token");
  return data.id_token;
}
function isConfigured(env: OAuthEnv): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID?.endsWith(".apps.googleusercontent.com") && env.GOOGLE_CLIENT_SECRET && env.INTERVIEW_DB);
}
async function issueSession(env: OAuthEnv, claims: GoogleClaims): Promise<string> {
  const sub = claims.sub!;
  const id = await sha256("google-sub:" + sub);
  const db = env.INTERVIEW_DB!;
  await db.prepare(
    "INSERT INTO oauth_google_users (id, google_sub, email, display_name) VALUES (?, ?, ?, ?) " +
    "ON CONFLICT(google_sub) DO UPDATE SET email=excluded.email, display_name=excluded.display_name"
  ).bind(id, sub, claims.email!, (claims.name || claims.email!).slice(0, 200)).run();
  const token = randomToken();
  const digest = await sha256(token);
  const expires = Math.floor(Date.now() / 1000) + MAX_SESSION_AGE;
  await db.prepare("INSERT INTO oauth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(digest, id, expires).run();
  return token;
}
export async function readGoogleAccount(request: Request, env: OAuthEnv): Promise<GoogleAccount | null> {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token) || !env.INTERVIEW_DB) return null;
  const tokenHash = await sha256(token);
  const row = await env.INTERVIEW_DB.prepare(
    "SELECT u.id AS id, u.email AS email, u.display_name AS name " +
    "FROM oauth_sessions s JOIN oauth_google_users u ON u.id=s.user_id " +
    "WHERE s.token_hash=? AND s.expires_at > ?"
  ).bind(tokenHash, Math.floor(Date.now()/1000)).first<GoogleAccount>();
  return row ?? null;
}
export async function handleGoogleAuth(request: Request, env: OAuthEnv): Promise<Response> {
  const url = new URL(request.url);
  // A callback registered on one domain must never accept a different Host.
  if (url.origin !== ORIGIN) return json({ ok: false, code: "HOST_NOT_ALLOWED" }, 404);
  if (!url.pathname.startsWith("/api/auth/")) return json({ ok: false }, 404);

  if (url.pathname === "/api/auth/google/start") {
    if (request.method !== "GET") return json({ ok: false }, 405);
    if (!isConfigured(env)) return json({ ok: false, code: "OAUTH_NOT_CONFIGURED" }, 503);
    const state = randomToken(), nonce = randomToken(), verifier = randomToken();
    const query = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!, redirect_uri: GOOGLE_CALLBACK,
      response_type: "code", scope: "openid email profile",
      state, nonce, code_challenge: await challenge(verifier), code_challenge_method: "S256",
      prompt: "select_account",
    });
    return redirect("https://accounts.google.com/o/oauth2/v2/auth?" + query, [
      cookie(OAUTH_COOKIE, encodeFlow({ state, nonce, verifier, at: Date.now() }), MAX_OAUTH_AGE),
    ]);
  }

  if (url.pathname === "/api/auth/google/callback") {
    if (request.method !== "GET") return json({ ok: false }, 405);
    const reset = cookie(OAUTH_COOKIE, "", 0);
    const flow = decodeFlow(getCookie(request, OAUTH_COOKIE) ?? "");
    if (!flow || !url.searchParams.get("state") || flow.state !== url.searchParams.get("state")
      || url.searchParams.has("error")) {
      return json({ ok: false, code: "OAUTH_STATE_INVALID" }, 400, { "Set-Cookie": reset });
    }
    const code = url.searchParams.get("code");
    if (!code || code.length > 2048 || !isConfigured(env)) {
      return json({ ok: false, code: "OAUTH_NOT_CONFIGURED_OR_INVALID_CODE" }, 400, { "Set-Cookie": reset });
    }
    try {
      const idToken = await exchangeCode(code, flow, env);
      const claims = await verifyGoogleIdToken(idToken, env.GOOGLE_CLIENT_ID!, flow.nonce);
      const session = await issueSession(env, claims);
      return redirect(ORIGIN + "/interview/?auth=connected", [reset, cookie(SESSION_COOKIE, session, MAX_SESSION_AGE)]);
    } catch {
      return json({ ok: false, code: "GOOGLE_LOGIN_FAILED" }, 502, { "Set-Cookie": reset });
    }
  }

  if (url.pathname === "/api/auth/session") {
    if (request.method !== "GET") return json({ ok: false }, 405);
    try { return json({ ok: true, user: await readGoogleAccount(request, env) }); }
    catch { return json({ ok: false, code: "ACCOUNT_UNAVAILABLE" }, 503); }
  }
  if (url.pathname === "/api/auth/logout") {
    if (request.method !== "POST") return json({ ok: false }, 405);
    // Never allow cookie-authenticated actions from cross-origin forms.
    if (request.headers.get("Origin") !== ORIGIN) return json({ ok: false, code: "INVALID_ORIGIN" }, 403);
    const token = getCookie(request, SESSION_COOKIE);
    if (token && /^[A-Za-z0-9_-]{43}$/.test(token) && env.INTERVIEW_DB) {
      try {
        await env.INTERVIEW_DB.prepare("DELETE FROM oauth_sessions WHERE token_hash=?")
          .bind(await sha256(token)).run();
      } catch { return json({ ok: false, code: "LOGOUT_UNAVAILABLE" }, 503); }
    }
    return json({ ok: true }, 200, { "Set-Cookie": cookie(SESSION_COOKIE, "", 0) });
  }
  return json({ ok: false }, 404);
}
