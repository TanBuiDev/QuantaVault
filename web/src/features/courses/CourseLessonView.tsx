"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Share2,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { CourseSyllabusSidebar } from "./CourseSyllabusSidebar";

interface CourseLessonViewProps {
  course: CourseManifest;
  lesson: CourseLesson;
  chapterTitle: string;
  prevLesson?: CourseLesson;
  nextLesson?: CourseLesson;
}

export function CourseLessonView({
  course,
  lesson,
  chapterTitle,
  prevLesson,
  nextLesson
}: CourseLessonViewProps) {
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const {
    hydrated,
    isLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessed
  } = useCourseProgress();

  const isCompleted = hydrated ? isLessonCompleted(course.id, lesson.id) : false;

  // Record this lesson as last visited
  useEffect(() => {
    recordLastAccessed(course.id, lesson.id);
  }, [course.id, lesson.id, recordLastAccessed]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] relative w-full bg-[var(--background)]">
      {/* 1. Desktop Syllabus Sidebar (fixed width on desktop) */}
      <div className="hidden lg:block w-80 shrink-0 border-r border-[var(--border)] sticky top-0 h-[calc(100vh-4rem)]">
        <CourseSyllabusSidebar course={course} currentLessonId={lesson.id} />
      </div>

      {/* 2. Mobile Syllabus Drawer Overlay */}
      {mobileSyllabusOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSyllabusOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-[var(--surface)] h-full shadow-2xl flex flex-col z-10 animate-slide-in-left">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--foreground)]">Mục Lục Khóa Học</span>
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CourseSyllabusSidebar
                course={course}
                currentLessonId={lesson.id}
                onLessonSelect={() => setMobileSyllabusOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Lesson Reading View */}
      <main className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Top Bar for Mobile & Breadcrumbs */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-2xs"
              >
                <Menu className="h-4 w-4 text-indigo-500" />
                <span>Mục lục</span>
              </button>

              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)] truncate">
                <Link href="/courses" className="hover:text-[var(--foreground)] transition-colors">
                  Khóa học
                </Link>
                <span>/</span>
                <span className="text-[var(--muted-strong)] truncate">{course.title}</span>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                  Bài {lesson.number}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Share link button */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-all"
                title="Sao chép liên kết bài học"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </>
                )}
              </button>

              {/* Mark Complete Button */}
              <button
                type="button"
                onClick={() => toggleLessonCompleted(course.id, lesson.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-[var(--primary)] text-white hover:brightness-110 shadow-sm active:scale-95"
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đã học xong</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" />
                    <span>Đánh dấu đã học</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lesson Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {chapterTitle}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <Clock className="h-3.5 w-3.5" />
                <span>{lesson.durationMinutes} phút đọc</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight leading-snug">
              {lesson.title}
            </h1>

            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {lesson.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Summary Box */}
            {lesson.summary && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4 sm:p-5 text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed shadow-2xs">
                <span className="font-bold text-[var(--foreground)] block mb-1">
                  🎯 Tóm tắt bài học:
                </span>
                {lesson.summary}
              </div>
            )}
          </header>

          {/* Markdown Content Area */}
          <article className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6">
            <MarkdownContent markdown={lesson.contentMarkdown} />
          </article>
        </div>

        {/* Footer Navigation Bar */}
        <footer className="mt-12 border-t border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {prevLesson ? (
              <Link
                href={`/courses/${course.slug}/${prevLesson.id}`}
                className="group flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left hover:border-indigo-500/40 hover:shadow-sm transition-all max-w-[45%]"
              >
                <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-indigo-500 transition-colors" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Bài trước
                  </span>
                  <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {prevLesson.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${course.slug}/${nextLesson.id}`}
                className="group flex items-center justify-end gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-right hover:border-indigo-500/40 hover:shadow-sm transition-all max-w-[45%]"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Bài tiếp theo
                  </span>
                  <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {nextLesson.title}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-indigo-500 transition-colors" />
              </Link>
            ) : (
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-500">
                  🎉 Chúc mừng bạn đã hoàn thành khóa học!
                </span>
              </div>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
