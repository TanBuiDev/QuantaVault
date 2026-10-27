"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Presentation,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  Bookmark,
  Building2,
  Lightbulb,
  Sparkles,
  Layers,
  HelpCircle,
} from "lucide-react";
import type { InterviewQuestion } from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES } from "@/lib/interview/types";
import { MarkdownContent } from "@/features/practice/MarkdownContent";

export type PresentationFontSize = "normal" | "large" | "huge";

export interface InterviewPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: InterviewQuestion[];
  initialIndex?: number;
  isLearned: (id: string) => boolean;
  isReview: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  onToggleLearned: (id: string) => void;
  onToggleReview: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export function InterviewPresentationModal({
  isOpen,
  onClose,
  questions,
  initialIndex = 0,
  isLearned,
  isReview,
  isBookmarked,
  onToggleLearned,
  onToggleReview,
  onToggleBookmark,
}: InterviewPresentationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const [fontSize, setFontSize] = useState<PresentationFontSize>(() => {
    if (typeof window === "undefined") return "large";
    try {
      return (localStorage.getItem("interview_presentation_font") as PresentationFontSize) || "large";
    } catch {
      return "large";
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync index when initialIndex changes or modal opens (adjust state during render)
  const [prevProps, setPrevProps] = useState({ isOpen, initialIndex });
  if (prevProps.isOpen !== isOpen || prevProps.initialIndex !== initialIndex) {
    setPrevProps({ isOpen, initialIndex });
    if (isOpen) {
      const validIndex = Math.max(0, Math.min(questions.length - 1, initialIndex));
      setCurrentIndex(validIndex);
      setShowAnswer(false);
    }
  }

  // Persist font size
  const handleSetFontSize = (size: PresentationFontSize) => {
    setFontSize(size);
    try {
      localStorage.setItem("interview_presentation_font", size);
    } catch {}
  };

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      scrollContainerRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
      scrollContainerRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcut controller
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const activeQ = questions[currentIndex];

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowRight":
        case "j":
        case "J":
        case "PageDown":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
        case "k":
        case "K":
        case "PageUp":
          e.preventDefault();
          handlePrev();
          break;
        case " ":
          e.preventDefault();
          setShowAnswer((prev) => !prev);
          break;
        case "1":
          if (activeQ) {
            e.preventDefault();
            onToggleLearned(activeQ.id);
          }
          break;
        case "2":
          if (activeQ) {
            e.preventDefault();
            onToggleReview(activeQ.id);
          }
          break;
        case "3":
          if (activeQ) {
            e.preventDefault();
            onToggleBookmark(activeQ.id);
          }
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    currentIndex,
    questions,
    onClose,
    handleNext,
    handlePrev,
    onToggleLearned,
    onToggleReview,
    onToggleBookmark,
    toggleFullscreen,
  ]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const categoryMeta = INTERVIEW_CATEGORIES[currentQ.category] || {
    id: currentQ.category,
    label: currentQ.category,
  };

  const difficultyColors = {
    junior: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    middle: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    senior: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  }[currentQ.difficulty];

  const difficultyLabel = {
    junior: "Junior (Cơ bản)",
    middle: "Middle (Trung cấp)",
    senior: "Senior (Nâng cao)",
  }[currentQ.difficulty];

  const hasLearned = isLearned(currentQ.id);
  const hasReview = isReview(currentQ.id);
  const hasBookmarked = isBookmarked(currentQ.id);

  // Typography scale classes according to selected font size
  const titleClass = {
    normal: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-3xl sm:text-4xl md:text-5xl",
    huge: "text-4xl sm:text-5xl md:text-6xl",
  }[fontSize];

  const summaryClass = {
    normal: "text-base sm:text-lg leading-relaxed",
    large: "text-lg sm:text-xl leading-relaxed",
    huge: "text-xl sm:text-2xl leading-relaxed",
  }[fontSize];

  const answerProseClass = {
    normal: "text-base leading-7 sm:text-[17px]",
    large: "text-lg leading-8 sm:text-xl",
    huge: "text-xl leading-9 sm:text-2xl",
  }[fontSize];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chế độ Trình chiếu Câu hỏi Phỏng vấn"
      className="fixed inset-0 z-50 flex flex-col bg-[var(--page)] text-[var(--foreground)] animate-fade-in"
    >
      {/* 1. Header Toolbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 shadow-xs backdrop-blur-md">
        {/* Left: Presentation Branding & Question Index */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Presentation className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-[var(--foreground)]">
                Chế Độ Trình Chiếu
              </span>
              <span className="hidden sm:inline-flex rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Active Recall
              </span>
            </div>
            <p className="truncate text-xs font-semibold text-[var(--muted)]">
              Câu hỏi <strong className="text-[var(--foreground)]">{currentIndex + 1}</strong> /{" "}
              {questions.length} ({Math.round(((currentIndex + 1) / questions.length) * 100)}%)
            </p>
          </div>
        </div>

        {/* Center: Slide Progress Pill */}
        <div className="hidden lg:flex items-center gap-1.5 w-64 max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-hover)] border border-[var(--border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Font size scale, Fullscreen, Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Size Chooser */}
          <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-0.5">
            <button
              type="button"
              onClick={() => handleSetFontSize("normal")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                fontSize === "normal"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title="Cỡ chữ tiêu chuẩn"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleSetFontSize("large")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                fontSize === "large"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title="Cỡ chữ lớn (Khuyên dùng)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => handleSetFontSize("huge")}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                fontSize === "huge"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              title="Cỡ chữ cực lớn"
            >
              A++
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
            title={isFullscreen ? "Thoát toàn màn hình (F)" : "Toàn màn hình (F)"}
            aria-label="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-colors"
            title="Đóng chế độ trình chiếu (Phím ESC)"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Main Slide Canvas Area */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 lg:px-12"
      >
        <div className="mx-auto max-w-4xl xl:max-w-5xl space-y-8 animate-fade-in">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm sm:text-base font-extrabold text-[var(--muted)] bg-[var(--surface-hover)] px-2.5 py-1 rounded-xl border border-[var(--border)]">
              #{String(currentIndex + 1).padStart(2, "0")}
            </span>

            {/* Category */}
            <span className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-2xs">
              {categoryMeta.label}
            </span>

            {/* Difficulty */}
            <span className={`rounded-xl border px-3 py-1 text-xs sm:text-sm font-bold ${difficultyColors}`}>
              {difficultyLabel}
            </span>

            {/* Companies */}
            {currentQ.companies?.map((comp) => (
              <span
                key={comp}
                className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                <Building2 className="h-3.5 w-3.5" />
                {comp}
              </span>
            ))}
          </div>

          {/* Question Title Header */}
          <div className="space-y-4">
            <h1
              className={`font-black tracking-[-0.035em] text-[var(--foreground)] ${titleClass} leading-tight`}
            >
              {currentQ.title}
            </h1>

            {/* Tags */}
            {currentQ.tags && currentQ.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {currentQ.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)] border border-[var(--border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Recall Prompt Box (When Answer is Hidden) */}
          {!showAnswer ? (
            <div className="rounded-3xl border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] p-8 sm:p-10 text-center space-y-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner">
                <HelpCircle className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
                  Thời Gian Thảo Luận & Tự Trả Lời
                </h2>
                <p className="mx-auto max-w-xl text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  Hãy suy nghĩ và thử tự trả lời hoặc thảo luận trước khi mở đáp án chi tiết.
                </p>
              </div>

              {/* Reveal Answer Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-7 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Eye className="h-5 w-5" />
                  <span>Hiện Lời Giải & Phân Tích (Phím Space)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Answer revealed view */
            <div className="space-y-8 animate-fade-in">
              {/* Summary / Key Takeaways Card */}
              {currentQ.summary && (
                <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/[0.05] p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm sm:text-base">
                    <Sparkles className="h-5 w-5" />
                    <span>Tóm tắt cốt lõi để trả lời phỏng vấn:</span>
                  </div>
                  <p className={`font-medium text-[var(--foreground)] ${summaryClass}`}>
                    {currentQ.summary}
                  </p>
                </div>
              )}

              {/* Key Takeaways */}
              {currentQ.keyTakeaways && currentQ.keyTakeaways.length > 0 && (
                <div className="rounded-3xl border border-amber-500/30 bg-amber-500/[0.05] p-6 sm:p-7 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base">
                    <Lightbulb className="h-5 w-5" />
                    <span>Điểm mấu chốt ghi điểm (Key Takeaways):</span>
                  </div>
                  <ul className="space-y-2.5 pl-5 list-disc text-[var(--foreground)] font-medium">
                    {currentQ.keyTakeaways.map((item, i) => (
                      <li key={i} className={summaryClass}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Detailed Answer Markdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <h3 className="text-lg sm:text-xl font-black text-[var(--foreground)] flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span>Phân tích chi tiết & Mã nguồn minh họa</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAnswer(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Thu gọn đáp án (Space)</span>
                  </button>
                </div>

                <div
                  className={`prose prose-slate dark:prose-invert max-w-none w-full ${answerProseClass}`}
                >
                  <MarkdownContent markdown={currentQ.answerMarkdown} fullWidth />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Bottom Controller Toolbar */}
      <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4 shadow-xl backdrop-blur-md">
        <div className="mx-auto max-w-4xl xl:max-w-5xl flex flex-wrap items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 sm:px-5 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-xs transition-all hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Trước (K)</span>
          </button>

          {/* Center Action Group: Status & Reveal */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleLearned(currentQ.id)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all cursor-pointer ${
                hasLearned
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Phím tắt: 1"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Nắm vững (1)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleReview(currentQ.id)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all cursor-pointer ${
                hasReview
                  ? "border-amber-500/50 bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Phím tắt: 2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Cần ôn (2)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-all cursor-pointer ${
                hasBookmarked
                  ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Phím tắt: 3"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Đánh dấu (3)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAnswer((prev) => !prev)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              {showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showAnswer ? "Ẩn đáp án" : "Mở đáp án"} (Space)</span>
            </button>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-indigo-600 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition-all hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Tiếp (J)</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
