"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  Circle,
  Share2,
  Check,
  Menu,
  X,
  Clock,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import { InterviewTextSizeControl } from "@/features/interview/InterviewTextSizeControl";
import { useCourseTextSize } from "./useCourseTextSize";
import type { CourseLesson, CourseManifest, CourseFlashcard } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { CourseSyllabusSidebar } from "./CourseSyllabusSidebar";

interface CourseQuizLessonViewProps {
  course: CourseManifest;
  lesson: CourseLesson;
  chapterTitle: string;
  prevLesson?: CourseLesson;
  nextLesson?: CourseLesson;
}

export function CourseQuizLessonView({
  course,
  lesson,
  chapterTitle,
  prevLesson,
  nextLesson
}: CourseQuizLessonViewProps) {
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"flashcards" | "questions">("flashcards");
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

  const flashcards = lesson.flashcards || [];
  const isGraded = lesson.title.toLowerCase().includes("graded") || lesson.tags?.some((t) => t.toLowerCase().includes("graded"));

  // Flashcard Deck State
  const [deck, setDeck] = useState<CourseFlashcard[]>(() => [...flashcards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setDeck([...flashcards]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Keyboard navigation
  useEffect(() => {
    if (activeTab !== "flashcards") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (["INPUT", "TEXTAREA"].includes(targetTag)) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) {
          setIsFlipped(false);
          setCurrentIndex((i) => i - 1);
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (currentIndex < deck.length - 1) {
          setIsFlipped(false);
          setCurrentIndex((i) => i + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, currentIndex, deck.length]);

  const handleShuffle = () => {
    setDeck((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setDeck([...flashcards]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = deck.length > 0 && currentIndex < deck.length ? deck[currentIndex] : null;

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
                <span>Đã làm xong</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" />
                <span>Đánh dấu hoàn thành</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Hero Quiz Header Banner */}
      <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-hover)] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold uppercase tracking-wide border shadow-2xs ${
              isGraded
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{isGraded ? "Graded Quiz (Tính điểm)" : "Practice Quiz (Luyện tập)"}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <Clock className="h-3.5 w-3.5" />
            <span>{lesson.durationMinutes} phút làm bài dự kiến</span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{flashcards.length > 0 ? `${flashcards.length} câu hỏi trắc nghiệm & thẻ ôn tập` : "Bộ câu hỏi trắc nghiệm"}</span>
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

      {/* 3. Main Quiz Studio (2 Columns: Quiz & Flashcard 8/12 : Syllabus 4/12) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
        {/* Left Column: Quiz Studio */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("flashcards")}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "flashcards"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                    : "text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Thẻ Flashcard ({flashcards.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                    : "text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <BookOpen className="h-4 w-4 text-emerald-500" />
                <span>Nội dung & Đáp án chi tiết</span>
              </button>
            </div>

            {activeTab === "flashcards" && (
              <div className="flex items-center gap-1.5 pr-1">
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  title="Xáo trộn câu hỏi"
                >
                  <Shuffle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Xáo trộn</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  title="Học lại từ đầu"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Làm lại</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: FLASHCARD ARENA */}
          {activeTab === "flashcards" && (
            <div className="space-y-4">
              {currentCard ? (
                <div className="space-y-4">
                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--muted-strong)] px-1">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Câu hỏi {currentIndex + 1} / {deck.length}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] font-normal hidden sm:inline">
                      Mẹo: Nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] font-mono text-[10px]">Space</kbd> để lật thẻ, <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] font-mono text-[10px]">→</kbd> để đổi câu
                    </span>
                  </div>

                  {/* 3D Flip Card Container */}
                  <div
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="group relative w-full h-[360px] sm:h-[420px] cursor-pointer [perspective:2000px] select-none"
                    title="Nhấp để lật thẻ (hoặc bấm Space)"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsFlipped((prev) => !prev);
                      }
                    }}
                  >
                    <div
                      className="relative w-full h-full rounded-3xl transition-transform duration-500 shadow-lg group-hover:shadow-xl"
                      style={{
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
                        transitionTimingFunction: "cubic-bezier(0.34, 1.25, 0.64, 1)"
                      }}
                    >
                      {/* Mặt trước: CÂU HỎI */}
                      <div
                        aria-hidden={isFlipped}
                        className="absolute inset-0 w-full h-full rounded-3xl border-2 border-emerald-500/25 group-hover:border-emerald-500/50 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-hover)] p-6 sm:p-10 flex flex-col justify-between items-center text-center overflow-hidden transition-colors"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateX(0deg)"
                        }}
                      >
                        <div className="w-full flex items-center justify-between text-xs text-[var(--muted)]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            CÂU HỎI #{currentIndex + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(currentCard.questionEn);
                            }}
                            className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Nghe phát âm câu hỏi tiếng Anh"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="w-full max-w-2xl my-auto space-y-4 px-2">
                          <p className="text-lg sm:text-xl lg:text-2xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                            {currentCard.questionEn}
                          </p>
                          <p className="text-sm sm:text-base font-medium text-[var(--muted-strong)] leading-relaxed">
                            {currentCard.questionVi}
                          </p>
                        </div>

                        <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <span>Nhấn vào thẻ để xem đáp án & giải thích</span>
                        </div>
                      </div>

                      {/* Mặt sau: ĐÁP ÁN & GIẢI THÍCH (Xoay 180deg theo trục X) */}
                      <div
                        aria-hidden={!isFlipped}
                        className="absolute inset-0 w-full h-full rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-emerald-950/10 p-6 sm:p-10 flex flex-col justify-between items-center text-center overflow-y-auto transition-colors"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateX(180deg)"
                        }}
                      >
                        <div className="w-full flex items-center justify-between text-xs text-[var(--muted)]">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            ĐÁP ÁN CHÍNH XÁC
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(currentCard.answerEn);
                            }}
                            className="p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Nghe phát âm đáp án"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="w-full max-w-2xl my-auto space-y-3.5 px-2 py-2">
                          <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide">
                            {currentCard.answerEn}
                          </div>
                          <p className="text-base sm:text-lg lg:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {currentCard.answerVi}
                          </p>

                          {(currentCard.explanationVi || currentCard.explanationEn) && (
                            <div className="text-left bg-[var(--surface-hover)]/70 rounded-2xl p-4 border border-[var(--border)] text-xs sm:text-sm text-[var(--muted-strong)] space-y-1.5 mt-2">
                              {currentCard.explanationEn && (
                                <p className="font-mono text-[11px] text-[var(--muted)]">
                                  {currentCard.explanationEn}
                                </p>
                              )}
                              {currentCard.explanationVi && (
                                <p className="font-medium text-[var(--foreground)]">
                                  {currentCard.explanationVi}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-[var(--muted)] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <span>Nhấn để quay lại mặt câu hỏi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Navigation Controls */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      disabled={currentIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentIndex((i) => Math.max(0, i - 1));
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Câu trước</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsFlipped((prev) => !prev)}
                        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-2xs"
                      >
                        {isFlipped ? "Xem câu hỏi" : "Lật xem đáp án"}
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={currentIndex === deck.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentIndex((i) => Math.min(deck.length - 1, i + 1));
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                    >
                      <span>Câu tiếp</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
                  <p className="text-sm text-[var(--muted)]">Không có thẻ flashcard nào trong bài học này.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FULL QUESTIONS & EXPLANATIONS */}
          {activeTab === "questions" && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs">
              <div
                className="prose dark:prose-invert max-w-none [contain:content]"
                style={{ fontSize: `${textScale}%` }}
              >
                <MarkdownContent markdown={lesson.contentMarkdown} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Course Syllabus (Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-6 space-y-4">
          <CourseSyllabusSidebar
            course={course}
            currentLessonId={lesson.id}
            className="flex flex-col h-[700px] rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
