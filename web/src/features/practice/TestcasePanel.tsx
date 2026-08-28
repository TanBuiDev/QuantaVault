"use client";

import React, { useState } from "react";
import type { CasesData } from "@/lib/cases";

interface TestcasePanelProps {
  casesData: CasesData | null;
}

export function TestcasePanel({ casesData }: TestcasePanelProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (!casesData || !casesData.cases || casesData.cases.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--muted)]">
        Chưa có testcase mẫu cho bài tập này.
      </div>
    );
  }

  const cases = casesData.cases;
  const currentCase = cases[selectedCaseIdx] || cases[0];
  const isOperationSeq = casesData.contract_type === "operation-sequence";

  return (
    <div className="flex h-full flex-col overflow-hidden text-xs">
      {/* Testcase Tabs Header */}
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-[var(--border)] px-4 py-2">
        {cases.map((tc, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedCaseIdx(idx)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              selectedCaseIdx === idx
                ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                : "text-[var(--muted)] hover:bg-[var(--surface-hover)]/50 hover:text-[var(--foreground)]"
            }`}
          >
            Case {idx + 1}
          </button>
        ))}
      </div>

      {/* Testcase Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {isOperationSeq ? (
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                Operations
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-[var(--foreground)]">
                {JSON.stringify(currentCase.operations)}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                Arguments
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-[var(--foreground)]">
                {JSON.stringify(currentCase.arguments)}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                Expected Output
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-emerald-600 dark:text-emerald-400 font-bold">
                {JSON.stringify(currentCase.expected)}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {currentCase.input &&
              Object.entries(currentCase.input).map(([paramName, val]) => (
                <div key={paramName}>
                  <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                    {paramName} =
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-[var(--foreground)] whitespace-pre-wrap">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </div>
                </div>
              ))}

            {currentCase.expected !== undefined && (
              <div>
                <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                  Expected Output
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                  {typeof currentCase.expected === "object"
                    ? JSON.stringify(currentCase.expected)
                    : String(currentCase.expected)}
                </div>
              </div>
            )}

            {currentCase.expected_mutation && (
              <div>
                <div className="mb-1 text-[11px] font-semibold text-[var(--muted)] uppercase font-sans">
                  Expected Mutation
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2.5 text-[13px] text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                  {JSON.stringify(currentCase.expected_mutation)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
