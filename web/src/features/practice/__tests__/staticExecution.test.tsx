import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePracticeExecution } from "../usePracticeExecution";

vi.mock("@/components/ui/Toast", () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }) }));

describe("static study execution", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
  it("never requests a cloud judge when run or submit is invoked", async () => {
    vi.stubEnv("NEXT_PUBLIC_STUDY_MODE", "static");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { result } = renderHook(() => usePracticeExecution(1, "class Solution {}", vi.fn()));
    await act(async () => { await result.current.execute("run"); await result.current.execute("submit"); });
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });
});
