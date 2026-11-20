import { readGoogleAccount, type OAuthEnv } from "./googleOAuth";

const ORIGIN = "https://quantavault.pages.dev";
const HEADERS = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: HEADERS });
type Kind = "courses" | "top150";
const ID = /^[A-Za-z0-9_-]{1,100}$/;
function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
const initial = (kind: Kind) => kind === "courses"
  ? { version: 1, courses: {} }
  : { version: 1, problems: {} };

function validateCourses(value: unknown): unknown | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.courses)) return null;
  const entries = Object.entries(value.courses);
  if (entries.length > 200) return null;
  const courses: Record<string, unknown> = {};
  for (const [id, item] of entries) {
    if (!ID.test(id) || !isRecord(item) || !Array.isArray(item.completedLessonIds)
      || item.completedLessonIds.length > 500 || typeof item.updatedAt !== "string"
      || item.updatedAt.length > 50 || (item.updatedAt && Number.isNaN(Date.parse(item.updatedAt)))
      || (item.lastAccessedLessonId !== undefined && (typeof item.lastAccessedLessonId !== "string" || !ID.test(item.lastAccessedLessonId)))) return null;
    const lessons: string[] = [];
    for (const lesson of item.completedLessonIds) {
      if (typeof lesson !== "string" || !ID.test(lesson)) return null;
      if (!lessons.includes(lesson)) lessons.push(lesson);
    }
    courses[id] = {
      completedLessonIds: lessons,
      updatedAt: item.updatedAt,
      ...(item.lastAccessedLessonId ? { lastAccessedLessonId: item.lastAccessedLessonId } : {}),
    };
  }
  return { version: 1, courses };
}
function validateTop150(value: unknown): unknown | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.problems)) return null;
  const entries = Object.entries(value.problems);
  if (entries.length > 500) return null;
  const problems: Record<string, unknown> = {};
  for (const [key, p] of entries) {
    const id = Number(key);
    if (!Number.isSafeInteger(id) || id < 1 || id > 1000000 || String(id) !== key || !isRecord(p)
      || p.problemId !== id || !["not-started", "in-progress", "solved", "review"].includes(String(p.status))
      || typeof p.bookmarked !== "boolean" || typeof p.solutionViewed !== "boolean"
      || typeof p.interviewViewed !== "boolean" || typeof p.notes !== "string" || p.notes.length > 10000
      || typeof p.updatedAt !== "string" || Number.isNaN(Date.parse(p.updatedAt))
      || p.updatedAt.length > 50 || !Number.isSafeInteger(p.revealedHints)
      || (p.revealedHints as number) < 0 || (p.revealedHints as number) > 1000
      || (p.confidence !== null && ![1,2,3,4,5].includes(Number(p.confidence)))) return null;
    problems[key] = {
      problemId:id, status:p.status, bookmarked:p.bookmarked, confidence:p.confidence,
      revealedHints:p.revealedHints, solutionViewed:p.solutionViewed,
      interviewViewed:p.interviewViewed, notes:p.notes, updatedAt:p.updatedAt,
    };
  }
  return { version: 1, problems };
}
function parse(kind: Kind, state: unknown): unknown | null {
  return kind === "courses" ? validateCourses(state) : validateTop150(state);
}

/** Account-specific course and Top Interview 150 progress; never touches legacy sync-code data. */
export async function handleGoogleLearningProgress(request: Request, env: OAuthEnv): Promise<Response> {
  const url = new URL(request.url);
  if (url.origin !== ORIGIN) return json({ ok:false, code:"HOST_NOT_ALLOWED" },404);
  if (request.method !== "GET" && request.method !== "PUT") return json({ok:false},405);
  if (!env.INTERVIEW_DB) return json({ok:false, code:"DATABASE_UNAVAILABLE"},503);
  const kind = url.searchParams.get("kind");
  if (kind !== "courses" && kind !== "top150") return json({ok:false,code:"INVALID_KIND"},400);
  try {
    const user = await readGoogleAccount(request, env);
    if (!user) return json({ok:false,code:"NOT_SIGNED_IN"},401);
    if (url.searchParams.get("userId") !== user.id) return json({ok:false,code:"ACCOUNT_MISMATCH"},403);
    const db = env.INTERVIEW_DB;
    if (request.method === "GET") {
      const row = await db.prepare("SELECT state_json,revision FROM oauth_learning_progress WHERE user_id=? AND kind=?")
        .bind(user.id,kind).first<{state_json:string;revision:number}>();
      if (!row) return json({ok:true,kind,revision:0,state:initial(kind)});
      const state = parse(kind,JSON.parse(row.state_json));
      if (!state) return json({ok:false,code:"INVALID_SAVED_PROGRESS"},500);
      return json({ok:true,kind,revision:row.revision,state});
    }
    if (request.headers.get("Origin") !== ORIGIN) return json({ok:false,code:"INVALID_ORIGIN"},403);
    if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") return json({ok:false,code:"INVALID_CONTENT_TYPE"},415);
    if (Number(request.headers.get("Content-Length") || 0) > 300000) return json({ok:false,code:"TOO_LARGE"},413);
    const bodyText = await request.text();
    if (bodyText.length > 300000) return json({ok:false,code:"TOO_LARGE"},413);
    let body: {revision?:unknown;state?:unknown;userId?:unknown;kind?:unknown};
    try { body = JSON.parse(bodyText); } catch { return json({ok:false,code:"INVALID_JSON"},400); }
    if (!isRecord(body) || body.userId !== user.id || body.kind !== kind
      || !Number.isSafeInteger(body.revision) || Number(body.revision) < 0) return json({ok:false,code:"INVALID_REQUEST"},400);
    const state = parse(kind,body.state);
    if (!state) return json({ok:false,code:"INVALID_PROGRESS"},400);
    const raw = JSON.stringify(state);
    if (raw.length > 280000) return json({ok:false,code:"TOO_LARGE"},413);
    const rev = body.revision as number;
    const operation = rev === 0
      ? await db.prepare("INSERT INTO oauth_learning_progress (user_id,kind,state_json,revision) VALUES (?,?,?,1) ON CONFLICT(user_id,kind) DO NOTHING")
        .bind(user.id,kind,raw).run()
      : await db.prepare("UPDATE oauth_learning_progress SET state_json=?,revision=revision+1,updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND kind=? AND revision=?")
        .bind(raw,user.id,kind,rev).run();
    if (operation.meta?.changes !== 1) return json({ok:false,code:"VERSION_CONFLICT"},409);
    return json({ok:true,kind,revision:rev+1});
  } catch {
    return json({ok:false,code:"PROGRESS_UNAVAILABLE"},503);
  }
}
