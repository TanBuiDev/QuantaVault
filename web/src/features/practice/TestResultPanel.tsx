"use client";

import React, { useState } from "react";
import type { RunCodeResponse } from "@/app/api/run-code/route";
import type { CasesData } from "@/lib/cases";

interface TestResultPanelProps {
  result: RunCodeResponse | null;
  isRunning: boolean;
  casesData: CasesData | null;
}

export function TestResultPanel({ result, isRunning, casesData }: TestResultPanelProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (isRunning) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 space-y-3">
        <div className="h-7 w-7 animate-spin rounded-full border-3 border-[var(--primary)] border-t-transparent" />
        <div className="text-xs font-semibold text-[var(--muted)]">Đang biên dịch & thực thi mã nguồn trên Sandbox...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs text-[var(--muted)]">
        Nhấn nút <strong className="mx-1 text-[var(--foreground)] font-semibold">Run</strong> hoặc <strong className="mx-1 text-[var(--foreground)] font-semibold">Submit</strong> để xem kết quả kiểm thử.
      </div>
    );
  }

  const { overallStatus, compileError, runtimeError, results, passedCases, totalCases, totalTimeMs } = result;

  // Compile Error display
  if (overallStatus === "COMPILE_ERROR") {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span className="text-base font-bold text-rose-500">Compile Error</span>
        </div>
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-600 dark:text-rose-400 whitespace-pre-wrap">
          {compileError}
        </div>
      </div>
    );
  }

  // System/Runtime Error before test execution
  if (overallStatus === "RUNTIME_ERROR" && results.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span className="text-base font-bold text-rose-500">Runtime Error</span>
        </div>
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-600 dark:text-rose-400 whitespace-pre-wrap">
          {runtimeError}
        </div>
      </div>
    );
  }

  // Timeout Error
  if (overallStatus === "TIMEOUT") {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="text-base font-bold text-amber-500">Time Limit Exceeded</span>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Mã nguồn chạy quá thời gian cho phép (10s). Vui lòng kiểm tra lại vòng lặp hoặc tối ưu độ phức tạp thuật toán.
        </p>
      </div>
    );
  }

  const currentResult = results[selectedCaseIdx] || results[0];
  const originalCase = casesData?.cases?.[selectedCaseIdx];

  const isAccepted = overallStatus === "ACCEPTED";

  return (
    <div className="flex h-full flex-col overflow-hidden text-xs">
      {/* Overall Status Banner */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-2.5 bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-3 w-3 rounded-full ${
                isAccepted ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span
              className={`text-sm font-bold ${
                isAccepted ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isAccepted ? "Accepted" : "Wrong Answer"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 font-semibold">
              {passedCases}/{totalCases} Testcases Passed
            </span>
            {totalTimeMs > 0 && (
              <span className="rounded bg-[var(--surface-hover)] px-2 py-0.5 font-semibold">
                Runtime: {totalTimeMs} ms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Case Tabs Header */}
      {results.length > 0 && (
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[var(--border)] px-4 py-2 bg-[var(--surface-hover)]/30">
          {results.map((r, idx) => {
            const isPass = r.status === "PASS";
            const isSelected = selectedCaseIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCaseIdx(idx)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                  isSelected
                    ? "bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)]/60 hover:text-[var(--foreground)]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isPass ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span>Case {idx + 1}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Case Result Details */}
      {currentResult && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
          {/* Input */}
          {originalCase?.input && (
            <div>
              <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                Input
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-[var(--foreground)]">
                {Object.entries(originalCase.input)
                  .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
                  .join(", ")}
              </div>
            </div>
          )}

          {/* Actual Output */}
          <div>
            <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
              Output
            </div>
            <div
              className={`rounded-lg border p-2.5 text-[13px] font-bold ${
                currentResult.status === "PASS"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {currentResult.actual !== undefined ? currentResult.actual : "null"}
            </div>
          </div>

          {/* Expected Output */}
          <div>
            <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
              Expected
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-emerald-600 dark:text-emerald-400 font-bold">
              {currentResult.expected !== undefined
                ? currentResult.expected
                : JSON.stringify(originalCase?.expected ?? originalCase?.expected_mutation)}
            </div>
          </div>

          {/* Error message if any */}
          {currentResult.error && (
            <div>
              <div className="mb-1 text-[11px] font-semibold text-rose-500 uppercase font-sans">
                Error Details
              </div>
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-[12px] text-rose-600 dark:text-rose-400">
                {currentResult.error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
