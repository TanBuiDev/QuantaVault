// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/run-code/route";
import { executeCode } from "@/lib/piston";
import { getProblemContent } from "@/lib/content";
import { stringify } from "yaml";

vi.mock("@/lib/piston", () => ({ executeCode: vi.fn() }));
vi.mock("@/lib/content", () => ({ getProblemContent: vi.fn() }));
const request = (body: unknown) => new Request("http://127.0.0.1:3000/api/run-code", {
  method: "POST", headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000", "content-type": "application/json", "x-workspace-request": "1" }, body: JSON.stringify(body),
});
const body = { problemId: 1, sourceCode: "class Solution { public int solve(int n) { return n; } }", mode: "run" };
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getProblemContent).mockReturnValue({ casesYaml: stringify({ schema_version: 1, problem_id: 1, contract_type: "method", language_contract: { class: "Solution", method: "solve", parameters: [{ name: "n", type: "int" }], return_type: "int" }, cases: [1, 2, 3, 4].map(n => ({ name: `case-${n}`, input: { n }, expected: n })) }) } as ReturnType<typeof getProblemContent>);
  vi.mocked(executeCode).mockResolvedValue({ language: "java", version: "docker", run: { stdout: "", stderr: "", output: "", code: 0, signal: null } });
});
describe("server-owned judge API", () => {
  it("rejects a client-supplied test suite", async () => {
    expect((await POST(request({ ...body, casesData: { cases: [] } }))).status).toBe(400);
    expect(executeCode).not.toHaveBeenCalled();
  });
  it("selects three server cases for Run and all for Submit", async () => {
    const run = await (await POST(request(body))).json();
    expect(run.totalCases).toBe(3);
    const submit = await (await POST(request({ ...body, mode: "submit" }))).json();
    expect(submit.totalCases).toBe(4);
    expect(vi.mocked(executeCode).mock.calls[0][0].files[0].content).toContain("case0_n = 1");
  });
  it("returns 404 for an unknown canonical problem", async () => {
    vi.mocked(getProblemContent).mockReturnValue(null);
    expect((await POST(request(body))).status).toBe(404);
    expect(executeCode).not.toHaveBeenCalled();
  });
  it("preserves infrastructure status and code", async () => {
    vi.mocked(executeCode).mockRejectedValue(Object.assign(new Error("Start Docker"), { status: 503, errorCode: "DOCKER_UNAVAILABLE" }));
    const response = await POST(request(body));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ overallStatus: "SERVER_ERROR", errorCode: "DOCKER_UNAVAILABLE" });
  });
  it("logs unexpected failures while returning a generic response", async () => {
    const failure = new Error("private filesystem detail");
    vi.mocked(getProblemContent).mockImplementation(() => { throw failure; });
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(request(body));
    expect(response.status).toBe(500);
    expect(logged).toHaveBeenCalledWith("API /api/run-code unexpected failure", failure);
    expect(JSON.stringify(await response.json())).not.toContain("private filesystem detail");
  });
});
