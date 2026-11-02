"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Database,
  ArrowLeft
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

interface CourseSyllabusSidebarProps {
  course: CourseManifest;
  currentLessonId: string;
  onLessonSelect?: () => void;
}

export function CourseSyllabusSidebar({
  course,
  currentLessonId,
  onLessonSelect
}: CourseSyllabusSidebarProps) {
  const { hydrated, isLessonCompleted, getCourseCompletion } = useCourseProgress();
  const { completedCount, totalLessons, percentage } = hydrated
    ? getCourseCompletion(course.id, course.totalLessons)
    : { completedCount: 0, totalLessons: course.totalLessons, percentage: 0 };

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
    <aside className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] overflow-hidden">
      {/* Header with back link & course title */}
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
              <Database className="h-4 w-4" />
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

      {/* Chapters list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {course.chapters.map((chapter) => {
          const isOpen = openChapters[chapter.id] !== false;
          const chapterLessons = course.lessons.filter((l) =>
            chapter.lessonIds.includes(l.id)
          );

          const chapterCompletedCount = chapterLessons.filter((l) =>
            isLessonCompleted(course.id, l.id)
          ).length;

          return (
            <div key={chapter.id} className="space-y-1.5">
              {/* Chapter Header Toggle */}
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                  )}
                  <span className="truncate">{chapter.title}</span>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-[var(--muted)]">
                  {chapterCompletedCount}/{chapterLessons.length}
                </span>
              </button>

              {/* Lessons in Chapter */}
              {isOpen && (
                <div className="space-y-0.5 pl-2 border-l-2 border-[var(--border)] ml-3">
                  {chapterLessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isDone = isLessonCompleted(course.id, lesson.id);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.slug}/${lesson.id}`}
                        onClick={onLessonSelect}
                        className={`group flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all ${
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
                              {String(lesson.number).padStart(2, "0")}.
                            </span>
                            {lesson.title.replace(/^Bài \d+:\s*/i, "")}
                          </p>
                          <span className="text-[10px] font-normal text-[var(--muted)]">
                            {lesson.durationMinutes} phút học dự kiến
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
    </aside>
  );
}
