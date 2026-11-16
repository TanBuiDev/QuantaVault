"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  RotateCcw,
  Sparkles,
  Volume2
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
  filterPracticeCards,
  getPracticeCards,
  practiceScoreKey,
  useEnglishPracticeScores,
  writePracticeScores,
  type PracticeDirection,
  type PracticeKind,
  type PracticeStatus,
  type PracticeStatusFilter
} from "@/lib/courses/englishPractice";
import { useEnglishSpeech } from "@/lib/courses/speech";

function subscribeToLocation(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getRequestedLesson(): string {
  if (typeof window === "undefined") return "all";
  return new URLSearchParams(window.location.search).get("lesson") || "all";
}

export interface PracticeLessonOption {
  id: string;
  number: number;
  title: string;
  titleEn: string;
}

export function EnglishPracticeView({ lessons }: { lessons: PracticeLessonOption[] }) {
  const requestedLesson = useSyncExternalStore(subscribeToLocation, getRequestedLesson, () => "all");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const defaultLessonId = lessons.some((lesson) => lesson.id === requestedLesson) ? requestedLesson : "all";
  const lessonId = selectedLessonId ?? defaultLessonId;
  const [kind, setKind] = useState<PracticeKind>("question");
  const [direction, setDirection] = useState<PracticeDirection>("vi-en");
  const [statusFilter, setStatusFilter] = useState<PracticeStatusFilter>("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const scores = useEnglishPracticeScores();
  const { speak, stop, isSpeaking } = useEnglishSpeech();

  const allCards = useMemo(() => getPracticeCards(lessonId, kind), [lessonId, kind]);
  const filteredCards = useMemo(
    () => filterPracticeCards(allCards, direction, scores, statusFilter),
    [allCards, direction, scores, statusFilter]
  );

  const activeIndex = filteredCards.length ? Math.min(cardIndex, filteredCards.length - 1) : 0;
  const active = filteredCards[activeIndex];
  const score = active ? scores[practiceScoreKey(active.id, direction)] : undefined;

  const reviewedCount = allCards.filter((card) => Boolean(scores[practiceScoreKey(card.id, direction)])).length;
  const rememberedCount = allCards.filter(
    (card) => scores[practiceScoreKey(card.id, direction)] === "remembered"
  ).length;
  const reviewCount = reviewedCount - rememberedCount;
  const unreviewedCount = Math.max(allCards.length - reviewedCount, 0);

  const lessonName = lessons.find((lesson) => lesson.id === active?.lessonId);
  const prompt = active ? (direction === "vi-en" ? active.vi : active.en) : "";
  const reference = active ? (direction === "vi-en" ? active.en : active.vi) : "";

  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex + 1 < lessons.length ? lessons[currentLessonIndex + 1] : null;

  const resetCard = useCallback(() => {
    stop();
    setAnswer("");
    setRevealed(false);
  }, [stop]);

  const selectLesson = (value: string) => {
    setSelectedLessonId(value);
    setCardIndex(0);
    resetCard();
  };

  const selectKind = (value: string) => {
    if (value !== "question" && value !== "answer") return;
    setKind(value);
    setCardIndex(0);
    resetCard();
  };

  const selectDirection = (value: string) => {
    if (value !== "vi-en" && value !== "en-vi") return;
    setDirection(value);
    setCardIndex(0);
    resetCard();
  };

  const selectStatusFilter = (filter: PracticeStatusFilter) => {
    setStatusFilter(filter);
    setCardIndex(0);
    resetCard();
  };

  const moveTo = useCallback(
    (index: number) => {
      setCardIndex(index);
      resetCard();
    },
    [resetCard]
  );

  const mark = useCallback(
    (status: PracticeStatus) => {
      if (!active || !revealed) return;
      const next = { ...scores, [practiceScoreKey(active.id, direction)]: status };
      writePracticeScores(next);
    },
    [active, direction, revealed, scores]
  );

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. Ctrl+Enter or Cmd+Enter: Toggle reference answer (works everywhere, including inside textarea)
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        setRevealed((prev) => !prev);
        return;
      }

      // 2. Alt + P: Speak active English text (works everywhere)
      if (event.altKey && (event.key === "p" || event.key === "P")) {
        event.preventDefault();
        if (active) speak(active.en);
        return;
      }

      // 3. Alt + ArrowRight / Alt + ArrowLeft: Navigate cards (works everywhere)
      if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        if (activeIndex + 1 < filteredCards.length) moveTo(activeIndex + 1);
        return;
      }
      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        if (activeIndex > 0) moveTo(activeIndex - 1);
        return;
      }

      // If user is currently typing in an input/textarea, do not intercept regular single keys
      const target = event.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isEditing) return;

      // Single-key navigation outside textarea:
      if (event.key === "ArrowRight") {
        if (activeIndex + 1 < filteredCards.length) {
          event.preventDefault();
          moveTo(activeIndex + 1);
        }
      } else if (event.key === "ArrowLeft") {
        if (activeIndex > 0) {
          event.preventDefault();
          moveTo(activeIndex - 1);
        }
      } else if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        if (active) speak(active.en);
      } else if (revealed) {
        if (event.key === "1" || event.key === "r" || event.key === "R") {
          event.preventDefault();
          mark("review");
        } else if (event.key === "2" || event.key === "m" || event.key === "M") {
          event.preventDefault();
          mark("remembered");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, activeIndex, filteredCards.length, mark, moveTo, revealed, speak]);

  const isAtEnd = filteredCards.length > 0 && activeIndex === filteredCards.length - 1;
  const summaryAccuracy = allCards.length > 0 ? Math.round((rememberedCount / allCards.length) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 pb-10 animate-fade-in">
      <header className="space-y-4">
        <Link
          href={"/courses/english-job-interview/" + (lessonId === "all" ? "lesson-01" : lessonId)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" /> Trở về bài học
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Languages className="h-4 w-4" aria-hidden="true" /> LUYỆN TẬP TIẾNG ANH
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
              Luyện dịch hai chiều
            </h1>
            <p className="max-w-2xl text-sm text-[var(--muted-strong)]">
              Tự gõ bản dịch, nghe phát âm bản xứ, xem câu tham khảo rồi đánh giá mức độ ghi nhớ. Bản dịch bạn gõ không
              được lưu lên hệ thống.
            </p>
          </div>
          <Link
            href={"/courses/english-job-interview/" + (lessonId === "all" ? "lesson-01" : lessonId)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Chế độ học
          </Link>
        </div>
      </header>

      {/* Control panel */}
      <section
        aria-label="Thiết lập luyện tập"
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 space-y-5 shadow-xs"
      >
        <label className="block space-y-2">
          <span className="block text-xs font-bold text-[var(--foreground)]">Phạm vi bài học</span>
          <select
            aria-label="Chọn bài luyện tập"
            value={lessonId}
            onChange={(event) => selectLesson(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả 18 bài học ({allCards.length} thẻ)</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {"Bài " + String(lesson.number).padStart(2, "0") + ": " + lesson.titleEn}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[var(--foreground)]">Luyện nội dung</span>
            <SegmentedToggle
              label="Loại bài tập"
              value={kind}
              onChange={selectKind}
              options={[
                { value: "question", label: "Câu hỏi" },
                { value: "answer", label: "Mẫu trả lời" }
              ]}
            />
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[var(--foreground)]">Hướng dịch</span>
            <SegmentedToggle
              label="Hướng dịch"
              value={direction}
              onChange={selectDirection}
              options={[
                { value: "vi-en", label: "Việt → Anh" },
                { value: "en-vi", label: "Anh → Việt" }
              ]}
            />
          </div>
        </div>

        {/* Smart Status Filter */}
        <div className="space-y-2">
          <span className="block text-xs font-bold text-[var(--foreground)]">Lọc theo trạng thái</span>
          <div role="tablist" aria-label="Bộ lọc trạng thái ghi nhớ" className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tất cả", count: allCards.length },
              { id: "review", label: "Cần ôn", count: reviewCount },
              { id: "remembered", label: "Đã nhớ", count: rememberedCount },
              { id: "unreviewed", label: "Chưa làm", count: unreviewedCount }
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => selectStatusFilter(tab.id as PracticeStatusFilter)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-[var(--surface-hover)] text-[var(--muted)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar & Counters */}
        <div className="space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--muted-strong)]">
            <span>
              Tiến độ bài học:{" "}
              <strong className="text-[var(--foreground)]">
                {reviewedCount}/{allCards.length}
              </strong>
            </span>
            <span>
              Đã nhớ {rememberedCount} · Cần ôn {reviewCount} · Chưa làm {unreviewedCount}
            </span>
          </div>
          <ProgressBar value={reviewedCount} max={Math.max(allCards.length, 1)} />
        </div>
      </section>

      {/* Practice card */}
      {active ? (
        <section
          aria-label="Thẻ luyện tập"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-xs space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {"Thẻ " + (activeIndex + 1) + "/" + filteredCards.length}
              </span>
              {statusFilter !== "all" && (
                <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  {statusFilter === "review" ? "Cần ôn" : statusFilter === "remembered" ? "Đã nhớ" : "Chưa làm"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => speak(active.en)}
                title="Nghe câu tiếng Anh chuẩn bản xứ (P hoặc Alt+P)"
                aria-label="Nghe phát âm câu tiếng Anh"
                className={`inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold transition-all ${
                  isSpeaking(active.en)
                    ? "bg-indigo-600 text-white animate-pulse"
                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{isSpeaking(active.en) ? "Đang đọc..." : "Nghe tiếng Anh"}</span>
                <kbd className="hidden sm:inline-block text-[9px] font-mono opacity-70">P</kbd>
              </button>
              <span>{lessonName ? lessonName.title : "Bài học"}</span>
            </div>
          </div>

          {kind === "answer" && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 p-3 text-xs text-[var(--muted-strong)]">
              <span className="font-semibold">{"Ngữ cảnh câu hỏi · Mẫu " + active.sampleNumber + ": "}</span>
              {direction === "vi-en" ? active.questionVi : active.questionEn}
            </div>
          )}

          <div className="rounded-xl bg-indigo-500/5 p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                {direction === "vi-en" ? "Dịch sang tiếng Anh" : "Dịch sang tiếng Việt"}
              </span>
              {direction === "en-vi" && (
                <button
                  type="button"
                  onClick={() => speak(prompt)}
                  title="Nghe phát âm câu tiếng Anh"
                  aria-label="Nghe phát âm câu hỏi tiếng Anh"
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                    isSpeaking(prompt)
                      ? "bg-indigo-600 text-white animate-pulse"
                      : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isSpeaking(prompt) ? "Đang đọc..." : "Nghe câu hỏi"}</span>
                </button>
              )}
            </div>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-[var(--foreground)]">{prompt}</p>
          </div>

          <label className="block space-y-2">
            <span className="block text-xs font-bold text-[var(--foreground)]">Bản dịch của bạn</span>
            <textarea
              aria-label="Bản dịch của bạn"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={5}
              maxLength={6000}
              placeholder={direction === "vi-en" ? "Gõ tiếng Anh từ trí nhớ..." : "Gõ tiếng Việt từ trí nhớ..."}
              className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm leading-7 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <button
            type="button"
            aria-expanded={revealed}
            aria-label={revealed ? "Ẩn bản dịch tham khảo" : "Hiện bản dịch tham khảo"}
            onClick={() => setRevealed(!revealed)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{revealed ? "Ẩn bản dịch tham khảo" : "Hiện bản dịch tham khảo"}</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono rounded bg-indigo-500/20 px-1.5 py-0.5 ml-1 border border-indigo-500/30">
              Ctrl + ↵
            </kbd>
          </button>

          {revealed && (
            <div
              className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4"
              aria-live="polite"
            >
              <div className="flex items-center justify-between">
                <span className="block text-xs font-bold text-[var(--foreground)]">Bản dịch tham khảo</span>
                {direction === "vi-en" && (
                  <button
                    type="button"
                    onClick={() => speak(reference)}
                    title="Nghe phát âm chuẩn bản xứ (P hoặc Alt+P)"
                    aria-label="Nghe phát âm bản dịch tham khảo"
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
                      isSpeaking(reference)
                        ? "bg-indigo-600 text-white animate-pulse"
                        : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>{isSpeaking(reference) ? "Đang đọc..." : "Nghe phát âm"}</span>
                    <kbd className="hidden sm:inline-block text-[9px] font-mono opacity-70 ml-0.5">P</kbd>
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted-strong)]">{reference}</p>
              <p className="text-xs text-[var(--muted)]">
                Không cần giống từng chữ; hãy so sánh ý nghĩa, ngữ pháp và cách diễn đạt.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  aria-label="Đã nhớ"
                  onClick={() => mark("remembered")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã nhớ</span>
                  <kbd className="text-[10px] font-mono rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 ml-0.5">
                    2
                  </kbd>
                </button>
                <button
                  type="button"
                  aria-label="Cần ôn"
                  onClick={() => mark("review")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Cần ôn</span>
                  <kbd className="text-[10px] font-mono rounded bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.2 ml-0.5">
                    1
                  </kbd>
                </button>
                {score && (
                  <span role="status" className="self-center text-xs text-[var(--muted)]">
                    {"Đã đánh dấu: " + (score === "remembered" ? "Đã nhớ" : "Cần ôn")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-4">
            <button
              type="button"
              aria-label="Thẻ trước"
              disabled={activeIndex === 0}
              onClick={() => moveTo(activeIndex - 1)}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="mr-1 inline h-4 w-4" /> Thẻ trước
              <kbd className="hidden sm:inline-block text-[10px] font-mono opacity-50 ml-1">←</kbd>
            </button>
            {activeIndex + 1 < filteredCards.length ? (
              <button
                type="button"
                aria-label="Thẻ tiếp"
                onClick={() => moveTo(activeIndex + 1)}
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition-all"
              >
                Thẻ tiếp <ArrowRight className="ml-1 inline h-4 w-4" />
                <kbd className="hidden sm:inline-block text-[10px] font-mono opacity-70 ml-1">→</kbd>
              </button>
            ) : (
              <span className="self-center text-xs font-medium text-[var(--muted-strong)]">Bạn đang ở thẻ cuối.</span>
            )}
          </div>

          {/* Session Summary Card displayed at the end */}
          {isAtEnd && score && (
            <div
              role="region"
              aria-label="Tổng kết buổi luyện tập"
              className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-5 sm:p-6 shadow-sm space-y-4 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-4 w-4" /> Tổng kết buổi luyện tập
                  </div>
                  <h3 className="text-lg font-black text-[var(--foreground)] sm:text-xl">
                    {summaryAccuracy >= 80
                      ? "🎉 Xuất sắc! Bạn đã làm chủ bài này!"
                      : summaryAccuracy >= 50
                      ? "👍 Khá tốt! Đang tiến bộ vững chắc!"
                      : "💪 Cố lên! Hãy tiếp tục rèn luyện!"}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{summaryAccuracy}%</span>
                  <span className="text-[11px] font-medium text-[var(--muted)]">Tỷ lệ nhớ</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed">
                {summaryAccuracy >= 80
                  ? "Bạn đã ghi nhớ hầu hết các mẫu câu hỏi và câu trả lời. Phản xạ tiếng Anh phỏng vấn của bạn đã rất tự nhiên!"
                  : summaryAccuracy >= 50
                  ? "Bạn đã nhớ được hơn một nửa số câu. Hãy dành ít phút luyện lại các câu 'Cần ôn' để khắc sâu phản xạ."
                  : "Đừng lo lắng! Hãy nghe lại phát âm bản xứ, đối chiếu kỹ ngữ pháp và thử dịch lại vài lần để ghi nhớ sâu hơn."}
              </p>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 text-center">
                  <span className="block text-[11px] text-[var(--muted)] font-medium">Tổng số thẻ</span>
                  <span className="text-base font-bold text-[var(--foreground)]">{allCards.length}</span>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center">
                  <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Đã nhớ</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{rememberedCount}</span>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-center">
                  <span className="block text-[11px] text-amber-600 dark:text-amber-400 font-medium">Cần ôn</span>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400">{reviewCount}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
                {reviewCount > 0 && statusFilter !== "review" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("review");
                      setCardIndex(0);
                      resetCard();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Luyện lại {reviewCount} câu cần ôn
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setCardIndex(0);
                    resetCard();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                >
                  Luyện lại từ đầu
                </button>

                {nextLesson && (
                  <button
                    type="button"
                    onClick={() => selectLesson(nextLesson.id)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
                  >
                    Sang bài tiếp: Bài {String(nextLesson.number).padStart(2, "0")} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Keyboard Shortcuts Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted)] pt-3 border-t border-[var(--border)]/50">
            <span className="font-medium text-[var(--muted-strong)]">⌨️ Phím tắt:</span>
            <span>
              <kbd className="font-mono bg-[var(--surface-hover)] px-1 py-0.5 rounded border border-[var(--border)]">
                Ctrl+Enter
              </kbd>{" "}
              Đáp án
            </span>
            <span>
              <kbd className="font-mono bg-[var(--surface-hover)] px-1 py-0.5 rounded border border-[var(--border)]">
                1
              </kbd>{" "}
              Cần ôn
            </span>
            <span>
              <kbd className="font-mono bg-[var(--surface-hover)] px-1 py-0.5 rounded border border-[var(--border)]">
                2
              </kbd>{" "}
              Đã nhớ
            </span>
            <span>
              <kbd className="font-mono bg-[var(--surface-hover)] px-1 py-0.5 rounded border border-[var(--border)]">
                P
              </kbd>{" "}
              Phát âm
            </span>
            <span>
              <kbd className="font-mono bg-[var(--surface-hover)] px-1 py-0.5 rounded border border-[var(--border)]">
                ← / →
              </kbd>{" "}
              Đổi thẻ
            </span>
          </div>
        </section>
      ) : allCards.length > 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted-strong)] space-y-4 shadow-xs"
        >
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Không có thẻ nào trong mục &ldquo;
              {statusFilter === "review" ? "Cần ôn" : statusFilter === "remembered" ? "Đã nhớ" : "Chưa làm"}&rdquo;
            </h3>
          </div>
          <p className="text-xs text-[var(--muted-strong)]">
            {statusFilter === "review"
              ? "Tuyệt vời! Hiện tại bạn không có câu nào bị đánh dấu Cần ôn trong phần này."
              : statusFilter === "unreviewed"
              ? "Bạn đã tự đánh giá hết toàn bộ các câu trong phần này rồi!"
              : "Bạn chưa đánh dấu câu nào là Đã nhớ trong phần này."}
          </p>
          <button
            type="button"
            onClick={() => selectStatusFilter("all")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            Xem tất cả ({allCards.length} thẻ)
          </button>
        </div>
      ) : (
        <div
          role="status"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted-strong)] space-y-4"
        >
          <p>Phần này chưa có mẫu trả lời để luyện. Bạn vẫn có thể luyện dịch câu hỏi song ngữ.</p>
          <button
            type="button"
            onClick={() => selectKind("question")}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white"
          >
            Chuyển sang luyện câu hỏi
          </button>
        </div>
      )}
    </main>
  );
}
