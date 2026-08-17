"use client";

import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import type { ProblemContent } from "@/lib/content";
import { useProgress } from "@/lib/progress/provider";

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

function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-none space-y-4 text-sm leading-7 text-slate-700 sm:text-base [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-950 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-950 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-950 [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

function difficultyVariant(difficulty: ProblemContent["difficulty"]) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  return "neutral" as const;
}

export function PracticeView({
  content,
  hints,
  previous,
  next,
  sectionName,
}: PracticeViewProps) {
  const { getProgress, updateProblem } = useProgress();
  const progress = getProgress(content.id);
  const [activeTab, setActiveTab] = useState<PracticeTab>("problem");
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const revealedHints = Math.min(progress?.revealedHints ?? 0, hints.length);
  const hasHints = content.contentStatus.hints !== "none" && hints.length > 0;
  const hasSolution =
    content.contentStatus.solution !== "none" &&
    Boolean(content.solutionMarkdown || content.javaSource);
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
  }

  function revealNextHint() {
    if (revealedHints >= hints.length) return;
    updateProblem(content.id, { revealedHints: revealedHints + 1 });
  }

  function revealSolution() {
    setSolutionRevealed(true);
    updateProblem(content.id, { solutionViewed: true });
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
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(content.difficulty)}>{content.difficulty}</Badge>
          <Badge>{sectionName}</Badge>
          {content.topics.slice(0, 4).map((topic) => (
            <Badge key={topic} variant="neutral">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Problem {content.id}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {content.title}
            </h1>
          </div>
          <a
            href={content.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center self-start rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Open on LeetCode
          </a>
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-950">Learning progress</h2>
              <div className="flex flex-wrap gap-2" aria-label="Learning status">
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
                <Button
                  size="sm"
                  variant={progress?.bookmarked ? "primary" : "secondary"}
                  aria-pressed={Boolean(progress?.bookmarked)}
                  onClick={() =>
                    updateProblem(content.id, { bookmarked: !progress?.bookmarked })
                  }
                >
                  {progress?.bookmarked ? "Remove bookmark" : "Bookmark"}
                </Button>
              </div>
            </div>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Confidence</span>
              <select
                value={progress?.confidence ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  updateProblem(content.id, {
                    confidence: value === "" ? null : (Number(value) as 1 | 2 | 3 | 4 | 5),
                  });
                }}
                className="h-10 min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">Not rated</option>
                <option value="1">1 — Low</option>
                <option value="2">2</option>
                <option value="3">3 — Medium</option>
                <option value="4">4</option>
                <option value="5">5 — High</option>
              </select>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Personal notes</span>
            <textarea
              rows={4}
              value={progress?.notes ?? ""}
              onChange={(event) => updateProblem(content.id, { notes: event.target.value })}
              placeholder="Write your own observations, mistakes, or review notes…"
              className="w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={changeTab}
          ariaLabel="Practice content"
        />

        <Card>
          <CardContent className="p-5 sm:p-7">
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
                  {revealedHints === 0 ? (
                    <p className="text-sm text-slate-600">
                      Hints stay hidden until you request them. Reveal only what you need.
                    </p>
                  ) : null}
                  {hints.slice(0, revealedHints).map((hint, index) => (
                    <section
                      key={`${content.id}-hint-${index + 1}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <MarkdownContent markdown={hint} />
                    </section>
                  ))}
                  {revealedHints < hints.length ? (
                    <Button onClick={revealNextHint}>Reveal next hint</Button>
                  ) : (
                    <p className="text-sm font-medium text-slate-500">All hints revealed.</p>
                  )}
                </div>
              ) : null}

              {activeTab === "solution" ? (
                solutionRevealed ? (
                  <div className="space-y-7">
                    {content.solutionMarkdown ? (
                      <MarkdownContent markdown={content.solutionMarkdown} />
                    ) : null}
                    {content.javaSource ? (
                      <section className="space-y-3" aria-labelledby="java-solution-heading">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h2 id="java-solution-heading" className="text-lg font-semibold text-slate-950">
                            Java reference solution
                          </h2>
                          <Button size="sm" variant="secondary" onClick={copyJavaSource}>
                            {copyState === "copied"
                              ? "Copied"
                              : copyState === "failed"
                                ? "Copy unavailable"
                                : "Copy Java solution"}
                          </Button>
                        </div>
                        <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                          <code>{content.javaSource}</code>
                        </pre>
                      </section>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-950">Solution hidden</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Reveal it only after you have attempted the problem or intentionally want to study the reference approach.
                      </p>
                    </div>
                    <Button onClick={revealSolution}>Reveal solution</Button>
                  </div>
                )
              ) : null}

              {activeTab === "interview" && content.interviewMarkdown ? (
                <MarkdownContent markdown={content.interviewMarkdown} />
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <nav
        aria-label="Problem navigation"
        className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between"
      >
        {previous ? (
          <Link
            href={`/problems/${previous.id}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Previous · {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/problems/${next.id}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-right text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Next · {next.title}
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
