import { INTERVIEW_CATEGORIES, type InterviewQuestion } from "./types";
import { verifyTOTP } from "./totp";
import { fromBase32 } from "./base32";
import { canonicalQuestion, questionVersion } from "./questionVersion";
import { isRetiredInterviewId } from "./questionIdMerge";

export interface PublishEnv {
  GITHUB_PAT?: string; GITHUB_OWNER?: string; GITHUB_REPO?: string;
  ADMIN_PIN?: string; TOTP_SECRET?: string; PUBLISH_ORIGINS?: string;
}
export type PublishQuestionItem = InterviewQuestion & { isDeleted?: boolean };
export interface PublishPayload {
  pin: string; otp: string; modifiedQuestions: PublishQuestionItem[];
  baseVersions: Record<string, string>; commitMessage?: string;
}
export interface PublishResult {
  success: boolean; status?: number; code?: string; error?: string;
  commitSha?: string; commitUrl?: string; message?: string; count?: number;
  conflictingIds?: string[];
  conflicts?: PublishConflict[];
}
export interface PublishConflict { id: string; current: InterviewQuestion | null }
export class PublishError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown, max: number, nonempty = false): v is string => typeof v === "string" && v.length <= max && (!nonempty || !!v.trim());
const strings = (v: unknown) => Array.isArray(v) && v.length <= 100 && v.every(x => text(x, 1000));
export function validQuestion(v: unknown): v is PublishQuestionItem {
  if (!record(v)) return false;
  return text(v.id, 100, true) && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(v.id)
    && text(v.title, 2000, true) && typeof v.category === "string" && Object.hasOwn(INTERVIEW_CATEGORIES, v.category)
    && ["junior", "middle", "senior"].includes(v.difficulty as string)
    && strings(v.tags) && (v.companies === undefined || strings(v.companies))
    && text(v.summary, 20000) && text(v.answerMarkdown, 500000)
    && (v.keyTakeaways === undefined || strings(v.keyTakeaways))
    && (v.relatedProblems === undefined || (Array.isArray(v.relatedProblems) && v.relatedProblems.length <= 200 && v.relatedProblems.every(n => Number.isSafeInteger(n) && n > 0)))
    && (v.isDeleted === undefined || typeof v.isDeleted === "boolean");
}
export function validatePublishPayload(value: unknown, verifiedAdmin = false): PublishPayload {
  if (!record(value) || (!verifiedAdmin && (!text(value.pin, 256, true) || !text(value.otp, 32, true)))
    || !Array.isArray(value.modifiedQuestions) || value.modifiedQuestions.length === 0 || value.modifiedQuestions.length > 1000
    || !value.modifiedQuestions.every(validQuestion) || !record(value.baseVersions)
    || (value.commitMessage !== undefined && !text(value.commitMessage, 2000))) {
    throw new PublishError(400, "INVALID_PAYLOAD", "Dữ liệu xuất bản không hợp lệ hoặc thiếu phiên bản nền. Hãy cập nhật trang và kiểm tra bản nháp.");
  }
  const ids = value.modifiedQuestions.map(q => q.id);
  if (ids.some(isRetiredInterviewId)) {
    throw new PublishError(409, "RETIRED_QUESTION_ID", "Câu hỏi này đã được hợp nhất. Bản cũ vẫn được giữ để sao lưu; vui lòng chỉnh sửa câu hỏi chính.");
  }
  if (new Set(ids).size !== ids.length || ids.some(id => !Object.hasOwn(value.baseVersions as object, id) || !text((value.baseVersions as Record<string, unknown>)[id], 600000, true))) {
    throw new PublishError(400, "INVALID_PAYLOAD", "ID bị trùng hoặc thiếu phiên bản nền của câu hỏi.");
  }
  return value as unknown as PublishPayload;
}
export function validatePublishConfig(env: PublishEnv): void {
  try {
    if (!env.ADMIN_PIN?.trim() || !env.GITHUB_PAT?.trim() || !env.TOTP_SECRET?.trim()
      || env.ADMIN_PIN.length > 256 || fromBase32(env.TOTP_SECRET).length < 20
      || !/^[a-zA-Z0-9_.-]+$/.test(env.GITHUB_OWNER || "TanBuiDev")
      || !/^[a-zA-Z0-9_.-]+$/.test(env.GITHUB_REPO || "QuantaVault")) throw new Error();
  } catch {
    throw new PublishError(503, "CONFIGURATION_MISSING", "Máy chủ chưa cấu hình đầy đủ thông tin xác thực xuất bản.");
  }
}
async function constantTimeEqual(left: string, right: string): Promise<boolean> {
  const encode = new TextEncoder();
  const [a, b] = await Promise.all([left, right].map(value => crypto.subtle.digest("SHA-256", encode.encode(value))));
  const av = new Uint8Array(a), bv = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < av.length; i++) difference |= av[i] ^ bv[i];
  return difference === 0;
}
export async function readBoundedJson(body: ReadableStream<Uint8Array> | null, limit: number): Promise<unknown> {
  if (!body) throw new Error("Missing body");
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let size = 0, content = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        void reader.cancel().catch(() => undefined);
        throw new PublishError(413, "BODY_TOO_LARGE", "Dữ liệu vượt giới hạn cho phép.");
      }
      content += decoder.decode(value, { stream: true });
    }
    return JSON.parse(content + decoder.decode());
  } finally { reader.releaseLock(); }
}
const failure = (status: number, code: string, error: string): PublishResult => ({ success: false, status, code, error });
function sha(value: unknown): string {
  if (typeof value !== "string" || !/^[a-f0-9]{40}$/.test(value)) throw new Error("Invalid SHA");
  return value;
}

