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
  { value: "all", label: "Tất cả trạng thái" },
  { value: "not-started", label: "Chưa bắt đầu" },
  { value: "in-progress", label: "Đang luyện tập" },
  { value: "solved", label: "Đã giải quyết" },
  { value: "review", label: "Cần ôn tập" },
];

function statusLabel(status: Exclude<ProblemStatusFilter, "all">): string {
  if (status === "not-started") return "Chưa bắt đầu";
  if (status === "in-progress") return "Đang làm";
  if (status === "review") return "Cần ôn";
  return "Đã giải";
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
  if (difficulty === "Hard") return "danger" as const;
  return "neutral" as const;
}

const controlClass =
  "h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15";

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
    () =>
      sections
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
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <Badge variant="primary" dot>Danh sách bài tập</Badge>
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl">
            Problems Explorer
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Tìm kiếm và lọc 150 câu hỏi LeetCode kinh điển theo độ khó, chuyên đề và trạng thái học tập.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm shadow-2xs">
          <span className="font-bold text-[var(--foreground)]">{filteredProblems.length}</span>
          <span className="text-[var(--muted)]"> / {summaries.length} bài{!hydrated ? " · Đang nạp..." : ""}</span>
        </div>
      </header>

      <Card className="sticky top-20 z-20 shadow-md backdrop-blur-md bg-[var(--surface)]/95 lg:top-4 border-[var(--border-strong)]">
        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
            <label className="space-y-1.5 xl:col-span-4">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Search problems</span>
              <div className="relative">
                <input
                  type="search"
                  aria-label="Search problems"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="ID or title (#88, 380)..."
                  className={controlClass}
                />
              </div>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Difficulty</span>
              <select
                aria-label="Difficulty"
                value={filters.difficulty}
                onChange={(event) => updateFilter("difficulty", event.target.value as ProblemFilters["difficulty"])}
                className={controlClass}
              >
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All difficulties" : option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Section</span>
              <select
                aria-label="Section"
                value={filters.section}
                onChange={(event) => updateFilter("section", event.target.value)}
                className={controlClass}
              >
                <option value="all">All sections</option>
                {sections.map((section) => (
                  <option key={section.slug} value={section.slug}>
                    {section.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Topic</span>
              <select
                aria-label="Topic"
                value={filters.topic}
                onChange={(event) => updateFilter("topic", event.target.value)}
                className={controlClass}
              >
                <option value="all">All topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 xl:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Learning status</span>
              <select
                aria-label="Learning status"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value as ProblemStatusFilter)}
                className={controlClass}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
            {hasActiveFilters ? (
              <Button variant="secondary" size="xs" onClick={() => setFilters(INITIAL_FILTERS)}>
                Clear all filters
              </Button>
            ) : (
              <span className="text-xs text-[var(--muted)]">Use filters to narrow the 150-problem study plan.</span>
            )}
            {filters.query.trim() ? <Badge variant="primary">Search: {filters.query.trim()}</Badge> : null}
            {filters.difficulty !== "all" ? (
              <Badge variant={difficultyVariant(filters.difficulty as Difficulty)}>{filters.difficulty}</Badge>
            ) : null}
            {filters.section !== "all" ? (
              <Badge variant="info">{sectionNames.get(filters.section) ?? filters.section}</Badge>
            ) : null}
            {filters.topic !== "all" ? <Badge>{filters.topic}</Badge> : null}
            {filters.status !== "all" ? (
              <Badge variant={statusVariant(filters.status as Exclude<ProblemStatusFilter, "all">)}>
                {statusLabel(filters.status as Exclude<ProblemStatusFilter, "all">)}
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {filteredProblems.length === 0 ? (
        <EmptyState
          title="No problems match these filters"
          description="Change the search or filter combination, then use the clear filters control above to restore the canonical list."
        />
      ) : (

        <div className="space-y-6">
          {visibleSections.map((section) => (
            <section
              key={section.slug}
              aria-labelledby={`section-${section.slug}`}
              className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-hover)] px-6 py-3.5">
                <h2 id={`section-${section.slug}`} className="text-base font-bold tracking-tight text-[var(--foreground)]">
                  {section.name}
                </h2>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {section.problems.length} bài
                </span>
              </div>
              <ul aria-label={`Problems in ${section.name}`} className="divide-y divide-[var(--border)]">
                {section.problems.map((problem) => {
                  const record = getProblemProgress(state, problem.id);
                  const learnerStatus = record?.status ?? "not-started";
                  const hasFullProblem = problem.contentStatus.source === "full-source";

                  return (
                    <li key={problem.id} className="group transition-all duration-150 hover:bg-[var(--surface-hover)]">
                      <div className="flex flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3.5">
                            <span className="mt-0.5 min-w-12 font-mono text-sm font-black tabular-nums text-[var(--muted)]">
                              #{problem.id}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  href={`/problems/${problem.id}`}
                                  className="font-bold text-base text-[var(--foreground)] transition group-hover:text-[var(--primary)] hover:underline focus-visible:outline-none"
                                >
                                  {problem.title}
                                </Link>
                                {record?.bookmarked ? (
                                  <span aria-label={`Bookmarked problem ${problem.id}`} title="Đã lưu bookmark" className="text-amber-500 text-sm">
                                    ★
                                  </span>
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

                        <div className="flex flex-wrap items-center gap-2.5 pl-0 md:max-w-[45%] md:justify-end md:pl-4">
                          <Badge variant={difficultyVariant(problem.difficulty)} dot>
                            {problem.difficulty}
                          </Badge>
                          <Badge variant={statusVariant(learnerStatus)}>
                            {statusLabel(learnerStatus)}
                          </Badge>
                          <span className="text-xs font-medium text-[var(--muted)]">
                            {hasFullProblem ? "Sẵn sàng" : "Rút gọn"}
                          </span>
                          {problem.contentStatus.solution === "complete" ? (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-semibold">• Có Solution</span>
                          ) : null}
                          <Link
                            href={`/problems/${problem.id}`}
                            aria-label={`Study ${problem.title}`}
                            className="grid size-9 place-items-center rounded-xl border border-[var(--border)] text-[var(--muted)] transition-all hover:scale-105 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
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
