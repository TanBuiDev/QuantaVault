"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { StudyPlan } from "@/lib/content";
import { useProgress } from "@/lib/progress/provider";

import { calculateDashboardMetrics, calculateSectionProgress } from "./metrics";

export interface DashboardViewProps {
  plan: StudyPlan;
  orderedProblemIds: number[];
}

export function DashboardView({ plan, orderedProblemIds }: DashboardViewProps) {
  const { state, hydrated } = useProgress();
  const metrics = useMemo(
    () => calculateDashboardMetrics(orderedProblemIds, state),
    [orderedProblemIds, state],
  );
  const sections = useMemo(() => calculateSectionProgress(plan, state), [plan, state]);
  const solvedPercent = metrics.total > 0 ? Math.round((metrics.solved / metrics.total) * 100) : 0;

  const summaryCards = [
    { label: "Solved", value: metrics.solved, detail: "Completed" },
    { label: "In progress", value: metrics.inProgress, detail: "Currently learning" },
    { label: "Review", value: metrics.review, detail: "Revisit soon" },
    { label: "Remaining", value: metrics.remaining, detail: "Not started" },
  ];

  return (
    <div className="space-y-8 lg:space-y-10">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">Study workspace</Badge>
            <span className="text-sm text-[var(--muted)]">{plan.sections.length} sections · {metrics.total} problems</span>
          </div>
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl xl:text-5xl">
            Top Interview 150
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Build interview confidence one problem at a time. Study here, code on LeetCode, and keep your progress in one focused workspace.
          </p>
        </div>
        <Link
          href="/problems"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          Browse problems <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section aria-label="Overall study progress" className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card className="overflow-hidden border-transparent bg-[linear-gradient(135deg,var(--primary),#312e81)] text-white shadow-lg shadow-indigo-950/10">
          <CardContent className="p-6 sm:p-7">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-100">Overall progress</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tight sm:text-6xl">{solvedPercent}%</span>
                  <span className="text-sm font-semibold text-indigo-100">{metrics.solved} / {metrics.total} solved</span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/90">
                  Consistency matters more than speed. Keep solved problems green and move uncertain ones into review.
                </p>
              </div>
              <div className="min-w-40 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">Saved locally</p>
                <p className="mt-2 text-sm font-semibold">{hydrated ? "Progress is ready" : "Loading progress"}</p>
              </div>
            </div>
            <div className="mt-7 h-2.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${solvedPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((item) => (
            <Card key={item.label} className="min-h-32">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-[var(--foreground)]">{item.value}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary-strong)]">Study plan</p>
            <h2 id="sections-heading" className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              Progress by section
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Follow the canonical Top Interview 150 order while tracking each topic separately.</p>
          </div>
          <Badge>{plan.sections.length} sections</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {sections.map((section) => {
            const percent = section.total > 0 ? Math.round((section.solved / section.total) * 100) : 0;
            return (
              <Card key={section.slug} className="group transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-[var(--foreground)]">{section.name}</h3>
                      <p className="mt-1 text-xs text-[var(--muted)]">{section.inProgress} learning · {section.review} review · {section.remaining} remaining</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-lg font-black text-[var(--foreground)]">{percent}%</span>
                      <p className="text-xs text-[var(--muted)]">{section.solved}/{section.total}</p>
                    </div>
                  </div>
                  <ProgressBar value={section.solved} max={section.total} label={`${section.name} solved progress`} className="mt-4" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
