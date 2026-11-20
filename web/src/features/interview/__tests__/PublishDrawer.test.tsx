import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { PublishDrawer } from "../PublishDrawer";
import type { InterviewQuestion } from "@/lib/interview/types";
import { questionVersion } from "@/lib/interview/questionVersion";
import { getDrafts, saveDraft } from "@/lib/interview/draftStore";

const original: InterviewQuestion = { id: "q-test", title: "Original", category: "java-core", difficulty: "junior", tags: [], summary: "Summary", answerMarkdown: "Answer" };
const draft = { ...original, title: "Edited", baseVersion: questionVersion(original) };

function mockRequests(publish: { status: number; json: Record<string, unknown> }, stepUpOk = true) {
  const fetch = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "/api/admin/status") return Response.json({ ok: true, elevated: false });
    if (url === "/api/admin/step-up") return Response.json(stepUpOk ? { ok: true, expiresAt: 12345 } : { ok: false, code: "INVALID_CREDENTIALS" }, { status: stepUpOk ? 200 : 401 });
    if (url === "/api/publish") return Response.json(publish.json, { status: publish.status });
    throw new Error("Unexpected request " + url + " " + init?.method);
  });
  vi.stubGlobal("fetch", fetch);
  return fetch;
}
function mount(onSuccess = vi.fn()) {
  render(<ConfirmProvider><PublishDrawer drafts={{ [draft.id]: draft }} canonicalQuestions={[original]} onClearAll={vi.fn()} onPublishSuccess={onSuccess} /></ConfirmProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Xuất bản (1)" }));
  return onSuccess;
}
async function enterPasswordAndPublish() {
  fireEvent.change(screen.getByLabelText("Mật khẩu quản trị QuantaVault"), { target: { value: "test-pin" } });
  fireEvent.click(screen.getByRole("button", { name: "Xác nhận & Xuất bản" }));
}

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });
describe("admin session-backed publishing and draft snapshots", () => {
  it("requires admin password once and sends only the canonical version data to publishing", async () => {
    const fetch = mockRequests({ status: 200, json: { success: true, commitSha: "a".repeat(40) } });
    const onSuccess = mount();
    fireEvent.click(screen.getByRole("button", { name: "Xác nhận & Xuất bản" }));
    expect(fetch.mock.calls.some(c => c[0] === "/api/publish")).toBe(false);
    await enterPasswordAndPublish();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ [draft.id]: draft }));
    const auth = fetch.mock.calls.find(c => c[0] === "/api/admin/step-up");
    expect(JSON.parse(auth![1]!.body as string)).toEqual({ password: "test-pin" });
    const write = fetch.mock.calls.find(c => c[0] === "/api/publish");
    expect(write).toBeDefined();
    const data = JSON.parse(write![1]!.body as string);
    expect(data).toMatchObject({ pin: "", otp: "", baseVersions: { [draft.id]: questionVersion(original) } });
    expect(data.modifiedQuestions[0]).not.toHaveProperty("baseVersion");
    expect(screen.queryByLabelText("Mã Google Authenticator")).toBeNull();
  });

  it("refuses publishing when password step-up is rejected, preserving drafts", async () => {
    const fetch = mockRequests({ status: 200, json: { success: true } }, false);
    const onSuccess = mount();
    await enterPasswordAndPublish();
    await screen.findByText(/Mật khẩu quản trị không đúng/);
    expect(fetch.mock.calls.some(c => c[0] === "/api/publish")).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("keeps local edits on GitHub conflict", async () => {
    const fetch = mockRequests({ status: 409, json: { success: false, code: "CONFLICT", error: "Có xung đột" } });
    const onSuccess = mount();
    await enterPasswordAndPublish();
    await screen.findByText("Có xung đột");
    expect(fetch.mock.calls.some(c => c[0] === "/api/publish")).toBe(true);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("reports successful GitHub write separately if browser persistence fails", async () => {
    const fetch = mockRequests({ status: 200, json: { success: true, commitSha: "a".repeat(40) } });
    const onSuccess = vi.fn(() => { throw new Error("quota"); });
    mount(onSuccess);
    await enterPasswordAndPublish();
    await screen.findByText(/GitHub đã ghi thành công nhưng không thể cập nhật bộ nhớ/);
    expect(screen.queryByRole("button", { name: "Xác nhận & Xuất bản" })).toBeNull();
    expect(fetch.mock.calls.filter(c => c[0] === "/api/publish")).toHaveLength(1);
  });

  it("allows explicit rebase after a conflict, never replacing edited content", async () => {
    const remote = { ...original, title: "Updated remotely", answerMarkdown: "Remote answer" };
    const fetch = mockRequests({ status: 409, json: { success: false, code: "CONFLICT", error: "Có xung đột", conflicts: [{ id: original.id, current: remote }] } });
    saveDraft(draft, original);
    mount();
    await enterPasswordAndPublish();
    await screen.findByText("Remote answer");
    expect(getDrafts()[draft.id].baseVersion).toBe(questionVersion(original));
    fireEvent.click(screen.getByRole("button", { name: "Đã đối chiếu, dùng nền mới" }));
    await screen.findByRole("button", { name: "Dùng phiên bản mới làm nền" });
    expect(getDrafts()[draft.id].baseVersion).toBe(questionVersion(original));
    fireEvent.click(screen.getByRole("button", { name: "Dùng phiên bản mới làm nền" }));
    await waitFor(() => expect(getDrafts()[draft.id].baseVersion).toBe(questionVersion(remote)));
    expect(getDrafts()[draft.id].title).toBe(draft.title);
    expect(fetch.mock.calls.filter(c => c[0] === "/api/publish")).toHaveLength(1);
  });
});
