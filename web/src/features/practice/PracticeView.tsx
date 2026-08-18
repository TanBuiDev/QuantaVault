"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import type { ProblemContent } from "@/lib/content";
import { useProgress } from "@/lib/progress/provider";

import { MarkdownContent } from "./MarkdownContent";

export interface AdjacentProblemLink {
  id: number;
  title: string;
}

export interface PracticeViewProps {
  content: ProblemContent;
  hints: string[];
  previous: AdjacentProblemLink | null;
  next: AdjacentProblemLink | null;
  sectionName: string;
}

type PracticeTab = "problem" | "hints" | "solution" | "interview";

function difficultyVariant(difficulty: ProblemContent["difficulty"]) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  return "neutral" as const;
}

export function PracticeView({ content, hints, previous, next, sectionName }: PracticeViewProps) {
  const { getProgress, updateProblem } = useProgress();
  const progress = getProgress(content.id);
  const [activeTab, setActiveTab] = useState<PracticeTab>("problem");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const hasHints = content.contentStatus.hints !== "none" && hints.length > 0;
  const hasSolution =
    content.contentStatus.solution !== "none" && Boolean(content.solutionMarkdown || content.javaSource);
  const hasInterview =
    content.contentStatus.interview !== "none" && Boolean(content.interviewMarkdown);

  const tabs = [
    { id: "problem", label: "Problem" },
    { id: "hints", label: "Hints", disabled: !hasHints },
    { id: "solution", label: "Solution", disabled: !hasSolution },
    { id: "interview", label: "Interview", disabled: !hasInterview },
  ] as const;

  function changeTab(value: string) {
    const tab = value as PracticeTab;
    setActiveTab(tab);
    if (tab === "interview" && hasInterview) {
      updateProblem(content.id, { interviewViewed: true });
    }
    if (tab === "solution" && hasSolution) {
      updateProblem(content.id, { solutionViewed: true });
    }
  }

  async function copyJavaSource() {
    if (!content.javaSource) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(content.javaSource);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(content.difficulty)}>{content.difficulty}</Badge>
          <Badge variant="info">{sectionName}</Badge>
          {content.topics.slice(0, 4).map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Problem {content.id}</p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Study the problem here, then write and submit your Java solution on LeetCode.
            </p>
          </div>
          <a
            href={content.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            Open on LeetCode <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4" aria-label="Learning status">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Quick status</span>
          {([
            ["in-progress", "In progress"],
            ["solved", "Solved"],
            ["review", "Review"],
          ] as const).map(([status, label]) => (
            <Button
              key={status}
              size="sm"
              variant={progress?.status === status ? "primary" : "secondary"}
              aria-pressed={progress?.status === status}
              onClick={() => updateProblem(content.id, { status })}
            >
              {label}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] xl:items-start">
        <section aria-label="Study content" className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Tabs
              items={tabs}
              value={activeTab}
              onValueChange={changeTab}
              ariaLabel="Practice content"
            />
            <span className="hidden text-xs text-[var(--muted)] sm:inline">Use ← → to switch tabs</span>
          </div>

          <Card>
            <CardContent className="p-5 sm:p-7 lg:p-8">
              <div role="tabpanel" aria-label={`${activeTab} content`}>
                {activeTab === "problem" ? (
                  content.problemMarkdown ? (
                    <MarkdownContent markdown={content.problemMarkdown} />
                  ) : (
                    <EmptyState
                      title="Full problem source is not available yet"
                      description="This canonical package currently has only limited source metadata. The web app will not fabricate a problem statement."
                    />
                  )
                ) : null}

                {activeTab === "hints" ? (
                  <div className="space-y-5">
                    {hints.map((hint, index) => (
                      <section
                        key={`${content.id}-hint-${index + 1}`}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-4 sm:p-5"
                      >
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                          Hint {index + 1}
                        </div>
                        <MarkdownContent markdown={hint} />
                      </section>
                    ))}
                  </div>
                ) : null}

                {activeTab === "solution" ? (
                  <div className="space-y-8">
                    {content.solutionMarkdown ? <MarkdownContent markdown={content.solutionMarkdown} /> : null}
                    {content.javaSource ? (
                      <section className="space-y-3" aria-labelledby="java-solution-heading">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Reference code</p>
                            <h2 id="java-solution-heading" className="mt-1 text-lg font-bold text-[var(--foreground)]">
                              Java solution
                            </h2>
                          </div>
                          <Button size="sm" variant="secondary" onClick={copyJavaSource}>
                            {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy Java solution"}
                          </Button>
                        </div>
                        <pre className="max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-sm leading-6 text-[var(--code-foreground)]">
                          <code>{content.javaSource}</code>
                        </pre>
                      </section>
                    ) : null}
                  </div>
                ) : null}

                {activeTab === "interview" && content.interviewMarkdown ? (
                  <MarkdownContent markdown={content.interviewMarkdown} />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside aria-label="Study progress" className="space-y-4 xl:sticky xl:top-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Your study data</p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--foreground)]">Progress & notes</h2>
                </div>
                <Button
                  size="sm"
                  variant={progress?.bookmarked ? "primary" : "secondary"}
                  aria-pressed={Boolean(progress?.bookmarked)}
                  onClick={() => updateProblem(content.id, { bookmarked: !progress?.bookmarked })}
                >
                  {progress?.bookmarked ? "★ Saved" : "Bookmark"}
                </Button>
              </div>

              <label className="mt-5 block space-y-1.5">
                <span className="text-sm font-semibold text-[var(--foreground)]">Confidence</span>
                <select
                  value={progress?.confidence ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateProblem(content.id, {
                      confidence: value === "" ? null : (Number(value) as 1 | 2 | 3 | 4 | 5),
                    });
                  }}
                  className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15"
                >
                  <option value="">Not rated</option>
                  <option value="1">1 — Low</option>
                  <option value="2">2</option>
                  <option value="3">3 — Medium</option>
                  <option value="4">4</option>
                  <option value="5">5 — High</option>
                </select>
              </label>

              <label className="mt-5 block space-y-1.5">
                <span className="text-sm font-semibold text-[var(--foreground)]">Personal notes</span>
                <textarea
                  rows={8}
                  value={progress?.notes ?? ""}
                  onChange={(event) => updateProblem(content.id, { notes: event.target.value })}
                  placeholder="Mistakes, invariants, interview wording, or what to review next…"
                  className="w-full resize-y rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15"
                />
              </label>
            </CardContent>
          </Card>

          <nav aria-label="Problem navigation" className="grid gap-2">
            {previous ? (
              <Link
                href={`/problems/${previous.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm transition hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                <span className="block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Previous</span>
                <span className="mt-1 block font-semibold text-[var(--foreground)]">Previous · {previous.title}</span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/problems/${next.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm transition hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                <span className="block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Next</span>
                <span className="mt-1 block font-semibold text-[var(--foreground)]">Next · {next.title}</span>
              </Link>
            ) : null}
          </nav>
        </aside>
      </div>
    </div>
  );
}
