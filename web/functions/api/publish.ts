import { handlePublishRequest } from "../../src/lib/interview/publishHandler";
import type { PublishEnv } from "../../src/lib/interview/githubPublish";

interface PublishContext { request: Request; env: PublishEnv }
export function onRequestPost({ request, env }: PublishContext): Promise<Response> {
  return handlePublishRequest(request, env);
}
export function onRequestOptions({ request, env }: PublishContext): Promise<Response> {
  return handlePublishRequest(request, env);
}
