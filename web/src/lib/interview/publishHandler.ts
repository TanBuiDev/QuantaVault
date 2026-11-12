import { executePublishToGithub, PublishError, readBoundedJson, validatePublishConfig, type PublishEnv } from "./githubPublish";
import { globalRateLimiter } from "./rateLimiter";
import { authorizedAdmin } from "../auth/adminAccess";
import type { OAuthEnv } from "../auth/googleOAuth";

const MAX_BYTES = 8 * 1024 * 1024;
function allowedOrigin(request: Request, env: PublishEnv): string {
  const configured = env.PUBLISH_ORIGINS?.split(",").map(value => value.trim()).filter(Boolean);
  if (!configured?.length || configured.some(value => {
    try { return new URL(value).origin !== value || !/^https?:$/.test(new URL(value).protocol); } catch { return true; }
  })) throw new PublishError(503, "CONFIGURATION_MISSING", "Máy chủ chưa cấu hình origin xuất bản hợp lệ.");
  const origin = request.headers.get("Origin");
  if (!origin || !configured.includes(origin)) throw new PublishError(403, "ORIGIN_FORBIDDEN", "Nguồn yêu cầu xuất bản không được phép.");
  return origin;
}
function json(value: unknown, status: number, extra: HeadersInit = {}): Response {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra } });
}
export async function handlePublishRequest(request: Request, env: PublishEnv & OAuthEnv): Promise<Response> {
  try {
    validatePublishConfig(env);
    const origin = allowedOrigin(request, env);
    const cors = { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    if (request.method !== "POST") return json({ success: false, code: "METHOD_NOT_ALLOWED", error: "Chỉ hỗ trợ POST." }, 405, { Allow: "POST, OPTIONS" });
    const admin = await authorizedAdmin(request, env, true);
    if (!admin) return json({ success: false, code: "ADMIN_AUTH_REQUIRED", error: "Cần đăng nhập tài khoản admin và xác thực mật khẩu quản trị." }, 403);
    if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") return json({ success: false, code: "INVALID_PAYLOAD", error: "Content-Type phải là application/json." }, 415);
    if (Number(request.headers.get("Content-Length")) > MAX_BYTES) throw new PublishError(413, "BODY_TOO_LARGE", "Dữ liệu vượt giới hạn cho phép.");
    const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const check = globalRateLimiter.check(ip);
    if (!check.allowed) return json({ success: false, code: "RATE_LIMITED", error: check.message, locked: true, retryAfterSeconds: check.retryAfterSeconds }, 429, { ...cors, "Retry-After": String(check.retryAfterSeconds) });
    let value: unknown;
    try { value = await readBoundedJson(request.body, MAX_BYTES); }
    catch (error) {
      if (error instanceof PublishError) throw error;
      throw new PublishError(400, "INVALID_PAYLOAD", "JSON không hợp lệ.");
    }
    const result = await executePublishToGithub(value, env, true);
    if (result.code === "AUTHENTICATION_FAILED") {
      const fail = globalRateLimiter.recordFailure(ip);
      return json({ ...result, locked: fail.locked, retryAfterSeconds: fail.retryAfterSeconds }, fail.locked ? 429 : 401, { ...cors, ...(fail.locked ? { "Retry-After": String(fail.retryAfterSeconds) } : {}) });
    }
    if (result.success) globalRateLimiter.recordSuccess(ip);
    return json(result, result.success ? 200 : result.status || 500, cors);
  } catch (error) {
    if (error instanceof PublishError) return json({ success: false, code: error.code, error: error.message }, error.status);
    return json({ success: false, code: "INTERNAL_ERROR", error: "Không thể xử lý yêu cầu xuất bản." }, 500);
  }
}
