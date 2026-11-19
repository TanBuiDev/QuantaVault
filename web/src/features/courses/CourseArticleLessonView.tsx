"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Terminal,
  Volume2,
  CheckCircle2,
  Circle,
  Share2,
  Check,
  Menu,
  X,
  Clock,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import { InterviewTextSizeControl } from "@/features/interview/InterviewTextSizeControl";
import { useCourseTextSize } from "./useCourseTextSize";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { CourseSyllabusSidebar } from "./CourseSyllabusSidebar";
import { SpringDockFlashcards } from "./SpringDockFlashcards";

interface CourseArticleLessonViewProps {
  course: CourseManifest;
  lesson: CourseLesson;
  chapterTitle: string;
  prevLesson?: CourseLesson;
  nextLesson?: CourseLesson;
}

export function CourseArticleLessonView({
  course,
  lesson,
  chapterTitle,
  prevLesson,
  nextLesson
}: CourseArticleLessonViewProps) {
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { textScale, changeTextScale } = useCourseTextSize();
  const { speak, isSpeaking } = useEnglishSpeech();

  const {
    hydrated,
    isLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessed
  } = useCourseProgress();

  const isCompleted = hydrated ? isLessonCompleted(course.id, lesson.id) : false;

  useEffect(() => {
    recordLastAccessed(course.id, lesson.id);
  }, [course.id, lesson.id, recordLastAccessed]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isCheatsheet = lesson.lessonType === "cheatsheet" || lesson.tags?.some((t) => t.toLowerCase().includes("cheatsheet"));
  const isPractice = lesson.lessonType === "practice" || lesson.tags?.some((t) => t.toLowerCase().includes("practice"));

  const getBadgeConfig = () => {
    if (isCheatsheet) {
      return {
        icon: Code2,
        label: "Sổ tay tra cứu mã nguồn (Cheat Sheet)",
        className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      };
    }
    if (isPractice) {
      return {
        icon: Terminal,
        label: "Bài thực hành tình huống & Kịch bản",
        className: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
      };
    }
    return {
      icon: BookOpen,
      label: "Tài liệu đọc chuyên sâu",
      className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
    };
  };

  const badgeConfig = getBadgeConfig();
  const BadgeIcon = badgeConfig.icon;

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-7xl 2xl:max-w-[1720px] space-y-6 lg:space-y-8 animate-fade-in">
      {/* Mobile Syllabus Drawer Overlay */}
      {mobileSyllabusOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
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

      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSyllabusOpen(true)}
            className="lg:hidden flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-2xs cursor-pointer"
          >
            <Menu className="h-4 w-4 text-emerald-500" />
            <span>Mục lục</span>
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)] truncate">
            <Link href="/courses" className="hover:text-[var(--foreground)] transition-colors">
              Khóa học
            </Link>
            <span>/</span>
            <span className="text-[var(--muted-strong)] truncate">{course.title}</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              Bài {lesson.number}
            </span>
          </nav>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
          </div>

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

          <button
            type="button"
            onClick={() => toggleLessonCompleted(course.id, lesson.id)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              isCompleted
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-[var(--primary)] text-white hover:brightness-110 shadow-sm active:scale-95"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Đã đọc xong</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" />
                <span>Đánh dấu đã đọc</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-hover)] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wide border shadow-2xs ${badgeConfig.className}`}
          >
            <BadgeIcon className="h-3.5 w-3.5" />
            <span>{badgeConfig.label}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Clock className="h-3.5 w-3.5" />
            <span>{lesson.durationMinutes} phút đọc dự kiến</span>
          </span>

          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {chapterTitle}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight leading-snug">
              {lesson.title}
            </h1>
            {lesson.titleEn && (
              <button
                type="button"
                onClick={() => speak(lesson.titleEn!)}
                title="Nghe phát âm chuẩn tiêu đề tiếng Anh"
                aria-label="Nghe phát âm tiêu đề tiếng Anh"
                className={`inline-flex items-center justify-center p-2 rounded-xl border border-emerald-500/30 transition-all cursor-pointer ${
                  isSpeaking(lesson.titleEn)
                    ? "bg-emerald-600 text-white animate-pulse"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {lesson.titleEn && (
            <p className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-semibold">
              {lesson.titleEn}
            </p>
          )}
          {lesson.summary && (
            <p className="text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed max-w-4xl pt-1">
              {lesson.summary}
            </p>
          )}
        </div>
      </div>

      {/* 3. Main Reading Content & Sidebar (8/12 : 4/12) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
        {/* Left Column: Markdown Content */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-xs">
            <div
              className="prose dark:prose-invert max-w-none [contain:content]"
              style={{ fontSize: `${textScale}%` }}
            >
              <MarkdownContent markdown={lesson.contentMarkdown} />
            </div>
          </div>
        </div>

        {/* Right Column: Course Syllabus & Quick Cards (Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-6 space-y-4">
          <CourseSyllabusSidebar
            course={course}
            currentLessonId={lesson.id}
            className="flex flex-col h-[650px] rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden"
          />

          {lesson.flashcards && lesson.flashcards.length > 0 && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Thẻ ghi nhớ bài học ({lesson.flashcards.length})</span>
              </div>
              <div className="h-[280px]">
                <SpringDockFlashcards
                  flashcards={lesson.flashcards}
                  textScale={textScale}
                  className="h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
