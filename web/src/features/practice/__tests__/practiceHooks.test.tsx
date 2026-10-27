import { act, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import type { ProblemContent } from "@/lib/content";
import { usePracticeExecution } from "../usePracticeExecution";
import { usePracticeDraft } from "../usePracticeDraft";
import { usePracticeVersions } from "../usePracticeVersions";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
const accepted = { overallStatus: "ACCEPTED", results: [], passedCases: 1, totalCases: 1 };
function wrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider><ConfirmProvider>{children}</ConfirmProvider></ToastProvider>;
}
beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("practice execution lifecycle", () => {
  it("marks only successful Submit solved", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => accepted }));
    const update = vi.fn();
    const { result } = renderHook(() => usePracticeExecution(121, "class Solution {}", update), { wrapper });
    await act(() => result.current.execute("run"));
    expect(update).not.toHaveBeenCalled();
    await act(() => result.current.execute("submit"));
    expect(update).toHaveBeenCalledExactlyOnceWith(121, { status: "solved" });
  });
  it("rejects HTTP infrastructure failure even with an Accepted body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ...accepted, error: "Docker unavailable" }) }));
    const update = vi.fn();
    const { result } = renderHook(() => usePracticeExecution(121, "code", update), { wrapper });
    await act(() => result.current.execute("submit"));
    expect(update).not.toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
    expect(result.current.runResult).toBeNull();
  });
  it("aborts and ignores a stale response after switching problem", async () => {
    let finish!: (value: unknown) => void;
    const fetchMock = vi.fn().mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    vi.stubGlobal("fetch", fetchMock);
    const update = vi.fn();
    const { result, rerender } = renderHook(({ id }) => usePracticeExecution(id, "code", update), { wrapper, initialProps: { id: 121 } });
    let execution!: Promise<void>;
    act(() => { execution = result.current.execute("submit"); });
    const signal = fetchMock.mock.calls[0][1].signal;
    rerender({ id: 122 });
    expect(signal.aborted).toBe(true);
    await act(async () => { finish({ ok: true, json: async () => accepted }); await execution; });
    expect(update).not.toHaveBeenCalled();
    expect(result.current.runResult).toBeNull();
    expect(result.current.isRunning).toBe(false);
  });
  it("handles network errors and prevents duplicate runs", async () => {
    let reject!: (error: Error) => void;
    const fetchMock = vi.fn().mockImplementation(() => new Promise((_, fail) => { reject = fail; }));
    vi.stubGlobal("fetch", fetchMock);
    const update = vi.fn();
    const { result } = renderHook(() => usePracticeExecution(121, "code", update), { wrapper });
    let execution!: Promise<void>;
    act(() => { execution = result.current.execute("submit"); });
    await act(() => result.current.execute("run"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => { reject(new Error("Network offline")); await execution; });
    expect(update).not.toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });
});

describe("draft compatibility", () => {
  it("restores an intentionally empty saved draft and existing preferences", async () => {
    localStorage.setItem("user_code_121", "");
    localStorage.setItem("preferred_word_wrap", "false");
    localStorage.setItem("preferred_lang_mode", "vi");
    localStorage.setItem("preferred_layout_mode", "classic");
    const { result, unmount } = renderHook(() => usePracticeDraft(121, "starter"));
    await waitFor(() => expect(result.current.userCode).toBe(""));
    expect(result.current.wordWrap).toBe(false);
    expect(result.current.langMode).toBe("vi");
    expect(result.current.layoutMode).toBe("classic");
    act(() => result.current.handleCodeChange("my draft"));
    unmount();
    const remounted = renderHook(() => usePracticeDraft(121, "starter"));
    await waitFor(() => expect(remounted.result.current.userCode).toBe("my draft"));
  });
});

describe("reference version selection", () => {
  it("keeps the selected ID across reordering and falls back after deletion", () => {
    const canonical = { id: "canonical", source: "original", name: "Original", isDefault: true, isCanonical: true };
    const extra = { id: "extra", source: "custom", name: "Custom", isDefault: false, isCanonical: false };
    const initial = { id: 121, javaSource: canonical.source, codeVersions: [canonical, extra] } as ProblemContent;
    const { result, rerender } = renderHook(({ content }) => usePracticeVersions(content, vi.fn()), { wrapper, initialProps: { content: initial } });
    act(() => result.current.setSelectedVersionIdx(1));
    rerender({ content: { ...initial, codeVersions: [{ ...extra, source: "updated" }, canonical] } });
    expect(result.current.currentJavaSource).toBe("updated");
    expect(result.current.selectedVersionIdx).toBe(0);
    rerender({ content: { ...initial, codeVersions: [canonical] } });
    expect(result.current.currentCodeItem.id).toBe("canonical");
  });
});

it("preserves structured Docker guidance in the result console for HTTP 503", async () => {
  const failure = { ...accepted, overallStatus: "SERVER_ERROR", runtimeError: "Hãy khởi động Docker Desktop rồi thử lại.", errorCode: "DOCKER_UNAVAILABLE", results: [] };
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => failure }));
  const update = vi.fn();
  const { result } = renderHook(() => usePracticeExecution(121, "code", update), { wrapper });
  await act(() => result.current.execute("submit"));
  expect(result.current.runResult).toEqual(failure);
  expect(screen.getByText(failure.runtimeError)).toBeInTheDocument();
  expect(update).not.toHaveBeenCalled();
});