export async function executePublishToGithub(value: unknown, env: PublishEnv, verifiedAdmin = false): Promise<PublishResult> {
  try {
    validatePublishConfig(env);
    const payload = validatePublishPayload(value, verifiedAdmin);
    if (!verifiedAdmin) {
      const [pinValid, otpValid] = await Promise.all([
        constantTimeEqual(payload.pin.trim(), env.ADMIN_PIN!.trim()),
        /^\d{6}$/.test(payload.otp.trim()) ? verifyTOTP(payload.otp.trim(), env.TOTP_SECRET!.trim(), { window: 1 }) : Promise.resolve(false),
      ]);
      if (!pinValid || !otpValid) return failure(401, "AUTHENTICATION_FAILED", "Mã PIN hoặc OTP không hợp lệ. Cần xác thực cả hai yếu tố.");
    }

    const owner = env.GITHUB_OWNER || "TanBuiDev", repo = env.GITHUB_REPO || "QuantaVault";
    const api = `https://api.github.com/repos/${owner}/${repo}`;
    const headers = { Authorization: `Bearer ${env.GITHUB_PAT}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "QuantaVault-Publisher", "X-GitHub-Api-Version": "2026-03-10" };
    async function github(endpoint: string, init: RequestInit = {}, raw = false): Promise<unknown> {
      const res = await fetch(`${api}${endpoint}`, { ...init, headers: { ...headers, ...(raw ? { Accept: "application/vnd.github.raw+json" } : {}) }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) {
        void res.body?.cancel().catch(() => undefined);
        if (init.method === "PATCH" && (res.status === 409 || res.status === 422)) throw new PublishError(409, "CONFLICT", "Nhánh main đã thay đổi. Bản nháp vẫn được giữ; hãy tải dữ liệu mới để đối chiếu.");
        throw new PublishError(502, "GITHUB_UNAVAILABLE", "Không thể hoàn tất thao tác GitHub. Bản nháp vẫn được giữ.");
      }
      return readBoundedJson(res.body, 16 * 1024 * 1024);
    }
    const ref = await github("/git/ref/heads/main") as { object?: { sha?: string } };
    const head = sha(ref.object?.sha);
    const commit = await github(`/git/commits/${head}`) as { tree?: { sha?: string } };
    const baseTree = sha(commit.tree?.sha);
    const current = await github(`/contents/data/interview-questions.json?ref=${head}`, {}, true);
    if (!Array.isArray(current) || !current.every(validQuestion) || new Set(current.map(q => q.id)).size !== current.length) throw new Error("Invalid canonical data");
    const currentMap = new Map<string, InterviewQuestion>(current.map(q => [q.id, q]));
    const conflicts = payload.modifiedQuestions.filter(q => questionVersion(currentMap.get(q.id) ?? null) !== payload.baseVersions[q.id]).map(q => q.id);
    if (conflicts.length) return { ...failure(409, "CONFLICT", "Có câu hỏi đã thay đổi trên GitHub. Hãy đối chiếu trước khi xuất bản lại."), conflictingIds: conflicts,
      conflicts: conflicts.map(id => ({ id, current: currentMap.has(id) ? canonicalQuestion(currentMap.get(id)!) : null })) };
    const modified = new Map(payload.modifiedQuestions.map(q => [q.id, q]));
    const finalQuestions: InterviewQuestion[] = [];
    for (const q of current) {
      const change = modified.get(q.id);
      if (!change?.isDeleted) finalQuestions.push(canonicalQuestion(change ?? q));
    }
    for (const q of payload.modifiedQuestions) if (!currentMap.has(q.id) && !q.isDeleted) finalQuestions.unshift(canonicalQuestion(q));
    // All metadata is removed, and both canonical copies use exactly the same bytes.
    const formatted = JSON.stringify(finalQuestions, null, 2) + "\n";
    const tree = await github("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: baseTree, tree: ["data/interview-questions.json", "web/src/data/interview-questions.json"].map(path => ({ path, mode: "100644", type: "blob", content: formatted })) }) }) as { sha?: string };
    const treeSha = sha(tree.sha);
    if (treeSha === baseTree) return { success: true, count: 0, commitSha: head, message: "Nội dung đã khớp; không cần tạo commit mới." };
    const created = await github("/git/commits", { method: "POST", body: JSON.stringify({ message: payload.commitMessage?.trim() || `feat(interview): update ${payload.modifiedQuestions.length} questions`, tree: treeSha, parents: [head] }) }) as { sha?: string };
    const commitSha = sha(created.sha);
    await github("/git/refs/heads/main", { method: "PATCH", body: JSON.stringify({ sha: commitSha, force: false }) });
    return { success: true, commitSha, commitUrl: `https://github.com/${owner}/${repo}/commit/${commitSha}`, count: payload.modifiedQuestions.length, message: `Đã ghi ${payload.modifiedQuestions.length} câu hỏi lên GitHub; đang chờ website cập nhật.` };
  } catch (error) {
    if (error instanceof PublishError) return failure(error.status, error.code, error.message);
    // Do not return upstream messages: they can contain headers or request content.
    return failure(502, "GITHUB_UNAVAILABLE", "Không thể đọc dữ liệu gốc hoặc hoàn tất giao dịch GitHub. Bản nháp vẫn được giữ.");
  }
}
