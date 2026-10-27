// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/code-versions/route";
import { assertLocalRequest, readLocalJson } from "./localGuard";

afterEach(() => vi.unstubAllEnvs());
function request(headers: Record<string, string> = {}, body = "{}") {
  return new Request("http://127.0.0.1:3000/api/code-versions", { method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000", "content-type": "application/json", "x-workspace-request": "1", ...headers }, body });
}
describe("local mutation boundary", () => {
  it("accepts exact same-origin requests from both loopback names", () => {
    expect(() => assertLocalRequest(request())).not.toThrow();
    expect(() => assertLocalRequest(request({ host: "localhost:3000", origin: "http://localhost:3000" }))).not.toThrow();
  });
  it.each(["host", "origin"])("rejects missing %s", async name => {
    const req = request();
    req.headers.delete(name);
    expect((await POST(req)).status).toBe(403);
  });
  it("requires the configured port and refuses a cross-loopback origin", () => {
    vi.stubEnv("LOCAL_APP_ORIGIN", "http://127.0.0.1:4567");
    expect(() => assertLocalRequest(request())).toThrow();
    expect(() => assertLocalRequest(request({ host: "localhost:4567", origin: "http://localhost:4567" }))).not.toThrow();
    expect(() => assertLocalRequest(request({ host: "localhost:4567", origin: "http://127.0.0.1:4567" }))).toThrow();
  });
  it("fails closed on an invalid configured origin", async () => {
    vi.stubEnv("LOCAL_APP_ORIGIN", "http://0.0.0.0:3000");
    expect((await POST(request())).status).toBe(503);
  });
  it("requires JSON content type", async () => {
    expect((await POST(request({ "content-type": "text/plain" }))).status).toBe(415);
  });
  it("rejects arrays and null JSON bodies", async () => {
    await expect(readLocalJson(request({}, "[]"))).rejects.toMatchObject({ status: 400 });
    await expect(readLocalJson(request({}, "null"))).rejects.toMatchObject({ status: 400 });
  });
  it.each(["https://evil.example", "null", "http://127.0.0.1:3001"])("rejects origin %s", async origin => {
    expect((await POST(request({ origin }))).status).toBe(403);
  });
  it("rejects a missing custom header", async () => {
    expect((await POST(request({ "x-workspace-request": "" }))).status).toBe(403);
  });
  it("rejects a non-local Host even with forwarded loopback", async () => {
    expect((await POST(request({ host: "evil.example", "x-forwarded-host": "127.0.0.1:3000" }))).status).toBe(403);
  });
  it("returns 400 for invalid JSON", async () => {
    expect((await POST(request({}, "{"))).status).toBe(400);
  });
  it("bounds request bytes", async () => {
    expect((await POST(request({}, JSON.stringify({ source: "x".repeat(1048576) })))).status).toBe(413);
  });
  it("rejects invalid field types", async () => {
    expect((await POST(request({}, JSON.stringify({ problemId: "999999", source: "code" })))).status).toBe(400);
  });
});
