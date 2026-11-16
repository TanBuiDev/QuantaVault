"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Volume2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Languages,
  Sparkles,
  HelpCircle,
  Info,
  CheckCircle2
} from "lucide-react";
import { practiceQuestions } from "@/lib/courses/englishPractice";
import type { PracticeQuestion, PracticeAnswer } from "@/lib/courses/englishPractice";
import { useEnglishSpeech } from "@/lib/courses/speech";

export type BilingualDisplayMode = "bilingual" | "mask-vi" | "en-only";

interface EnglishLessonContentProps {
  lessonId: string;
  textScale?: number;
  fallbackMarkdown?: string;
}

export function EnglishLessonContent({
  lessonId,
  textScale = 100,
}: EnglishLessonContentProps) {
  const [displayMode, setDisplayMode] = useState<BilingualDisplayMode>("bilingual");
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { speak, isSpeaking } = useEnglishSpeech();

  const questions: PracticeQuestion[] = useMemo(() => {
    return practiceQuestions.filter((q) => q.lessonId === lessonId);
  }, [lessonId]);

  const handleCopy = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToQuestion = (id: string) => {
    if (typeof window !== "undefined") {
      const el = document.getElementById(`question-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-sm font-semibold text-[var(--muted)]">
          Đang tải dữ liệu bài học tiếng Anh...
        </p>
      </div>
    );
  }

  // Base font sizing scaled with textScale
  const questionEnSize = textScale > 100 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl";
  const answerEnSize = textScale > 100 ? "text-base sm:text-lg" : "text-sm sm:text-base";

  return (
    <div className="space-y-8 animate-fade-in" style={{ fontSize: `${textScale}%` }}>
      {/* 1. Interactive Control Toolbar */}
      <section
        aria-label="Thanh công cụ chế độ học"
        className="rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-2xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] tracking-tight">
                {questions.length} câu hỏi phỏng vấn thực chiến
              </h2>
              <p className="text-xs text-[var(--muted-strong)]">
                Lắng nghe phát âm bản xứ, đối chiếu song ngữ và học các hướng trả lời mẫu.
              </p>
            </div>
          </div>

          {/* Bilingual View Mode Selector */}
          <div
            role="group"
            aria-label="Chế độ hiển thị song ngữ"
            className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-1 shrink-0 self-start sm:self-auto"
          >
            <button
              type="button"
              onClick={() => setDisplayMode("bilingual")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                displayMode === "bilingual"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)]"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Hiển thị cả tiếng Anh và tiếng Việt"
            >
              <Languages className="h-3.5 w-3.5 text-indigo-500" />
              <span>Song ngữ</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("mask-vi")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                displayMode === "mask-vi"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)]"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Ẩn bản dịch tiếng Việt để tự dịch trước, nhấp để mở"
            >
              <EyeOff className="h-3.5 w-3.5 text-amber-500" />
              <span>Ẩn bản dịch</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayMode("en-only")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                displayMode === "en-only"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)]"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Chỉ hiển thị tiếng Anh thuần túy"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chỉ tiếng Anh</span>
            </button>
          </div>
        </div>

        {/* Quick Question Jump Chips */}
        <div className="pt-2 border-t border-[var(--border)]/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="shrink-0 font-semibold text-[var(--muted)]">Nhảy nhanh câu:</span>
            {questions.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => scrollToQuestion(q.id)}
                className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--muted-strong)] hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                title={`Cuộn đến Câu ${idx + 1}`}
              >
                #{String(idx + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. List of Structured Interview Questions */}
      <div className="space-y-6 sm:space-y-8">
        {questions.map((q, qIndex) => {
          const isQSpeaking = isSpeaking(q.questionEn);
          const isQCopied = copiedId === q.id;
          const isQRevealed = revealedItems[q.id] || displayMode === "bilingual";
          const showViQuestion = displayMode !== "en-only" && isQRevealed;

          return (
            <article
              key={q.id}
              id={`question-${q.id}`}
              className="scroll-mt-20 rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7 shadow-xs hover:border-indigo-500/30 transition-all space-y-6"
            >
              {/* Question Header Card */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/15 font-black text-xs text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                      {String(qIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Câu hỏi phỏng vấn</span>
                    </span>
                  </div>

                  {/* Actions Bar for Question */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Speak question */}
                    <button
                      type="button"
                      onClick={() => speak(q.questionEn)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isQSpeaking
                          ? "bg-indigo-600 text-white animate-pulse shadow-xs"
                          : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)] hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                      title="Nghe phát âm chuẩn tiếng Anh"
                      aria-label={`Nghe câu hỏi ${qIndex + 1}`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Phát âm</span>
                    </button>

                    {/* Copy question */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${q.questionEn}\n(Tiếng Việt: ${q.questionVi})`,
                          q.id
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-all cursor-pointer"
                      title="Sao chép câu hỏi"
                      aria-label={`Sao chép câu hỏi ${qIndex + 1}`}
                    >
                      {isQCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Sao chép</span>
                        </>
                      )}
                    </button>

                    {/* Quick Practice Link */}
                    <Link
                      href={`/courses/english-job-interview/practice?lesson=${lessonId}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all"
                      title="Mở trong phòng luyện dịch phản xạ"
                    >
                      <Languages className="h-3.5 w-3.5" />
                      <span className="hidden md:inline">Luyện tập</span>
                    </Link>
                  </div>
                </div>

                {/* Primary English Question Headline */}
                <h3 className={`${questionEnSize} font-bold text-[var(--foreground)] tracking-tight leading-snug`}>
                  {q.questionEn}
                </h3>

                {/* Question Vietnamese Translation */}
                {displayMode === "mask-vi" && !isQRevealed && (
                  <button
                    type="button"
                    onClick={() => toggleReveal(q.id)}
                    aria-label={`Mở bản dịch câu hỏi ${qIndex + 1}`}
                    className="flex items-center gap-2 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer w-full text-left"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Nhấp để mở bản dịch tiếng Việt câu hỏi này</span>
                  </button>
                )}

                {showViQuestion && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3 sm:p-3.5 text-sm sm:text-base text-[var(--muted-strong)] leading-relaxed">
                    <span className="shrink-0 rounded-md bg-indigo-500/15 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      Tiếng Việt
                    </span>
                    <p className="font-medium text-[var(--foreground)]">{q.questionVi}</p>
                  </div>
                )}
              </div>

              {/* Sample Answers Section */}
              <div className="pt-4 border-t border-[var(--border)]/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                      {q.answers.length > 0
                        ? `Các cách trả lời mẫu (${q.answers.length} mẫu tham khảo)`
                        : "Câu hỏi tình huống mở"}
                    </h4>
                  </div>
                </div>

                {/* Empty Answers Note (e.g. Question 117 or Section II questions) */}
                {q.answers.length === 0 && (
                  <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-hover)]/40 p-4 text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed">
                    <Info className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--foreground)] font-semibold mb-0.5">
                        Câu hỏi không có mẫu cố định
                      </strong>
                      Tài liệu gốc thiết kế câu này dưới dạng câu hỏi mở hoặc câu hỏi ứng viên chủ động hỏi nhà tuyển dụng. Bạn hãy chuẩn bị câu trả lời phù hợp với chuyên môn và ngữ cảnh thực tế của mình.
                    </div>
                  </div>
                )}

                {/* Structured Answers Grid */}
                {q.answers.length > 0 && (
                  <div className="grid grid-cols-1 gap-3.5">
                    {q.answers.map((ans: PracticeAnswer, ansIdx: number) => {
                      const isAnsSpeaking = isSpeaking(ans.en);
                      const isAnsCopied = copiedId === ans.id;
                      const isAnsRevealed =
                        revealedItems[ans.id] || displayMode === "bilingual";
                      const showViAns = displayMode !== "en-only" && isAnsRevealed;

                      return (
                        <div
                          key={ans.id}
                          className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 hover:border-indigo-500/30 hover:bg-[var(--surface-hover)]/70 p-4 sm:p-5 transition-all space-y-3"
                        >
                          {/* Sample Answer Top Bar */}
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)]/60 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                Mẫu trả lời {ansIdx + 1}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Audio Speak */}
                              <button
                                type="button"
                                onClick={() => speak(ans.en)}
                                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                  isAnsSpeaking
                                    ? "bg-indigo-600 text-white animate-pulse"
                                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                                }`}
                                title="Nghe phát âm mẫu này"
                                aria-label={`Nghe mẫu ${ansIdx + 1}`}
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-[11px]">Nghe</span>
                              </button>

                              {/* Copy */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    `${ans.en}\n(Bản dịch: ${ans.vi})`,
                                    ans.id
                                  )
                                }
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all cursor-pointer"
                                title="Sao chép mẫu trả lời"
                                aria-label={`Sao chép mẫu ${ansIdx + 1}`}
                              >
                                {isAnsCopied ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* English Sample Text */}
                          <p className={`${answerEnSize} font-medium text-[var(--foreground)] leading-relaxed select-text`}>
                            {ans.en}
                          </p>

                          {/* Vietnamese Translation Toggle / Content */}
                          {displayMode === "mask-vi" && !isAnsRevealed && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(ans.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-strong)] hover:border-amber-500/50 hover:text-amber-600 transition-all cursor-pointer"
                            >
                              <Eye className="h-3 w-3 text-amber-500" />
                              <span>Xem bản dịch tiếng Việt</span>
                            </button>
                          )}

                          {showViAns && (
                            <div className="rounded-xl border border-[var(--border)]/70 bg-[var(--surface)] p-3 text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed shadow-2xs">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                                Bản dịch tham khảo:
                              </span>
                              <p className="leading-relaxed">{ans.vi}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
