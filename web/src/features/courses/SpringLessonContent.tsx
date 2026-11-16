"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Video,
  Layers,
  Sparkles,
  Volume2,
  Copy,
  Check,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Flame,
  Lightbulb
} from "lucide-react";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import type { CourseLesson, CourseManifest, CourseFlashcard } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { getUrlParams, updateUrlParams } from "@/lib/utils/urlParams";

interface SpringLessonContentProps {
  course: CourseManifest;
  lesson: CourseLesson;
  textScale?: number;
}

type SpringTabMode = "video" | "flashcards" | "blueprint";
type TranscriptFilterMode = "bilingual" | "vi-only" | "en-only";

const FLASHCARD_STORAGE_PREFIX = "quantavault-spring-flashcards:v1";

export function SpringLessonContent({
  course,
  lesson,
  textScale = 100
}: SpringLessonContentProps) {
  // 1. Tab state synchronized with URL search params (Tier 1 state persistence)
  const [activeTab, setActiveTab] = useState<SpringTabMode>(() => {
    if (typeof window !== "undefined") {
      const paramTab = getUrlParams().get("tab");
      if (paramTab === "flashcards" || paramTab === "blueprint" || paramTab === "video") {
        return paramTab;
      }
    }
    return "video";
  });

  const handleTabChange = (tab: SpringTabMode) => {
    setActiveTab(tab);
    updateUrlParams({ tab }, { tab: "video" });
  };

  // 2. Transcript tools
  const [transcriptFilter, setTranscriptFilter] = useState<TranscriptFilterMode>("bilingual");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);
  const { speak, isSpeaking } = useEnglishSpeech();

  const handleCopyText = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(text);
      setCopiedSentenceId(id);
      setTimeout(() => setCopiedSentenceId((cur) => (cur === id ? null : cur)), 2000);
    }
  };

  const filteredTranscript = useMemo(() => {
    if (!lesson.transcript) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return lesson.transcript;
    return lesson.transcript.filter(
      (s) => s.en.toLowerCase().includes(q) || s.vi.toLowerCase().includes(q)
    );
  }, [lesson.transcript, searchQuery]);

  // 3. Flashcards state & deck management
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
    <div className="space-y-8 animate-fade-in" style={{ fontSize: `${textScale}%` }}>
      {/* 1. Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleTabChange("video")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "video"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            }`}
          >
            <Video className="h-4 w-4 text-emerald-500" />
            <span>Bài giảng & Transcript</span>
          </button>

          {totalCards > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange("flashcards")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "blueprint"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            }`}
          >
            <Layers className="h-4 w-4 text-indigo-500" />
            <span>Kiến trúc & Phân tích chuyên sâu</span>
          </button>
        </div>

        {lesson.videoId && (
          <a
            href={`https://youtu.be/${lesson.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-emerald-500 transition-colors"
          >
            <span>Mở trên YouTube</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* 2. TAB 1: VIDEO & INTERACTIVE TRANSCRIPT */}
      {activeTab === "video" && (
        <div className="space-y-8 animate-fade-in">
          {/* Responsive YouTube Player */}
          {lesson.videoId ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-black shadow-xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
              Chưa có video bài giảng trực tuyến.
            </div>
          )}

          {/* Interactive Transcript Toolbar */}
          {lesson.transcript && lesson.transcript.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-2xs">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    Transcript Song Ngữ Anh – Việt ({filteredTranscript.length} câu)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Mode switcher */}
                  <div className="flex rounded-xl bg-[var(--surface-hover)] p-0.5 border border-[var(--border)] text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setTranscriptFilter("bilingual")}
                      className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                        transcriptFilter === "bilingual"
                          ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Song ngữ
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranscriptFilter("vi-only")}
                      className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                        transcriptFilter === "vi-only"
                          ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Chỉ Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranscriptFilter("en-only")}
                      className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                        transcriptFilter === "en-only"
                          ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      Chỉ Tiếng Anh
                    </button>
                  </div>

                  {/* Search box */}
                  <div className="relative min-w-[160px] sm:min-w-[200px]">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="text"
                      placeholder="Tìm trong bài..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sentences List */}
              <div className="space-y-3">
                {filteredTranscript.map((sent, idx) => (
                  <div
                    key={sent.id || idx}
                    className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-emerald-500/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="space-y-2 min-w-0 flex-1">
                          {transcriptFilter !== "vi-only" && (
                            <p className="text-sm font-semibold text-[var(--foreground)] leading-relaxed">
                              {sent.en}
                            </p>
                          )}
                          {transcriptFilter !== "en-only" && (
                            <p className="text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed">
                              {sent.vi}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quick action tools */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => speak(sent.en)}
                          className={`p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] cursor-pointer transition-all ${
                            isSpeaking(sent.en) ? "text-emerald-500 animate-pulse bg-emerald-500/10" : "text-[var(--muted)] hover:text-emerald-500"
                          }`}
                          title="Nghe phát âm chuẩn tiếng Anh"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`${sent.en}\n${sent.vi}`, sent.id)}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                          title="Sao chép câu song ngữ"
                        >
                          {copiedSentenceId === sent.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 2: INTERACTIVE FLASHCARD DECK */}
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

      {/* 4. TAB 3: ARCHITECTURE & DEEP DIVE MARKDOWN */}
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
    </div>
  );
}
