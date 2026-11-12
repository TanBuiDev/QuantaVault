import { onRequestPost, onRequestOptions } from "../functions/api/publish";
import { handleInterviewProgress, type ProgressEnv } from "../functions/api/interview-progress";
import { handleGoogleAuth, type OAuthEnv } from "../src/lib/auth/googleOAuth";
import { handleGoogleProgress } from "../src/lib/auth/googleProgress";

export default {
  async fetch(request: Request, env: Parameters<typeof onRequestPost>[0]["env"] & ProgressEnv & OAuthEnv) {
    const pathname = new URL(request.url).pathname.replace(/\/$/, "");
    if (pathname === "/api/interview-progress") return handleInterviewProgress({ request, env });
    if (pathname.startsWith("/api/auth/")) return handleGoogleAuth(request, env);
    if (pathname === "/api/google-progress") return handleGoogleProgress(request, env);
    if (pathname === "/api/publish") {
      if (request.method === "OPTIONS") return onRequestOptions({ request, env });
      if (request.method === "POST") return onRequestPost({ request, env });
      return Response.json({ success: false, code: "METHOD_NOT_ALLOWED", error: "Method not allowed." }, { status: 405, headers: { Allow: "POST, OPTIONS" } });
    }
    if (pathname === "/api" || pathname.startsWith("/api/")) return Response.json({ success: false, code: "STATIC_STUDY_ONLY", error: "This API is available only in the local workspace." }, { status: 404 });
    return (env as typeof env & { ASSETS: { fetch(request: Request): Promise<Response> } }).ASSETS.fetch(request);
  },
};
