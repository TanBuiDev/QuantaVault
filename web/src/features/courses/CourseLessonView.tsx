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
  Check,
  BookOpen,
  Languages,
  Volume2,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import { InterviewTextSizeControl } from "@/features/interview/InterviewTextSizeControl";
import { useInterviewTextSize } from "@/features/interview/useInterviewTextSize";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { useAccount } from "@/lib/auth/AccountProvider";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { CourseSyllabusSidebar } from "./CourseSyllabusSidebar";
import { EnglishLessonContent } from "./EnglishLessonContent";

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
  const [copyFailed, setCopyFailed] = useState(false);
  const { requestLogin } = useAccount();
  const { textScale, changeTextScale } = useInterviewTextSize();
  const { speak, isSpeaking } = useEnglishSpeech();
  const isEnglish = course.slug === "english-job-interview";
  const visibleMarkdown = isEnglish
    ? lesson.contentMarkdown.replace(/^# Lesson [^\n]*\n\n\*\*Tiếng Việt:\*\*[^\n]*\n\n---\n\n/, "")
    : lesson.contentMarkdown;

  const {
    hydrated,
    canTrackProgress,
    isLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessed,
    getCourseCompletion
  } = useCourseProgress();

  const isCompleted = hydrated ? isLessonCompleted(course.id, lesson.id) : false;
  const courseCompleted = hydrated && getCourseCompletion(course.id, course.totalLessons).completedCount === course.totalLessons;

  // Record this lesson as last visited
  useEffect(() => {
    if (canTrackProgress) recordLastAccessed(course.id, lesson.id);
  }, [course.id, lesson.id, recordLastAccessed, canTrackProgress]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFailed(false);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
      setCopyFailed(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1720px] space-y-8 lg:space-y-10 animate-fade-in">
      {/* Mobile Syllabus Drawer Overlay */}
      {mobileSyllabusOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSyllabusOpen(false)}
          />
          <div className="relative w-84 max-w-[85vw] bg-[var(--surface)] h-full shadow-2xl flex flex-col z-10 animate-slide-in-left">
            <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--foreground)]">Mục Lục Khóa Học</span>
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] cursor-pointer"
                aria-label="Đóng mục lục"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CourseSyllabusSidebar
                course={course}
                currentLessonId={lesson.id}
                onLessonSelect={() => setMobileSyllabusOpen(false)}
                className="flex flex-col h-full bg-[var(--surface)] overflow-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Responsive Layout on Desktop / Large Screens */}
      <div className="xl:grid xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_380px] xl:gap-8 xl:items-start">
        {/* Left / Center Column: Lesson Article (Fluid 1fr) */}
        <div className="space-y-8 min-w-0">
          {/* 1. Top Navigation & Action Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(true)}
                className="xl:hidden flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-2xs cursor-pointer"
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
              {/* Fallback Text Size Control on screens where the Right Rail is hidden */}
              <div className="xl:hidden">
                <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
              </div>

              {isEnglish && (
                <Link
                  href={`/courses/english-job-interview/practice?lesson=${lesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                  aria-label="Mở chế độ luyện tập tiếng Anh"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">Luyện tập</span>
                </Link>
              )}

              {/* Share link button */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
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

              {copyFailed && <div role="alert" className="text-xs text-amber-600">
                Không thể sao chép tự động. Bạn có thể chọn liên kết trên thanh địa chỉ để sao chép.
              </div>}
              {/* Mark Complete Button */}
              <button
                type="button"
                onClick={() => canTrackProgress ? toggleLessonCompleted(course.id, lesson.id) : requestLogin()}
                title={!canTrackProgress ? "Đăng nhập Google để lưu tiến độ học tập" : undefined}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
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

          {/* 2. Lesson Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {chapterTitle}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <Clock className="h-3.5 w-3.5" />
                <span>{lesson.durationMinutes} phút học dự kiến</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                {isEnglish && lesson.titleEn ? lesson.titleEn : lesson.title}
              </h1>
              {isEnglish && lesson.titleEn && (
                <button
                  type="button"
                  onClick={() => speak(lesson.titleEn!)}
                  title="Nghe phát âm chuẩn tiêu đề tiếng Anh"
                  aria-label="Nghe phát âm tiêu đề tiếng Anh"
                  className={`inline-flex items-center justify-center p-2 rounded-xl border border-indigo-500/30 transition-all cursor-pointer ${
                    isSpeaking(lesson.titleEn)
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                  }`}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              )}
            </div>
            {isEnglish && lesson.titleEn && (
              <p className="text-base sm:text-lg text-[var(--muted-strong)] font-medium">{lesson.title}</p>
            )}

            {/* Quick practice card for English lessons */}
            {isEnglish && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <Languages className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">Luyện nghe, dịch & phản xạ cho bài này</h4>
                    <p className="text-xs text-[var(--muted-strong)]">Gõ dịch hai chiều, nghe phát âm bản xứ và tự đánh giá khả năng ghi nhớ.</p>
                  </div>
                </div>
                <Link
                  href={`/courses/english-job-interview/practice?lesson=${lesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
                >
                  Luyện tập ngay <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

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
            {!isEnglish && lesson.summary && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4 sm:p-5 text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed shadow-2xs">
                <span className="font-bold text-[var(--foreground)] block mb-1">
                  <BookOpen className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
                  Tóm tắt bài học:
                </span>
                {lesson.summary}
              </div>
            )}
          </header>

          {/* 3. Content Area */}
          {isEnglish ? (
            <section aria-label="Nội dung bài học tiếng Anh">
              <EnglishLessonContent
                lessonId={lesson.id}
                textScale={textScale}
                fallbackMarkdown={visibleMarkdown}
              />
            </section>
          ) : (
            <section aria-label="Nội dung bài học" className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6">
              <MarkdownContent markdown={visibleMarkdown} fullWidth textScale={textScale} />
            </section>
          )}

          {/* 4. Footer Navigation Bar */}
          <footer className="pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/${prevLesson.id}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left hover:border-indigo-500/40 hover:shadow-xs transition-all max-w-[48%]"
                >
                  <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-indigo-500 transition-colors" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                      Bài trước
                    </span>
                    <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {prevLesson.titleEn || prevLesson.title}
                    </span>
                    {prevLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{prevLesson.title}</span>}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/${nextLesson.id}`}
                  className="group flex items-center justify-end gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right hover:border-indigo-500/40 hover:shadow-xs transition-all max-w-[48%]"
                >
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                      Bài tiếp theo
                    </span>
                    <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {nextLesson.titleEn || nextLesson.title}
                    </span>
                    {nextLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{nextLesson.title}</span>}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-indigo-500 transition-colors" />
                </Link>
              ) : (
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500">
                    {courseCompleted ? "Chúc mừng bạn đã hoàn thành khóa học!" : "Đây là bài học cuối của khóa học."}
                  </span>
                </div>
              )}
            </div>
          </footer>
        </div>

        {/* Right Sticky Column: Right Rail on Desktop / Large Screens (xl+) */}
        <aside className="hidden xl:block sticky top-6 space-y-4">
          {/* Sticky Text Zoom Control */}
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-2xs">
            <span className="text-xs font-semibold text-[var(--foreground)]">Cỡ chữ bài học</span>
            <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
          </div>

          <CourseSyllabusSidebar course={course} currentLessonId={lesson.id} />
        </aside>
      </div>
    </div>
  );
}
