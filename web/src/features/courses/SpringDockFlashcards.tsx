"use client";

import { useEffect, useState } from "react";
import { Volume2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { CourseFlashcard } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";

interface SpringDockFlashcardsProps {
  flashcards: CourseFlashcard[];
  textScale?: number;
  className?: string;
}

export function SpringDockFlashcards({
  flashcards,
  textScale = 100,
  className = ""
}: SpringDockFlashcardsProps) {
  // Always auto-shuffle deck on mount
  const [deck, setDeck] = useState<CourseFlashcard[]>(() => {
    return [...flashcards].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { speak, isSpeaking } = useEnglishSpeech();

  // Reset when flashcards change
  useEffect(() => {
    setDeck([...flashcards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Keyboard navigation: Space to flip, ArrowLeft/ArrowRight to navigate
  useEffect(() => {
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
        if (currentIndex < deck.length) {
          setIsFlipped(false);
          setCurrentIndex((i) => i + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, deck.length]);

  const handleRestart = () => {
    setDeck([...flashcards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const isCompleted = currentIndex >= deck.length;
  const currentCard = !isCompleted ? deck[currentIndex] : null;

  return (
    <div
      className={`relative flex flex-col h-full w-full select-none ${className}`}
      style={{ fontSize: `${textScale}%` }}
    >
      {!isCompleted && currentCard ? (
        <div
          onClick={() => setIsFlipped((prev) => !prev)}
          className="group relative flex-1 w-full cursor-pointer [perspective:1200px]"
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
          {/* Khung xoay 3D lật dọc quanh trục X */}
          <div
            className="relative w-full h-full rounded-2xl transition-transform duration-500 shadow-xs group-hover:shadow-md"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transform: isFlipped ? "rotateX(180deg)" : "rotateX(0deg)",
              transitionTimingFunction: "cubic-bezier(0.34, 1.25, 0.64, 1)",
            }}
          >
            {/* Mặt trước: CÂU HỎI */}
            <div
              aria-hidden={isFlipped}
              className="absolute inset-0 w-full h-full rounded-2xl border-2 border-emerald-500/25 group-hover:border-emerald-500/50 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] p-5 sm:p-6 flex flex-col justify-center items-center text-center overflow-hidden transition-colors"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateX(0deg)",
              }}
            >
              <div className="w-full max-w-md px-10 py-4 my-auto space-y-3">
                <p className="text-base sm:text-lg lg:text-xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                  {currentCard.questionEn}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[var(--muted-strong)] leading-relaxed">
                  {currentCard.questionVi}
                </p>
              </div>
            </div>

            {/* Mặt sau: ĐÁP ÁN (Xoay 180deg theo trục X) */}
            <div
              aria-hidden={!isFlipped}
              className="absolute inset-0 w-full h-full rounded-2xl border-2 border-emerald-500/35 group-hover:border-emerald-500/60 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] p-5 sm:p-6 flex flex-col justify-center items-center text-center overflow-hidden transition-colors"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <div className="w-full max-w-md px-10 py-4 my-auto space-y-2.5">
                <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 leading-snug">
                  {currentCard.answerEn}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-relaxed">
                  {currentCard.answerVi}
                </p>
              </div>
            </div>
          </div>

          {/* Tầng điều khiển cố định (HUD Controls - Không bị xoay theo thẻ) */}
          {/* Top-left: Card index badge */}
          <span className="absolute top-3.5 left-4 text-[11px] font-mono font-bold text-[var(--muted-strong)] z-20 pointer-events-none">
            {currentIndex + 1} / {deck.length}
          </span>

          {/* Top-right: Floating Audio Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speak(isFlipped ? currentCard.answerEn : currentCard.questionEn);
            }}
            title="Nghe phát âm tiếng Anh"
            aria-label="Nghe phát âm tiếng Anh"
            className={`absolute top-3 right-3 p-1.5 rounded-lg border transition-all cursor-pointer z-20 ${
              isSpeaking(isFlipped ? currentCard.answerEn : currentCard.questionEn)
                ? "bg-emerald-600 text-white border-emerald-600 animate-pulse"
                : "border-[var(--border)] bg-[var(--surface)]/80 text-[var(--muted-strong)] hover:text-emerald-500 hover:border-emerald-500/40"
            }`}
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {/* Left Edge: Previous Card Arrow */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              title="Thẻ trước (←)"
              aria-label="Thẻ trước"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)] hover:bg-emerald-500/20 hover:border-emerald-500 hover:text-emerald-500 transition-all cursor-pointer shadow-sm z-20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Right Edge: Next Card Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
              setCurrentIndex((i) => i + 1);
            }}
            title={currentIndex === deck.length - 1 ? "Xem kết quả (→)" : "Thẻ tiếp theo (→)"}
            aria-label="Thẻ tiếp theo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)] hover:bg-emerald-500/20 hover:border-emerald-500 hover:text-emerald-500 transition-all cursor-pointer shadow-sm z-20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* End of Deck State */
        <div className="relative flex-1 w-full rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] p-6 shadow-xs flex flex-col justify-center items-center text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight">Hoàn thành!</h3>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Làm lại</span>
          </button>
        </div>
      )}
    </div>
  );
}
