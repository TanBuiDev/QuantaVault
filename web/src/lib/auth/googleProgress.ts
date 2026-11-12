import { readGoogleAccount, type OAuthEnv } from "./googleOAuth";
import type { InterviewProgressState } from "../interview/types";

const ORIGIN = "https://quantavault.pages.dev";
const HEADERS = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const blank = (): InterviewProgressState => ({ learned: {}, review: {}, bookmarks: {} });
const result = (data: unknown, status = 200) => Response.json(data, { status, headers: HEADERS });

function parseProgress(payload: unknown): InterviewProgressState | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const data = payload as Record<string, unknown>;
  const state = blank();
  let count = 0;
  for (const field of ["learned", "review", "bookmarks"] as const) {
    const entries = data[field];
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) return null;
    for (const [id, value] of Object.entries(entries)) {
      if (value !== true || !/^[A-Za-z0-9_-]{1,80}$/.test(id) || ++count > 2400) return null;
      state[field][id] = true;
    }
  }
  if (Object.keys(state.learned).some(id => state.review[id])) return null;
  return state;
}

/** Independent from legacy /api/interview-progress; no implicit account takeover. */
export async function handleGoogleProgress(request: Request, env: OAuthEnv): Promise<Response> {
  if (new URL(request.url).origin !== ORIGIN) return result({ ok: false, code: "HOST_NOT_ALLOWED" }, 404);
  if (request.method !== "GET" && request.method !== "PUT") return result({ ok: false }, 405);
  if (!env.INTERVIEW_DB) return result({ ok: false, code: "DATABASE_UNAVAILABLE" }, 503);
  try {
    const user = await readGoogleAccount(request, env);
    if (!user) return result({ ok: false, code: "NOT_SIGNED_IN" }, 401);
    const db = env.INTERVIEW_DB;
    if (request.method === "GET") {
      const row = await db.prepare("SELECT state_json, revision FROM oauth_interview_progress WHERE user_id=?")
        .bind(user.id).first<{ state_json: string; revision: number }>();
      if (!row) return result({ ok: true, revision: 0, state: blank() });
      const state = parseProgress(JSON.parse(row.state_json));
      if (!state) return result({ ok: false, code: "INVALID_SAVED_PROGRESS" }, 500);
      return result({ ok: true, revision: row.revision, state });
    }
    // Cookie-based writes require an explicit same-origin POST/PUT Origin header.
    if (request.headers.get("Origin") !== ORIGIN) return result({ ok: false, code: "INVALID_ORIGIN" }, 403);
    if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") return result({ ok: false, code: "INVALID_CONTENT_TYPE" }, 415);
    if (Number(request.headers.get("Content-Length") || 0) > 150_000) return result({ ok: false, code: "TOO_LARGE" }, 413);
    const body = await request.text();
    if (body.length > 150_000) return result({ ok: false, code: "TOO_LARGE" }, 413);
    let input: { state?: unknown; revision?: unknown };
    try { input = JSON.parse(body); } catch { return result({ ok: false, code: "INVALID_JSON" }, 400); }
    const state = parseProgress(input?.state);
    const rev = input?.revision;
    if (!state || !Number.isSafeInteger(rev) || (rev as number) < 0) return result({ ok: false, code: "INVALID_PROGRESS" }, 400);
    const serialized = JSON.stringify(state);
    if (serialized.length > 140_000) return result({ ok: false, code: "TOO_LARGE" }, 413);
    const operation = rev === 0
      ? await db.prepare("INSERT INTO oauth_interview_progress (user_id,state_json,revision) VALUES (?,?,1) ON CONFLICT(user_id) DO NOTHING")
        .bind(user.id, serialized).run()
      : await db.prepare("UPDATE oauth_interview_progress SET state_json=?, revision=revision+1, updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND revision=?")
        .bind(serialized, user.id, rev).run();
    if (operation.meta?.changes !== 1) return result({ ok: false, code: "VERSION_CONFLICT" }, 409);
    return result({ ok: true, revision: (rev as number) + 1 });
  } catch {
    return result({ ok: false, code: "PROGRESS_UNAVAILABLE" }, 503);
  }
}
