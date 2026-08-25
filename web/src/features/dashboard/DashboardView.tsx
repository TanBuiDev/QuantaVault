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
    { label: "Solved", value: metrics.solved, detail: "Đã hoàn thành", variant: "success" as const },
    { label: "In progress", value: metrics.inProgress, detail: "Đang luyện tập", variant: "primary" as const },
    { label: "Review", value: metrics.review, detail: "Cần ôn lại", variant: "warning" as const },
    { label: "Remaining", value: metrics.remaining, detail: "Chưa bắt đầu", variant: "neutral" as const },
  ];

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-in">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>Study Hub</Badge>
            <span className="text-sm font-medium text-[var(--muted)]">{plan.sections.length} topics · {metrics.total} problems</span>
          </div>
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl xl:text-5xl">
            Top Interview 150
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Xây dựng tư duy thuật toán vững vàng từng bài một. Học bài, lưu phiên bản code và theo dõi tiến độ học tập trên LeetCode.
          </p>
        </div>
        <Link
          href="/problems"
          aria-label="Browse problems"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          Browse problems <span aria-hidden="true">→</span>
        </Link>
      </header>


      <section aria-label="Overall study progress" className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="overflow-hidden border-transparent bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 text-white shadow-xl shadow-indigo-950/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Tiến độ tổng quan</p>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tight sm:text-6xl">{solvedPercent}%</span>
                  <span className="text-sm font-semibold text-indigo-200">{metrics.solved} / {metrics.total} bài</span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/85">
                  Sự kiên trì quan trọng hơn tốc độ. Đánh dấu xanh bài đã nắm rõ và đưa các bài chưa tự tin vào danh sách ôn tập.
                </p>
              </div>
              <div className="min-w-40 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/20 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">Browser Sync</p>
                <p className="mt-1.5 text-sm font-semibold">{hydrated ? "Dữ liệu sẵn sàng" : "Đang tải dữ liệu..."}</p>
              </div>
            </div>
            <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/25 ring-1 ring-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500" style={{ width: `${solvedPercent}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {summaryCards.map((item) => (
            <Card key={item.label} interactive className="min-h-32">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{item.label}</p>
                  <Badge variant={item.variant} dot />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-black tracking-tight text-[var(--foreground)]">{item.value}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary-strong)]">Lộ trình học tập</p>
            <h2 id="sections-heading" className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              Progress by section
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Theo sát cấu trúc phân loại của Top Interview 150 để nắm vững từng dạng bài.</p>
          </div>
          <Badge variant="primary">{plan.sections.length} topics</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {sections.map((section) => {
            const percent = section.total > 0 ? Math.round((section.solved / section.total) * 100) : 0;
            return (
              <Card key={section.slug} interactive className="group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-base text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {section.name}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {section.inProgress} đang làm · {section.review} ôn tập · {section.remaining} còn lại
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-lg font-black text-[var(--foreground)]">{percent}%</span>
                      <p className="text-xs font-medium text-[var(--muted)]">{section.solved}/{section.total}</p>
                    </div>
                  </div>
                  <ProgressBar
                    value={section.solved}
                    max={section.total}
                    variant={percent === 100 ? "success" : percent > 50 ? "primary" : "warning"}
                    label={`${section.name} solved progress`}
                    className="mt-4"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

