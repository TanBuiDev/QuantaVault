// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { executePublishToGithub } from "../githubPublish";
import { generateTOTP } from "../totp";
import type { InterviewQuestion } from "../types";

const question: InterviewQuestion = { id: "q-1", title: "Question", category: "java-core", difficulty: "junior", tags: ["Java"], summary: "Summary", answerMarkdown: "Answer" };
const other: InterviewQuestion = { ...question, id: "q-2", title: "Preserve me" };
const originalVersion = `qv1:${JSON.stringify({ id: question.id, title: question.title, category: question.category, difficulty: question.difficulty, tags: question.tags, companies: [], summary: question.summary, answerMarkdown: question.answerMarkdown, keyTakeaways: [], relatedProblems: [] })}`;
const env = { ADMIN_PIN: "test-only-pin", TOTP_SECRET: "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", GITHUB_PAT: "test-token", GITHUB_OWNER: "example", GITHUB_REPO: "repo" }; // RFC 6238 public test vector, never a runtime secret. gitleaks:allow
const head = "a".repeat(40), tree = "b".repeat(40), newTree = "c".repeat(40), commit = "d".repeat(40);
const response = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
let fetchMock: ReturnType<typeof vi.fn>;
async function payload() { return { pin: env.ADMIN_PIN, otp: await generateTOTP(env.TOTP_SECRET), modifiedQuestions: [{ ...question, title: "Changed" }], baseVersions: { [question.id]: originalVersion } }; }
function mockTransaction(canonical: unknown = [question, other], failAt = -1, status = 502) {
  const values = [{ object: { sha: head } }, { tree: { sha: tree } }, canonical, { sha: newTree }, { sha: commit }, {}];
  values.forEach((value, i) => fetchMock.mockResolvedValueOnce(response(value, i === failAt ? status : 200)));
}
describe("safe GitHub publish", () => {
  beforeEach(() => { fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); });
  afterEach(() => vi.unstubAllGlobals());
  it.each(["ADMIN_PIN", "TOTP_SECRET", "GITHUB_PAT"] as const)("fails closed without %s", async key => {
    expect(await executePublishToGithub(await payload(), { ...env, [key]: undefined })).toMatchObject({ success: false, code: "CONFIGURATION_MISSING" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["pin", "otp"] as const)("requires valid %s independently", async key => {
    expect(await executePublishToGithub({ ...await payload(), [key]: "invalid" }, env)).toMatchObject({ success: false, code: "AUTHENTICATION_FAILED" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects missing baseline metadata without writing", async () => {
    expect(await executePublishToGithub({ ...await payload(), baseVersions: {} }, env)).toMatchObject({ code: "INVALID_PAYLOAD" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects duplicate IDs", async () => {
    const data = await payload(); data.modifiedQuestions.push(data.modifiedQuestions[0]);
    expect(await executePublishToGithub(data, env)).toMatchObject({ code: "INVALID_PAYLOAD" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([null, {}, [{ ...question, tags: "bad" }], [question, question]])("rejects invalid canonical data %j", async canonical => {
    mockTransaction(canonical);
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ code: "GITHUB_UNAVAILABLE" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
  it("fails on malformed canonical JSON", async () => {
    fetchMock.mockResolvedValueOnce(response({ object: { sha: head } })).mockResolvedValueOnce(response({ tree: { sha: tree } })).mockResolvedValueOnce(new Response("not json"));
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ code: "GITHUB_UNAVAILABLE" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
  it("reads at captured SHA and atomically preserves untouched questions", async () => {
    mockTransaction();
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ success: true, commitSha: commit, count: 1 });
    expect(fetchMock.mock.calls[2][0]).toContain(`ref=${head}`);
    const write = JSON.parse(fetchMock.mock.calls[3][1].body);
    expect(write.tree).toHaveLength(2);
    expect(write.tree[0].content).toBe(write.tree[1].content);
    expect(JSON.parse(write.tree[0].content)).toEqual([{ ...question, title: "Changed" }, other]);
    expect(JSON.parse(fetchMock.mock.calls[5][1].body)).toEqual({ sha: commit, force: false });
  });
  it("rejects changes since editing started", async () => {
    mockTransaction([{ ...question, title: "Someone else edited" }, other]);
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ code: "CONFLICT", status: 409, conflicts: [{ id: question.id, current: { ...question, title: "Someone else edited" } }] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
  it("deletes only the requested question", async () => {
    mockTransaction();
    expect(await executePublishToGithub({ ...await payload(), modifiedQuestions: [{ ...question, isDeleted: true }] }, env)).toMatchObject({ success: true });
    expect(JSON.parse(JSON.parse(fetchMock.mock.calls[3][1].body).tree[0].content)).toEqual([other]);
  });
  it("checks both canonical copies even when submitted question matches data copy", async () => {
    mockTransaction();
    const data = await payload();
    expect(await executePublishToGithub({ ...data, modifiedQuestions: [question] }, env)).toMatchObject({ success: true, commitSha: commit });
    expect(fetchMock).toHaveBeenCalledTimes(6);
    const written = JSON.parse(fetchMock.mock.calls[3][1].body).tree;
    expect(written.map((entry: {path: string}) => entry.path)).toEqual(["data/interview-questions.json", "web/src/data/interview-questions.json"]);
  });
  it("returns conflict if main advances without retry or force", async () => {
    mockTransaction([question, other], 5, 422);
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ code: "CONFLICT", status: 409 });
    expect(fetchMock).toHaveBeenCalledTimes(6);
  });
  it.each([0, 1, 2, 3, 4])("stops at failed GitHub operation %i", async operation => {
    mockTransaction([question], operation);
    expect(await executePublishToGithub(await payload(), env)).toMatchObject({ code: "GITHUB_UNAVAILABLE" });
    expect(fetchMock).toHaveBeenCalledTimes(operation + 1);
  });
});
