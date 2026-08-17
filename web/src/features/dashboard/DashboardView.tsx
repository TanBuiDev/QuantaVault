"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
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

  const summaryCards = [
    { label: "Total", value: metrics.total },
    { label: "Solved", value: metrics.solved },
    { label: "In progress", value: metrics.inProgress },
    { label: "Review", value: metrics.review },
    { label: "Remaining", value: metrics.remaining },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Personal study dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Top Interview 150
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Study directly from the repository&apos;s canonical problem packages while your personal progress stays in this browser.
          </p>
        </div>
        <Link
          href="/problems"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Browse problems
        </Link>
      </header>

      <section aria-labelledby="summary-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="summary-heading" className="text-lg font-semibold text-slate-950">
            Progress summary
          </h2>
          <span className="text-sm text-slate-500" aria-live="polite">
            {hydrated ? "Saved progress loaded" : "Loading saved progress"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {summaryCards.map((item) => (
            <Card key={item.label}>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="sections-heading" className="text-lg font-semibold text-slate-950">
              Section progress
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Solved counts follow the exact section ordering in {plan.title}.
            </p>
          </div>
          <Badge>{plan.sections.length} sections</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.slug}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-950">{section.name}</h3>
                  <span className="text-sm font-semibold text-slate-600">
                    {section.solved}/{section.total}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressBar
                  value={section.solved}
                  max={section.total}
                  label={`${section.name} solved progress`}
                />
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>{section.inProgress} in progress</span>
                  <span>{section.review} review</span>
                  <span>{section.remaining} not started</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
