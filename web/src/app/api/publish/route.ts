import { handlePublishRequest } from "@/lib/interview/publishHandler";

export const runtime = "nodejs";
function publish(request: Request): Promise<Response> {
  return handlePublishRequest(request, {
    ADMIN_PIN: process.env.ADMIN_PIN, TOTP_SECRET: process.env.TOTP_SECRET,
    GITHUB_PAT: process.env.GITHUB_PAT, GITHUB_OWNER: process.env.GITHUB_OWNER,
    GITHUB_REPO: process.env.GITHUB_REPO, PUBLISH_ORIGINS: process.env.PUBLISH_ORIGINS,
  });
}
export const POST = publish;
export const OPTIONS = publish;
