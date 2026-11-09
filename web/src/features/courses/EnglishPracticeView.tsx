"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Eye, EyeOff, Languages, RotateCcw } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import {
  getPracticeCards,
  practiceScoreKey,
  useEnglishPracticeScores,
  writePracticeScores,
  type PracticeDirection,
  type PracticeKind,
  type PracticeStatus
} from "@/lib/courses/englishPractice";

interface PracticeLessonOption {
  id: string;
  number: number;
  title: string;
  titleEn: string;
}

export function EnglishPracticeView({ lessons }: { lessons: PracticeLessonOption[] }) {
  const [lessonId, setLessonId] = useState("all");
  const [kind, setKind] = useState<PracticeKind>("question");
  const [direction, setDirection] = useState<PracticeDirection>("vi-en");
  const [cardIndex, setCardIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const scores = useEnglishPracticeScores();

  const cards = useMemo(() => getPracticeCards(lessonId, kind), [lessonId, kind]);
  const activeIndex = cards.length ? Math.min(cardIndex, cards.length - 1) : 0;
  const active = cards[activeIndex];
  const score = active ? scores[practiceScoreKey(active.id, direction)] : undefined;
  const reviewedCount = cards.filter((card) => Boolean(scores[practiceScoreKey(card.id, direction)])).length;
  const rememberedCount = cards.filter((card) => scores[practiceScoreKey(card.id, direction)] === "remembered").length;
  const reviewCount = reviewedCount - rememberedCount;
  const lessonName = lessons.find((lesson) => lesson.id === active?.lessonId);
  const prompt = active ? (direction === "vi-en" ? active.vi : active.en) : "";
  const reference = active ? (direction === "vi-en" ? active.en : active.vi) : "";

  const resetCard = () => {
    setAnswer("");
    setRevealed(false);
  };

  const selectLesson = (value: string) => {
    setLessonId(value);
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

  const moveTo = (index: number) => {
    setCardIndex(index);
    resetCard();
  };

  const mark = (status: PracticeStatus) => {
    if (!active || !revealed) return;
    const next = { ...scores, [practiceScoreKey(active.id, direction)]: status };
    writePracticeScores(next);
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 pb-10 animate-fade-in">
      <header className="space-y-4">
        <Link href={"/courses/english-job-interview/" + (lessonId === "all" ? "lesson-01" : lessonId)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)]">
          <ArrowLeft className="h-4 w-4" /> Trở về bài học
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Languages className="h-4 w-4" aria-hidden="true" /> LUYỆN TẬP TIẾNG ANH
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">Luyện dịch hai chiều</h1>
            <p className="max-w-2xl text-sm text-[var(--muted-strong)]">
              Tự gõ bản dịch, xem câu tham khảo rồi đánh giá mức độ ghi nhớ. Bản dịch bạn gõ không được lưu lên hệ thống.
            </p>
          </div>
          <Link href="/courses/english-job-interview/lesson-01"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Chế độ học
          </Link>
        </div>
      </header>

      <section aria-label="Thiết lập luyện tập" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 space-y-5 shadow-xs">
        <label className="block space-y-2">
          <span className="block text-xs font-bold text-[var(--foreground)]">Phạm vi bài học</span>
          <select
            aria-label="Chọn bài luyện tập"
            value={lessonId}
            onChange={(event) => selectLesson(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả 18 bài học</option>
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
            <SegmentedToggle label="Loại bài tập" value={kind} onChange={selectKind} options={[
              { value: "question", label: "Câu hỏi" },
              { value: "answer", label: "Mẫu trả lời" }
            ]} />
          </div>
          <div className="space-y-2">
            <span className="block text-xs font-bold text-[var(--foreground)]">Hướng dịch</span>
            <SegmentedToggle label="Hướng dịch" value={direction} onChange={selectDirection} options={[
              { value: "vi-en", label: "Việt → Anh" },
              { value: "en-vi", label: "Anh → Việt" }
            ]} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-[var(--muted-strong)]">
            <span>Đã tự đánh giá: <strong className="text-[var(--foreground)]">{reviewedCount}/{cards.length}</strong></span>
            <span>Đã nhớ {rememberedCount} · Cần ôn {reviewCount}</span>
          </div>
          <ProgressBar value={reviewedCount} max={Math.max(cards.length, 1)} />
        </div>
      </section>

      {active ? (
        <section aria-label="Thẻ luyện tập" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {"Thẻ " + (activeIndex + 1) + "/" + cards.length}
            </span>
            <span>{lessonName ? lessonName.title : "Bài học"}</span>
          </div>
          {kind === "answer" && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 p-3 text-xs text-[var(--muted-strong)]">
              <span className="font-semibold">{"Ngữ cảnh câu hỏi · Mẫu " + active.sampleNumber + ": "}</span>
              {direction === "vi-en" ? active.questionVi : active.questionEn}
            </div>
          )}
          <div className="rounded-xl bg-indigo-500/5 p-4 sm:p-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {direction === "vi-en" ? "Dịch sang tiếng Anh" : "Dịch sang tiếng Việt"}
            </span>
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
            onClick={() => setRevealed(!revealed)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {revealed ? "Ẩn bản dịch tham khảo" : "Hiện bản dịch tham khảo"}
          </button>
          {revealed && (
            <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4" aria-live="polite">
              <span className="block text-xs font-bold text-[var(--foreground)]">Bản dịch tham khảo</span>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--muted-strong)]">{reference}</p>
              <p className="text-xs text-[var(--muted)]">Không cần giống từng chữ; hãy so sánh ý nghĩa, ngữ pháp và cách diễn đạt.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" onClick={() => mark("remembered")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4" /> Đã nhớ
                </button>
                <button type="button" onClick={() => mark("review")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
                  <RotateCcw className="h-4 w-4" /> Cần ôn
                </button>
                {score && <span role="status" className="self-center text-xs text-[var(--muted)]">{"Đã đánh dấu: " + (score === "remembered" ? "Đã nhớ" : "Cần ôn")}</span>}
              </div>
            </div>
          )}
          <div className="flex justify-between gap-3 border-t border-[var(--border)] pt-4">
            <button type="button" disabled={activeIndex === 0} onClick={() => moveTo(activeIndex - 1)}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-40">
              <ArrowLeft className="mr-1 inline h-4 w-4" /> Thẻ trước
            </button>
            {activeIndex + 1 < cards.length ? (
              <button type="button" onClick={() => moveTo(activeIndex + 1)}
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white hover:brightness-110">
                Thẻ tiếp <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            ) : (
              <span className="self-center text-xs font-medium text-[var(--muted-strong)]">Bạn đang ở thẻ cuối.</span>
            )}
          </div>
        </section>
      ) : (
        <div role="status" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted-strong)] space-y-4">
          <p>Phần này chưa có mẫu trả lời để luyện. Bạn vẫn có thể luyện dịch câu hỏi song ngữ.</p>
          <button type="button" onClick={() => selectKind("question")}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">Chuyển sang luyện câu hỏi</button>
        </div>
      )}
    </main>
  );
}
