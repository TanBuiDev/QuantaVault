"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Difficulty, ProblemSummary, StudyPlanSection } from "@/lib/content";
import { getProblemProgress } from "@/lib/progress";
import { useProgress } from "@/lib/progress/provider";

import { filterProblems, type ProblemFilters, type ProblemStatusFilter } from "./filterProblems";

const INITIAL_FILTERS: ProblemFilters = {
  query: "",
  difficulty: "all",
  section: "all",
  topic: "all",
  status: "all",
};

const difficultyOptions: Array<"all" | Difficulty> = ["all", "Easy", "Medium", "Hard"];
const statusOptions: Array<{ value: ProblemStatusFilter; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "not-started", label: "Not started" },
  { value: "in-progress", label: "In progress" },
  { value: "solved", label: "Solved" },
  { value: "review", label: "Review" },
];

function statusLabel(status: Exclude<ProblemStatusFilter, "all">): string {
  if (status === "not-started") return "Not started";
  if (status === "in-progress") return "In progress";
  if (status === "review") return "Review";
  return "Solved";
}

function statusVariant(status: Exclude<ProblemStatusFilter, "all">) {
  if (status === "solved") return "success" as const;
  if (status === "review") return "warning" as const;
  if (status === "in-progress") return "info" as const;
  return "neutral" as const;
}

function difficultyVariant(difficulty: Difficulty) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  return "neutral" as const;
}

const controlClass =
  "h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15";

export interface ProblemExplorerProps {
  summaries: ProblemSummary[];
  sections: StudyPlanSection[];
}

export function ProblemExplorer({ summaries, sections }: ProblemExplorerProps) {
  const { state, hydrated } = useProgress();
  const [filters, setFilters] = useState<ProblemFilters>(INITIAL_FILTERS);

  const topics = useMemo(
    () => Array.from(new Set(summaries.flatMap((problem) => problem.topics))).sort(),
    [summaries],
  );
  const sectionNames = useMemo(
    () => new Map(sections.map((section) => [section.slug, section.name])),
    [sections],
  );
  const filteredProblems = useMemo(
    () => filterProblems(summaries, state, filters),
    [summaries, state, filters],
  );
  const visibleSections = useMemo(
    () => sections
      .map((section) => ({
        ...section,
        problems: filteredProblems.filter((problem) => problem.primarySection === section.slug),
      }))
      .filter((section) => section.problems.length > 0),
    [sections, filteredProblems],
  );

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.difficulty !== "all" ||
    filters.section !== "all" ||
    filters.topic !== "all" ||
    filters.status !== "all";

  const updateFilter = <K extends keyof ProblemFilters>(key: K, value: ProblemFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <Badge variant="info">Canonical study plan</Badge>
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl">Problems</h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Find the next problem quickly. Filter the canonical Top Interview 150 without changing its source order.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
          <span className="font-bold text-[var(--foreground)]">{filteredProblems.length}</span>
          <span className="text-[var(--muted)]"> / {summaries.length} shown{!hydrated ? " · loading progress" : ""}</span>
        </div>
      </header>

      <Card className="sticky top-20 z-20 shadow-sm lg:top-4">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
            <label className="space-y-1.5 xl:col-span-4">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Search problems</span>
              <input
                type="search"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="ID or title"
                className={controlClass}
              />
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Difficulty</span>
              <select
                value={filters.difficulty}
                onChange={(event) => updateFilter("difficulty", event.target.value as ProblemFilters["difficulty"])}
                className={controlClass}
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>{option === "all" ? "All difficulties" : option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Section</span>
              <select
                value={filters.section}
                onChange={(event) => updateFilter("section", event.target.value)}
                className={controlClass}
              >
                <option value="all">All sections</option>
                {sections.map((section) => (
                  <option key={section.slug} value={section.slug}>{section.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Topic</span>
              <select value={filters.topic} onChange={(event) => updateFilter("topic", event.target.value)} className={controlClass}>
                <option value="all">All topics</option>
                {topics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Learning status</span>
              <select
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value as ProblemStatusFilter)}
                className={controlClass}
              >
                {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={() => setFilters(INITIAL_FILTERS)}>Clear all filters</Button>
            ) : (
              <span className="text-xs text-[var(--muted)]">Use filters to narrow the 150-problem study plan.</span>
            )}
            {filters.query.trim() ? <Badge>Search: {filters.query.trim()}</Badge> : null}
            {filters.difficulty !== "all" ? <Badge>{filters.difficulty}</Badge> : null}
            {filters.section !== "all" ? <Badge>{sectionNames.get(filters.section) ?? filters.section}</Badge> : null}
            {filters.topic !== "all" ? <Badge>{filters.topic}</Badge> : null}
            {filters.status !== "all" ? <Badge>{statusLabel(filters.status)}</Badge> : null}
          </div>
        </CardContent>
      </Card>

      {filteredProblems.length === 0 ? (
        <EmptyState
          title="No problems match these filters"
          description="Change the search or filter combination, then use the clear filters control above to restore the canonical list."
        />
      ) : (
        <div className="space-y-5">
          {visibleSections.map((section) => (
            <section key={section.slug} aria-labelledby={`section-${section.slug}`} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <h2 id={`section-${section.slug}`} className="border-b border-[var(--border)] bg-[var(--surface-hover)] px-5 py-3 text-sm font-bold tracking-tight text-[var(--foreground)]">
                {section.name}
              </h2>
              <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[var(--border)] bg-[var(--surface-hover)] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
                <span>Problem</span>
                <span>Status</span>
              </div>
              <ul aria-label={`Problems in ${section.name}`} className="divide-y divide-[var(--border)]">
                {section.problems.map((problem) => {
              const record = getProblemProgress(state, problem.id);
              const learnerStatus = record?.status ?? "not-started";
              const hasFullProblem = problem.contentStatus.source === "full-source";

              return (
                <li key={problem.id} className="group transition-colors hover:bg-[var(--surface-hover)]">
                  <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 min-w-12 text-sm font-black tabular-nums text-[var(--muted)]">#{problem.id}</span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/problems/${problem.id}`}
                              className="font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary-strong)] hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]"
                            >
                              {problem.title}
                            </Link>
                            {record?.bookmarked ? (
                              <span aria-label={`Bookmarked problem ${problem.id}`} title="Bookmarked" className="text-amber-500">★</span>
                            ) : null}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
                            <span>{sectionNames.get(problem.primarySection) ?? problem.primarySection}</span>
                            <span aria-hidden="true">•</span>
                            <span>{problem.topics.slice(0, 3).join(" · ") || "No topics"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pl-0 md:max-w-[42%] md:justify-end md:pl-4">
                      <Badge variant={difficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                      <Badge variant={statusVariant(learnerStatus)}>{statusLabel(learnerStatus)}</Badge>
                      <span className="text-xs font-medium text-[var(--muted)]">{hasFullProblem ? "Problem ready" : "Source limited"}</span>
                      {problem.contentStatus.solution === "complete" ? <span className="text-xs font-medium text-[var(--muted)]">• Solution</span> : null}
                      <Link
                        href={`/problems/${problem.id}`}
                        aria-label={`Study ${problem.title}`}
                        className="grid size-9 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                      >
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </li>
              );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
