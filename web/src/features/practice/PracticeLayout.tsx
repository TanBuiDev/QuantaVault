"use client";

import { CheckCircle2, Terminal } from "lucide-react";
import Link from "next/link";
import { Group, Panel, Separator } from "react-resizable-panels";

import { Card, CardContent } from "@/components/ui/Card";

import { CodeEditorPanel } from "./CodeEditorPanel";
import { TestcasePanel } from "./TestcasePanel";
import { TestResultPanel } from "./TestResultPanel";

import type { usePracticeWorkspace } from "./usePracticeWorkspace";
export function PracticeLayout(model: ReturnType<typeof usePracticeWorkspace> & { studyContent: React.ReactNode; }) {
  const {
    content,
    previous,
    next,
    layoutMode,
    bottomTab,
    setBottomTab,
    casesData,
    starterCode,
    userCode,
    wordWrap,
    handleCodeChange,
    isRunning,
    runResult,
    handleRunCode,
    handleSubmitCode,
    studyContent
  } = model;
  return (<>
    {/* Main Practice Container */}
    {layoutMode === "split" ? (
      <div className="h-[calc(100vh-130px)] min-h-[750px] lg:min-h-[820px] w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
        <Group orientation="horizontal" className="h-full w-full">
          {/* Left Panel: Study Content */}
          <Panel defaultSize={46} minSize={25} className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
            <div className="h-full overflow-y-auto p-4 sm:p-5">
              {studyContent}
            </div>
          </Panel>

          {/* Vertical Resize Separator */}
          <Separator className="w-1.5 bg-[var(--border)] hover:bg-indigo-500 active:bg-indigo-600 transition-colors cursor-col-resize flex items-center justify-center">
            <div className="h-8 w-0.5 rounded-full bg-[var(--muted)]/40" />
          </Separator>

          {/* Right Panel: Code Editor (Top) & Console (Bottom) */}
          <Panel defaultSize={54} minSize={30} className="flex flex-col h-full overflow-hidden">
            <Group orientation="vertical" className="h-full w-full">
              {/* Top: Monaco Editor (Adjusted ratio) */}
              <Panel defaultSize={67} minSize={30} className="h-full overflow-hidden">
                <CodeEditorPanel
                  problemId={content.id}
                  initialCode={starterCode}
                  code={userCode}
                  onCodeChange={handleCodeChange}
                  onRun={handleRunCode}
                  onSubmit={handleSubmitCode}
                  isRunning={isRunning}
                  wordWrap={wordWrap}
                />
              </Panel>

              {/* Horizontal Resize Separator */}
              <Separator className="h-1.5 bg-[var(--border)] hover:bg-indigo-500 active:bg-indigo-600 transition-colors cursor-row-resize flex items-center justify-center">
                <div className="h-0.5 w-8 rounded-full bg-[var(--muted)]/40" />
              </Separator>

              {/* Bottom: Testcase & Console Tabs */}
              <Panel defaultSize={33} minSize={18} className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
                {/* Console Header Bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-2 bg-[var(--surface)] text-xs">
                  {/* Console Tabs */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setBottomTab("testcase")}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${bottomTab === "testcase"
                        ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      <span>Testcase</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBottomTab("result")}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${bottomTab === "result"
                        ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Test Result</span>
                      {runResult && (
                        <span
                          className={`h-2 w-2 rounded-full ${runResult.overallStatus === "ACCEPTED" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Console Body */}
                <div className="flex-1 overflow-hidden">
                  {bottomTab === "testcase" ? (
                    <TestcasePanel casesData={casesData} />
                  ) : (
                    <TestResultPanel result={runResult} isRunning={isRunning} casesData={casesData} />
                  )}
                </div>
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    ) : (
      /* Classic View (Original 2-column layout) */
      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] xl:items-start">
        <section aria-label="Study content" className="min-w-0 space-y-4">
          {studyContent}
        </section>

        {/* Sidebar */}
        <aside aria-label="Problem information" className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-bold text-[var(--foreground)]">Study Details</h2>
              <div className="mt-3 space-y-2 text-xs text-[var(--muted)]">
                <div className="flex justify-between border-b border-[var(--border)] py-1.5">
                  <span>Patterns</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {content.patterns.join(", ") || "None"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Topics</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {content.topics.join(", ") || "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav aria-label="Problem navigation" className="grid gap-2.5">
            {previous ? (
              <Link
                href={`/problems/${previous.id}`}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
              >
                <span className="truncate">← #{previous.id} {previous.title}</span>
                <span className="text-xs font-mono text-[var(--muted)]">Alt + ←</span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/problems/${next.id}`}
                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
              >
                <span className="truncate">#{next.id} {next.title} →</span>
                <span className="text-xs font-mono text-[var(--muted)]">Alt + →</span>
              </Link>
            ) : null}
          </nav>
        </aside>
      </div>
    )}


  </>);
}
