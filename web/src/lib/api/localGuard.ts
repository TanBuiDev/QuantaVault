import "server-only";
import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function assertLocalRequest(request: Request): void {
  let configured: URL;
  try {
    configured = new URL(process.env.LOCAL_APP_ORIGIN || "http://127.0.0.1:3000");
    if (configured.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(configured.hostname) || configured.username || configured.password || configured.pathname !== "/" || configured.search || configured.hash) throw new Error();
  } catch {
    throw new ApiError(503, "LOCAL_ORIGIN_INVALID", "LOCAL_APP_ORIGIN must be an HTTP loopback origin.");
  }
  const port = configured.port ? `:${configured.port}` : "";
  const hosts = new Set([`127.0.0.1${port}`, `localhost${port}`]);
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (!host || !hosts.has(host) || origin !== `http://${host}` || request.headers.get("x-workspace-request") !== "1") {
    throw new ApiError(403, "LOCAL_REQUEST_REQUIRED", "Only same-origin local workspace requests are allowed.");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new ApiError(415, "JSON_REQUIRED", "Content-Type must be application/json.");
  }
}

export async function readLocalJson(request: Request, maxBytes = 1048576): Promise<Record<string, unknown>> {
  assertLocalRequest(request);
  const length = request.headers.get("content-length");
  if (length && /^\d+$/.test(length) && Number(length) > maxBytes) throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, "INVALID_JSON", "A JSON object is required.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        void reader.cancel().catch(() => undefined);
        throw new ApiError(413, "BODY_TOO_LARGE", "Request body is too large.");
      }
      chunks.push(value);
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "INVALID_JSON", "A valid JSON object is required.");
  } finally {
    reader.releaseLock();
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  console.error("Workspace API failure", error);
  return NextResponse.json({ error: "Unable to complete the workspace operation.", code: "INTERNAL_ERROR" }, { status: 500 });
}
