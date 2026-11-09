"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Compass
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseIcon } from "@/components/ui/CourseIcon";
import type { CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

interface CourseSyllabusSidebarProps {
  course: CourseManifest;
  currentLessonId: string;
  onLessonSelect?: () => void;
  className?: string;
}

export function CourseSyllabusSidebar({
  course,
  currentLessonId,
  onLessonSelect,
  className
}: CourseSyllabusSidebarProps) {
  const { hydrated, isLessonCompleted, getCourseCompletion } = useCourseProgress();
  const { completedCount, totalLessons, percentage } = hydrated
    ? getCourseCompletion(course.id, course.totalLessons)
    : { completedCount: 0, totalLessons: course.totalLessons, percentage: 0 };

  const currentLesson = course.lessons.find((l) => l.id === currentLessonId);
  const currentLessonNumber = currentLesson?.number ?? 1;

  // Keep all chapters open by default, or track open states
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const ch of course.chapters) {
      initial[ch.id] = true;
    }
    return initial;
  });

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <aside
      className={
        className ||
        "flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden max-h-[calc(100vh-3rem)]"
      }
    >
      {/* 1. Header with back link & course title */}
      <div className="p-4 border-b border-[var(--border)] space-y-3 shrink-0">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Tất cả khóa học</span>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <CourseIcon name={course.icon} className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-[var(--foreground)] truncate tracking-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--muted)]">Tiến độ khóa học</span>
            <span className="font-bold text-[var(--foreground)]">
              {completedCount}/{totalLessons} ({percentage}%)
            </span>
          </div>
          <ProgressBar value={percentage} max={100} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* 2. Lesson Matrix Map (Mini-Map #01 to #20) */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
              <Compass className="h-4 w-4 text-indigo-500" />
              <span>Bản đồ {course.totalLessons} bài học</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              Bài {currentLessonNumber}/{course.totalLessons}
            </span>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-2.5 text-[10px] text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Đã học</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>Đang học</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
              <span>Chưa học</span>
            </span>
          </div>

          {/* Grid of buttons: #01 to #20 (5 cols x 4 rows) */}
          <div className="grid grid-cols-5 gap-1.5 pt-0.5">
            {course.lessons.map((l) => {
              const isCurrent = l.id === currentLessonId;
              const isDone = isLessonCompleted(course.id, l.id);
              return (
                <Link
                  key={l.id}
                  href={`/courses/${course.slug}/${l.id}`}
                  onClick={onLessonSelect}
                  title={`Bài ${String(l.number).padStart(2, "0")}: ${l.title.replace(/^Bài \d+:\s*/i, "")}`}
                  className={`group relative flex h-7 items-center justify-center rounded-lg text-[11px] font-bold transition-all ${
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/50 scale-105 z-10"
                      : isDone
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  #{String(l.number).padStart(2, "0")}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Chapters Accordion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Mục lục chi tiết ({course.chapters.length} chương)
            </span>
          </div>

          {course.chapters.map((chapter) => {
            const isOpen = openChapters[chapter.id] !== false;
            const chapterLessons = course.lessons.filter((l) =>
              chapter.lessonIds.includes(l.id)
            );

            const chapterCompletedCount = chapterLessons.filter((l) =>
              isLessonCompleted(course.id, l.id)
            ).length;

            return (
              <div
                key={chapter.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 space-y-1.5"
              >
                {/* Chapter Header Toggle */}
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate">{chapter.title}</span>
                      {chapter.titleEn && <span className="block truncate text-[10px] font-normal text-[var(--muted)]">{chapter.titleEn}</span>}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-[var(--muted)] bg-[var(--surface-hover)] px-1.5 py-0.5 rounded-md">
                    {chapterCompletedCount}/{chapterLessons.length}
                  </span>
                </button>

                {/* Lessons in Chapter */}
                {isOpen && (
                  <div className="space-y-0.5 pl-1.5 border-l-2 border-[var(--border)] ml-2.5">
                    {chapterLessons.map((l) => {
                      const isCurrent = l.id === currentLessonId;
                      const isDone = isLessonCompleted(course.id, l.id);

                      return (
                        <Link
                          key={l.id}
                          href={`/courses/${course.slug}/${l.id}`}
                          onClick={onLessonSelect}
                          className={`group flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs transition-all ${
                            isCurrent
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs border border-indigo-500/20"
                              : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : isCurrent ? (
                              <Circle className="h-4 w-4 text-indigo-500 fill-indigo-500/30" />
                            ) : (
                              <Circle className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--muted-strong)]" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="line-clamp-2 leading-relaxed">
                              <span className="font-semibold mr-1">
                                {String(l.number).padStart(2, "0")}.
                              </span>
                              {l.title.replace(/^Bài \d+:\s*/i, "")}
                            </p>
                            {l.titleEn && <span className="block mt-0.5 text-[10px] leading-relaxed font-normal text-[var(--muted)]">{l.titleEn}</span>}
                            <span className="text-[10px] font-normal text-[var(--muted)]">
                              {l.durationMinutes} phút học dự kiến
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
