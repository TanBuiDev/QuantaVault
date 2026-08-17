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
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Canonical study plan
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Problems
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Search and filter the Top Interview 150 without duplicating its canonical ordering or content.
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-sm font-medium text-slate-700">Search problems</span>
              <input
                type="search"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="ID or title"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Difficulty</span>
              <select
                value={filters.difficulty}
                onChange={(event) =>
                  updateFilter("difficulty", event.target.value as ProblemFilters["difficulty"])
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All difficulties" : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Section</span>
              <select
                value={filters.section}
                onChange={(event) => updateFilter("section", event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="all">All sections</option>
                {sections.map((section) => (
                  <option key={section.slug} value={section.slug}>
                    {section.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Topic</span>
              <select
                value={filters.topic}
                onChange={(event) => updateFilter("topic", event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="all">All topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="min-w-48 space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Learning status</span>
              <select
                value={filters.status}
                onChange={(event) =>
                  updateFilter("status", event.target.value as ProblemStatusFilter)
                }
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {hasActiveFilters ? (
              <Button variant="secondary" onClick={() => setFilters(INITIAL_FILTERS)}>
                Clear all filters
              </Button>
            ) : null}

            <p className="ml-auto text-sm text-slate-500" aria-live="polite">
              {filteredProblems.length} of {summaries.length} problems
              {!hydrated ? " · loading saved progress" : ""}
            </p>
          </div>

          {hasActiveFilters ? (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
              {filters.query.trim() ? <Badge>Search: {filters.query.trim()}</Badge> : null}
              {filters.difficulty !== "all" ? <Badge>{filters.difficulty}</Badge> : null}
              {filters.section !== "all" ? (
                <Badge>{sectionNames.get(filters.section) ?? filters.section}</Badge>
              ) : null}
              {filters.topic !== "all" ? <Badge>{filters.topic}</Badge> : null}
              {filters.status !== "all" ? <Badge>{statusLabel(filters.status)}</Badge> : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {filteredProblems.length === 0 ? (
        <EmptyState
          title="No problems match these filters"
          description="Change the search or filter combination, then use the clear filters control above to restore the canonical list."
        />
      ) : (
        <ul className="grid gap-3" aria-label="Top Interview 150 problems">
          {filteredProblems.map((problem) => {
            const record = getProblemProgress(state, problem.id);
            const learnerStatus = record?.status ?? "not-started";
            const hasFullProblem = problem.contentStatus.source === "full-source";

            return (
              <li key={problem.id}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <Link
                        href={`/problems/${problem.id}`}
                        className="inline-flex text-base font-semibold text-slate-950 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500"
                      >
                        {problem.id}. {problem.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{sectionNames.get(problem.primarySection) ?? problem.primarySection}</span>
                        <span aria-hidden="true">•</span>
                        <span>{problem.topics.slice(0, 3).join(" · ") || "No topics"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Badge variant={difficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                      <Badge variant={statusVariant(learnerStatus)}>{statusLabel(learnerStatus)}</Badge>
                      <Badge variant={hasFullProblem ? "info" : "neutral"}>
                        {hasFullProblem ? "Problem ready" : "Source limited"}
                      </Badge>
                      {problem.contentStatus.solution === "complete" ? (
                        <Badge variant="neutral">Solution</Badge>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
