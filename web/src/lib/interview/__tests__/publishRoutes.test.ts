// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/publish/route";
import { onRequestPost } from "../../../../functions/api/publish";
import { generateTOTP } from "../totp";

const origin = "https://study.example";
const env = { ADMIN_PIN: "test-pin", TOTP_SECRET: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", GITHUB_PAT: "test-token", PUBLISH_ORIGINS: origin }; // RFC 6238 public test vector, never a runtime secret. gitleaks:allow
const question = { id: "q-new", title: "New", category: "java-core", difficulty: "junior", tags: [], summary: "Summary", answerMarkdown: "Answer" };
let ip = 0;
async function request(overrides: Record<string, unknown> = {}, requestOrigin = origin) {
  return new Request(`${origin}/api/publish`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin, "CF-Connecting-IP": `test-${++ip}`, "x-forwarded-for": `test-${ip}` },
    body: JSON.stringify({ pin: env.ADMIN_PIN, otp: await generateTOTP(env.TOTP_SECRET), baseVersions: { "q-new": "qv1:null" }, modifiedQuestions: [question], ...overrides }),
  });
}
describe.each(["node", "pages"])("publish endpoint %s", surface => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  async function run(req: Request, settings: typeof env = env) {
    for (const [key, value] of Object.entries(settings)) vi.stubEnv(key, value);
    return surface === "node" ? POST(req) : onRequestPost({ request: req, env: settings });
  }
  it("blocks requests from another origin before any GitHub call", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const response = await run(await request({}, "https://untrusted.example"));
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "ORIGIN_FORBIDDEN" });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("requires PIN and OTP", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const response = await run(await request({ otp: "000invalid" }));
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "AUTHENTICATION_FAILED" });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects bodies above the bounded request limit", async () => {
    const req = new Request(`${origin}/api/publish`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", "Content-Length": String(9 * 1024 * 1024) }, body: "{}" });
    expect((await run(req)).status).toBe(413);
  });
  it("rejects malformed JSON", async () => {
    const req = new Request(`${origin}/api/publish`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{" });
    const response = await run(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "INVALID_PAYLOAD" });
  });
  it("does not allow publishing without configured origins", async () => {
    const response = await run(await request(), { ...env, PUBLISH_ORIGINS: "" });
    expect(response.status).toBe(503);
  });
});
