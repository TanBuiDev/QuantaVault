"use client";

import { useToast } from "@/components/ui/Toast";
import type { RunCodeResponse } from "@/lib/judge/types";
import { useEffect, useRef, useState } from "react";

export function usePracticeExecution(problemId: number, sourceCode: string, updateProblem: (id: number, patch: { status: "solved"; }) => void) {
  const [state, setState] = useState<{ problemId: number; running: boolean; result: RunCodeResponse | null; }>({ problemId, running: false, result: null });
  const pending = useRef<AbortController | null>(null);
  const { success, error, info } = useToast();
  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, [problemId]);

  async function execute(mode: "run" | "submit") {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setState({ problemId, running: true, result: null });
    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-workspace-request": "1" },
        body: JSON.stringify({ problemId, sourceCode, mode }),
        signal: controller.signal,
      });
      const result: RunCodeResponse & { error?: string; } = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok) {
        if (result.overallStatus && result.overallStatus !== "ACCEPTED" && Array.isArray(result.results)) {
          setState({ problemId, running: false, result });
        }
        throw new Error(result.runtimeError || result.error || "Không thể chạy Java. Kiểm tra Docker rồi thử lại.");
      }
      setState({ problemId, running: false, result });
      if (result.overallStatus === "ACCEPTED") {
        if (mode === "submit") updateProblem(problemId, { status: "solved" });
        success(mode === "submit" ? `Đã vượt qua ${result.passedCases}/${result.totalCases} testcase!` : "Tất cả testcase mẫu đều chính xác!", mode === "submit" ? "Accepted" : "Sample Passed");
      } else if (result.overallStatus === "WRONG_ANSWER") {
        info("Một số testcase chưa chính xác", "Wrong Answer");
      } else {
        error(result.runtimeError || result.compileError || (result.overallStatus === "COMPILE_ERROR" ? "Lỗi biên dịch mã nguồn Java" : "Kiểm thử chưa hoàn tất"), "Lỗi thực thi");
      }
    } catch (cause) {
      if (!controller.signal.aborted) error(cause instanceof Error ? cause.message : "Lỗi kết nối khi chạy mã nguồn", "Lỗi");
    } finally {
      if (!controller.signal.aborted) setState(current => ({ ...current, running: false }));
      if (pending.current === controller) pending.current = null;
    }
  }
  return { execute, isRunning: state.problemId === problemId && state.running, runResult: state.problemId === problemId ? state.result : null };
}
