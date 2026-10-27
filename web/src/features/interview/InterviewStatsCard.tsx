"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import type { InterviewProgressState, InterviewQuestion, InterviewStatus } from "@/lib/interview/types";
import { CheckCircle2, RotateCcw, Bookmark, BookOpen } from "lucide-react";

export interface InterviewStatsCardProps {
  questions: InterviewQuestion[];
  progress: InterviewProgressState;
  hydrated?: boolean;
  activeStatusFilter: InterviewStatus | "bookmarked" | "all";
  onSelectStatusFilter: (status: InterviewStatus | "bookmarked" | "all") => void;
}

export function InterviewStatsCard({
  questions,
  progress,
  hydrated = true,
  activeStatusFilter,
  onSelectStatusFilter,
}: InterviewStatsCardProps) {
  const stats = useMemo(() => {
    const total = questions.length;
    let learnedCount = 0;
    let reviewCount = 0;
    let bookmarkedCount = 0;

    for (const q of questions) {
      if (progress.learned[q.id]) learnedCount++;
      if (progress.review[q.id]) reviewCount++;
      if (progress.bookmarks[q.id]) bookmarkedCount++;
    }

    const unstartedCount = Math.max(0, total - (learnedCount + reviewCount));
    const percent = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

    return {
      total,
      learnedCount,
      reviewCount,
      bookmarkedCount,
      unstartedCount,
      percent,
    };
  }, [questions, progress]);

  const cards = [
    {
      key: "learned" as const,
      label: "Đã nắm vững",
      value: stats.learnedCount,
      icon: CheckCircle2,
      color: "text-emerald-500",
      activeBg: "border-emerald-500/40 bg-emerald-500/10",
      detail: "Sẵn sàng phỏng vấn",
    },
    {
      key: "review" as const,
      label: "Cần ôn lại",
      value: stats.reviewCount,
      icon: RotateCcw,
      color: "text-amber-500",
      activeBg: "border-amber-500/40 bg-amber-500/10",
      detail: "Cần đọc lại kỹ hơn",
    },
    {
      key: "bookmarked" as const,
      label: "Đã đánh dấu",
      value: stats.bookmarkedCount,
      icon: Bookmark,
      color: "text-indigo-500",
      activeBg: "border-indigo-500/40 bg-indigo-500/10",
      detail: "Câu hỏi trọng tâm",
    },
    {
      key: "not_started" as const,
      label: "Chưa bắt đầu",
      value: stats.unstartedCount,
      icon: BookOpen,
      color: "text-[var(--muted)]",
      activeBg: "border-[var(--border-strong)] bg-[var(--surface-hover)]",
      detail: "Đang chờ ôn tập",
    },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      {/* 1. Main Hero Progress Card */}
      <Card className="overflow-hidden border-transparent bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-950 text-white shadow-xl shadow-indigo-950/20">
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                  Tiến độ ôn phỏng vấn
                </p>
              </div>
              <div className="mt-2 flex items-baseline gap-3">
                {hydrated ? (
                  <>
                    <span className="text-5xl font-black tracking-tight sm:text-6xl">{stats.percent}%</span>
                    <span className="text-sm font-semibold text-indigo-200">
                      {stats.learnedCount} / {stats.total} câu hỏi
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-block h-12 w-20 bg-white/20 rounded-lg animate-pulse" />
                    <span className="inline-block h-5 w-28 bg-white/20 rounded-md animate-pulse" />
                  </>
                )}
              </div>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-indigo-100/80">
                Luyện tập phương pháp Active Recall: hãy đọc câu hỏi và thử tự trả lời trong đầu trước khi bấm mở đáp án.
              </p>
            </div>

            <div className="min-w-36 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/20 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Tổng ngân hàng</p>
              <p className="mt-1 text-2xl font-black">{stats.total} <span className="text-xs font-normal text-indigo-200">câu hỏi</span></p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 transition-all duration-500"
              style={{ width: `${hydrated ? stats.percent : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Interactive Filter / Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isActive = activeStatusFilter === c.key;

          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelectStatusFilter(isActive ? "all" : c.key)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? `${c.activeBg} shadow-sm ring-1 ring-[var(--focus)]`
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  {c.label}
                </span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>

              <div className="mt-2">
                {hydrated ? (
                  <p className="text-3xl font-black tracking-tight text-[var(--foreground)]">{c.value}</p>
                ) : (
                  <div className="h-9 w-12 rounded-lg bg-[var(--surface-hover)] animate-pulse" />
                )}
                <p className="mt-1 text-xs text-[var(--muted)]">{c.detail}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
