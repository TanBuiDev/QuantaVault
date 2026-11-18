"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Sparkles,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookOpen,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import type { CourseLesson, CourseManifest, CourseFlashcard } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { getUrlParams, updateUrlParams } from "@/lib/utils/urlParams";
import { SpringTranscriptPanel } from "./SpringTranscriptPanel";

interface SpringLessonContentProps {
  course: CourseManifest;
  lesson: CourseLesson;
  textScale?: number;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
}

type SpringTabMode = "flashcards" | "blueprint" | "transcript";

const FLASHCARD_STORAGE_PREFIX = "quantavault-spring-flashcards:v1";

export function SpringLessonContent({
  course,
  lesson,
  textScale = 100,
  currentTime,
  onSeek
}: SpringLessonContentProps) {
  const hasFlashcards = Boolean(lesson.flashcards && lesson.flashcards.length > 0);
  const defaultTab: SpringTabMode = hasFlashcards ? "flashcards" : "blueprint";

  // 1. Tab state synchronized with URL search params (Tier 1 state persistence)
  const [activeTab, setActiveTab] = useState<SpringTabMode>(() => {
    if (typeof window !== "undefined") {
      const paramTab = getUrlParams().get("tab");
      if (paramTab === "flashcards" || paramTab === "blueprint" || paramTab === "transcript") {
        return paramTab;
      }
    }
    return defaultTab;
  });

  const handleTabChange = (tab: SpringTabMode) => {
    setActiveTab(tab);
    updateUrlParams({ tab }, { tab: defaultTab });
  };

  const { speak } = useEnglishSpeech();

  // 2. Flashcards state & deck management
  const originalFlashcards: CourseFlashcard[] = useMemo(() => {
    return lesson.flashcards || [];
  }, [lesson.flashcards]);

  const [deck, setDeck] = useState<CourseFlashcard[]>(originalFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scores, setScores] = useState<Record<string, "remembered" | "review">>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Load flashcard scores from localStorage
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(`${FLASHCARD_STORAGE_PREFIX}:${lesson.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            setScores(parsed);
          }
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [lesson.id]);

  // Synchronize deck when lesson changes
  useEffect(() => {
    setDeck(lesson.flashcards || []);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [lesson.id, lesson.flashcards]);

  const saveScore = (cardId: string, status: "remembered" | "review") => {
    setScores((prev) => {
      const next = { ...prev, [cardId]: status };
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            `${FLASHCARD_STORAGE_PREFIX}:${lesson.id}`,
            JSON.stringify(next)
          );
        } catch {
          // Ignore storage errors
        }
      }
      return next;
    });

    // Automatically transition to next card after scoring
    if (currentCardIndex < deck.length - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentCardIndex((i) => i + 1);
      }, 350);
    }
  };

  const handleShuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleResetScores = () => {
    setScores({});
    setCurrentCardIndex(0);
    setIsFlipped(false);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(`${FLASHCARD_STORAGE_PREFIX}:${lesson.id}`);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const currentCard = deck[currentCardIndex];
  const totalCards = deck.length;
  const rememberedCount = Object.values(scores).filter((s) => s === "remembered").length;
  const reviewCount = Object.values(scores).filter((s) => s === "review").length;

  return (
    <div className="space-y-6 animate-fade-in" style={{ fontSize: `${textScale}%` }}>
      {/* 1. Lower Workspace Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {totalCards > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange("flashcards")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "flashcards"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Thẻ Flashcard ({totalCards})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabChange("blueprint")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "blueprint"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            }`}
          >
            <Layers className="h-4 w-4 text-indigo-500" />
            <span>Kiến trúc & Phân tích chuyên sâu</span>
          </button>

          {/* Transcript tab on mobile screens (< lg) where the right rail is hidden */}
          {lesson.transcript && lesson.transcript.length > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange("transcript")}
              className={`lg:hidden inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "transcript"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>Transcript ({lesson.transcript.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB: INTERACTIVE FLASHCARD DECK */}
      {activeTab === "flashcards" && totalCards > 0 && currentCard && (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
          {/* Deck Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)]">
                Thẻ {currentCardIndex + 1} / {totalCards}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {isHydrated ? rememberedCount : 0} đã nhớ
                </span>
                <span className="text-[var(--border)]">|</span>
                <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                  <XCircle className="h-3.5 w-3.5" /> {isHydrated ? reviewCount : 0} cần ôn
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffleDeck}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                title="Xáo trộn thứ tự các thẻ"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Xáo trộn</span>
              </button>
              <button
                type="button"
                onClick={handleResetScores}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                title="Xóa điểm ôn tập của bài này"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Làm lại</span>
              </button>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative min-h-[300px] sm:min-h-[340px] w-full rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] p-6 sm:p-8 shadow-xl cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-2xl flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                isFlipped
                  ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}>
                {isFlipped ? "Đáp án (Answer)" : "Câu hỏi (Question)"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(isFlipped ? currentCard.answerEn : currentCard.questionEn);
                  }}
                  className="p-1.5 rounded-xl border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--muted)] hover:text-emerald-500 cursor-pointer transition-all"
                  title="Nghe phát âm tiếng Anh"
                  aria-label="Nghe phát âm tiếng Anh"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  Chạm để lật thẻ ↻
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="my-auto py-6 space-y-4">
              {!isFlipped ? (
                <>
                  <p className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                    {currentCard.questionEn}
                  </p>
                  <p className="text-base sm:text-lg font-medium text-[var(--muted-strong)]">
                    {currentCard.questionVi}
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-2xl bg-indigo-500/10 p-4 border border-indigo-500/20">
                    <p className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 leading-snug">
                      {currentCard.answerEn}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-[var(--foreground)] mt-2">
                      {currentCard.answerVi}
                    </p>
                  </div>
                  {currentCard.explanationVi && (
                    <div className="rounded-xl bg-[var(--surface)] p-3 text-xs sm:text-sm text-[var(--muted-strong)] border border-[var(--border)] leading-relaxed">
                      <span className="font-bold text-amber-500 block mb-1">
                        💡 Giải thích & Liên hệ phỏng vấn:
                      </span>
                      {currentCard.explanationVi}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Card Footer status tag */}
            <div className="flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4">
              <span>Mẹo: Luyện nhẩm câu trả lời bằng tiếng Anh trước khi lật xem</span>
              {isHydrated && scores[currentCard.id] && (
                <span className={`font-bold ${
                  scores[currentCard.id] === "remembered"
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}>
                  Trạng thái: {scores[currentCard.id] === "remembered" ? "Đã nhớ ✅" : "Cần ôn lại ⚠️"}
                </span>
              )}
            </div>
          </div>

          {/* Navigation & Assessment Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentCardIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((i) => Math.max(0, i - 1));
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Thẻ trước</span>
              </button>
              <button
                type="button"
                disabled={currentCardIndex === totalCards - 1}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((i) => Math.min(totalCards - 1, i + 1));
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <span>Thẻ tiếp theo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Self assessment buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => saveScore(currentCard.id, "review")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                <span>Cần ôn lại</span>
              </button>
              <button
                type="button"
                onClick={() => saveScore(currentCard.id, "remembered")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Đã ghi nhớ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: ARCHITECTURE & DEEP DIVE MARKDOWN */}
      {activeTab === "blueprint" && (
        <div className="space-y-6 animate-fade-in">
          <section
            aria-label="Nội dung phân tích kiến trúc bài học"
            className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6"
          >
            <MarkdownContent
              markdown={lesson.contentMarkdown}
              fullWidth
              textScale={textScale}
            />
          </section>
        </div>
      )}

      {/* 4. TAB: MOBILE TRANSCRIPT FALLBACK */}
      {activeTab === "transcript" && lesson.transcript && (
        <div className="space-y-6 animate-fade-in">
          <SpringTranscriptPanel
            transcript={lesson.transcript}
            inRail={false}
            textScale={textScale}
            currentTime={currentTime}
            onSeek={onSeek}
          />
        </div>
      )}
    </div>
  );
}
