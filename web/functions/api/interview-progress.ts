/**
 * Cloudflare Pages Worker endpoint for private interview study progress.
 * Security model: a randomly generated 256-bit sync code is a bearer secret.
 * Only its SHA-256 hash is used as the D1 owner key; it is never logged or sent in a URL.
 */
type ProgressState = {
  learned: Record<string, boolean>;
  review: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
};

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<{ meta?: { changes?: number } }>;
}
interface D1Database {
  prepare(sql: string): D1Statement;
}
export interface ProgressEnv { INTERVIEW_DB?: D1Database }
interface Context { request: Request; env: ProgressEnv }

const NO_CACHE = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const empty = (): ProgressState => ({ learned: {}, review: {}, bookmarks: {} });

function respond(data: unknown, status = 200) {
  return Response.json(data, { status, headers: NO_CACHE });
}
function parseState(value: unknown): ProgressState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const object = value as Record<string, unknown>;
  const state = empty();
  let count = 0;
  for (const category of ["learned", "review", "bookmarks"] as const) {
    const source = object[category];
    if (!source || typeof source !== "object" || Array.isArray(source)) return null;
    for (const [id, flag] of Object.entries(source)) {
      if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id) || flag !== true || ++count > 2400) return null;
      state[category][id] = true;
    }
  }
  if (Object.keys(state.learned).some(id => state.review[id])) return null;
  return state;
}
async function ownerFor(request: Request): Promise<string | null> {
  const header = request.headers.get("Authorization") ?? "";
  const match = /^Bearer ([a-f0-9]{64})$/.exec(header);
  if (!match) return null;
  const bytes = new TextEncoder().encode(match[1]);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}
async function readCurrent(db: D1Database, owner: string) {
  return db.prepare("SELECT state_json, revision FROM interview_progress_accounts WHERE owner_hash = ?")
    .bind(owner).first<{ state_json: string; revision: number }>();
}
export async function handleInterviewProgress({ request, env }: Context): Promise<Response> {
  if (!["GET", "PUT"].includes(request.method)) return respond({ ok: false, code: "METHOD_NOT_ALLOWED" }, 405);
  if (!sameOrigin(request)) return respond({ ok: false, code: "INVALID_ORIGIN" }, 403);
  if (!env.INTERVIEW_DB) return respond({ ok: false, code: "D1_UNAVAILABLE" }, 503);
  const owner = await ownerFor(request);
  if (!owner) return respond({ ok: false, code: "UNAUTHORIZED" }, 401);

  try {
    const db = env.INTERVIEW_DB;
    if (request.method === "GET") {
      const current = await readCurrent(db, owner);
      if (!current) return respond({ ok: true, revision: 0, state: empty() });
      const state = parseState(JSON.parse(current.state_json));
      if (!state) return respond({ ok: false, code: "CORRUPT_PROGRESS" }, 500);
      return respond({ ok: true, revision: current.revision, state });
    }
    if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return respond({ ok: false, code: "INVALID_CONTENT_TYPE" }, 415);
    }
    if (Number(request.headers.get("Content-Length") || 0) > 150_000) {
      return respond({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);
    }
    const bodyText = await request.text();
    if (bodyText.length > 150_000) return respond({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(bodyText) as Record<string, unknown>; }
    catch { return respond({ ok: false, code: "INVALID_JSON" }, 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return respond({ ok: false, code: "INVALID_BODY" }, 400);
    const state = parseState(body.state);
    const revision = body.revision;
    const overwrite = body.overwrite === true;
    if (!state || !Number.isSafeInteger(revision) || (revision as number) < 0) {
      return respond({ ok: false, code: "INVALID_PROGRESS" }, 400);
    }
    const json = JSON.stringify(state);
    if (json.length > 140_000) return respond({ ok: false, code: "PAYLOAD_TOO_LARGE" }, 413);
    let changes = 0;
    if (overwrite) {
      const result = await db.prepare(
        "INSERT INTO interview_progress_accounts (owner_hash, state_json, revision, updated_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP) " +
        "ON CONFLICT(owner_hash) DO UPDATE SET state_json=excluded.state_json, revision=interview_progress_accounts.revision+1, updated_at=CURRENT_TIMESTAMP"
      ).bind(owner, json).run();
      changes = result.meta?.changes ?? 0;
    } else if (revision === 0) {
      const result = await db.prepare(
        "INSERT INTO interview_progress_accounts (owner_hash, state_json, revision) VALUES (?, ?, 1) ON CONFLICT(owner_hash) DO NOTHING"
      ).bind(owner, json).run();
      changes = result.meta?.changes ?? 0;
    } else {
      const result = await db.prepare(
        "UPDATE interview_progress_accounts SET state_json=?, revision=revision+1, updated_at=CURRENT_TIMESTAMP WHERE owner_hash=? AND revision=?"
      ).bind(json, owner, revision).run();
      changes = result.meta?.changes ?? 0;
    }
    if (changes !== 1) return respond({ ok: false, code: "VERSION_CONFLICT" }, 409);
    const current = await readCurrent(db, owner);
    return respond({ ok: true, revision: current?.revision ?? 0 });
  } catch {
    // Never log Authorization or payload containing private progress.
    return respond({ ok: false, code: "PROGRESS_STORAGE_ERROR" }, 500);
  }
}
