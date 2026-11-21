"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Award,
  Sparkles,
  Check,
  X
} from "lucide-react";
import type { CourseQuizQuestion } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { LanguageModeToggle, type LanguageMode } from "@/components/ui/LanguageModeToggle";

interface SpringQuizStudioProps {
  questions: CourseQuizQuestion[];
  lessonTitle: string;
  textScale?: number;
}

export function SpringQuizStudio({
  questions,
  lessonTitle,
  textScale = 100
}: SpringQuizStudioProps) {
  const [langMode, setLangMode] = useState<LanguageMode>("bilingual");
  // Lưu lựa chọn của người dùng theo question id: { [questionId]: optionId }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const { speak, isSpeaking } = useEnglishSpeech();

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = questions.filter(
    (q) => userAnswers[q.id] && q.options.find((o) => o.id === userAnswers[q.id])?.isCorrect
  ).length;

  const handleSelectOption = (questionId: string, optionId: string) => {
    // Nếu câu này đã được trả lời rồi thì không đổi lựa chọn nữa (chấm tức thì)
    if (userAnswers[questionId]) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
  };

  const isAllAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div
      className="space-y-6 select-none animate-fade-in"
      style={{ fontSize: `${textScale}%` }}
    >
      {/* 1. Header Toolbar: Tiêu đề + Bộ lọc ngôn ngữ 3 tabs + Điểm số & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <Award className="h-3.5 w-3.5" />
              <span>Bài tập trắc nghiệm tương tác</span>
            </span>
            <span className="text-xs font-medium text-[var(--muted)]">
              {totalQuestions} câu hỏi
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[var(--foreground)] tracking-tight mt-1">
            {lessonTitle}
          </h2>
        </div>

        {/* Cụm công cụ bên phải: Tabs ngôn ngữ + Nút Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs ngôn ngữ dùng chung: Song ngữ | Tiếng Việt | Tiếng Anh */}
          <LanguageModeToggle value={langMode} onChange={setLangMode} />

          {/* Điểm số & Nút làm lại */}
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
              title="Làm lại bài trắc nghiệm từ đầu"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Làm lại</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Thanh tiến độ làm bài */}
      <div className="flex items-center justify-between text-xs text-[var(--muted-strong)] px-1">
        <span className="font-medium">
          Tiến độ: <strong className="text-[var(--foreground)]">{answeredCount}</strong> / {totalQuestions} câu
        </span>
        {answeredCount > 0 && (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Đúng: {correctCount} / {answeredCount} câu ({Math.round((correctCount / answeredCount) * 100)}%)
          </span>
        )}
      </div>

      {questions.some((q) => q.answerProvenance === "graded-evidence") && (
        <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
          Nguồn bài quiz: kết quả Coursera 100% và phản hồi “Nice work” ở từng câu; đáp án được đối chiếu với phần giải thích. Tài liệu không lưu lựa chọn đã nhấp.
        </p>
      )}
      {questions.some((q) => q.answerProvenance === "study-analysis") && (
        <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
          Một số đáp án được phân tích từ kiến thức bài học vì tài liệu chưa có phản hồi chấm riêng cho các câu đó.
        </p>
      )}

      {/* 3. Danh sách các câu hỏi trắc nghiệm */}
      <div className="space-y-6">
        {questions.map((q) => {
          const selectedOptionId = userAnswers[q.id];
          const isAnswered = Boolean(selectedOptionId);
          const selectedOption = isAnswered ? q.options.find((o) => o.id === selectedOptionId) : null;
          const isCorrect = selectedOption?.isCorrect ?? false;

          return (
            <div
              key={q.id}
              className={`rounded-3xl border transition-all p-5 sm:p-6 lg:p-7 shadow-xs space-y-4 ${
                !isAnswered
                  ? "border-[var(--border)] bg-[var(--surface)]"
                  : isCorrect
                  ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                  : "border-rose-500/30 bg-rose-500/[0.02]"
              }`}
            >
              {/* Header câu hỏi: Số thứ tự + Badge trạng thái + Nút phát âm */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-xl bg-[var(--surface-hover)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--foreground)] border border-[var(--border)]">
                    Câu {q.number}
                  </span>
                  {q.title && (
                    <span className="text-xs font-semibold text-[var(--muted-strong)] hidden sm:inline">
                      {q.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge kết quả sau khi chọn */}
                  {isAnswered && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold border transition-all animate-fade-in ${
                        isCorrect
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Chính xác (+1)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Chưa chính xác</span>
                        </>
                      )}
                    </span>
                  )}

                  {/* Nút phát âm câu hỏi tiếng Anh */}
                  {q.questionEn && (
                    <button
                      type="button"
                      onClick={() => speak(q.questionEn)}
                      title="Nghe phát âm chuẩn câu hỏi tiếng Anh"
                      aria-label="Nghe phát âm tiếng Anh câu hỏi"
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSpeaking(q.questionEn)
                          ? "bg-emerald-600 text-white border-emerald-600 animate-pulse"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:text-emerald-500 hover:border-emerald-500/30"
                      }`}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Nội dung câu hỏi theo chế độ ngôn ngữ */}
              <div className="space-y-1.5">
                {langMode === "bilingual" && (
                  <>
                    <p className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-snug">
                      {q.questionEn}
                    </p>
                    {q.questionVi && (
                      <p className="text-xs sm:text-sm font-medium text-[var(--muted-strong)] leading-relaxed">
                        {q.questionVi}
                      </p>
                    )}
                  </>
                )}
                {langMode === "en" && (
                  <p className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-snug">
                    {q.questionEn || q.questionVi}
                  </p>
                )}
                {langMode === "vi" && (
                  <p className="text-base sm:text-lg font-bold text-[var(--foreground)] leading-snug">
                    {q.questionVi || q.questionEn}
                  </p>
                )}
              </div>

              {/* Danh sách các lựa chọn A, B, C, D */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isThisSelected = selectedOptionId === opt.id;
                  const isThisCorrect = opt.isCorrect;

                  let cardStyle =
                    "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/50 hover:bg-[var(--surface-hover)] cursor-pointer text-[var(--foreground)]";
                  let badgeStyle =
                    "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)]";

                  if (isAnswered) {
                    if (isThisSelected) {
                      if (isThisCorrect) {
                        cardStyle =
                          "border-2 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs";
                        badgeStyle = "bg-emerald-500 text-white font-bold border-emerald-500";
                      } else {
                        cardStyle =
                          "border-2 border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold shadow-xs";
                        badgeStyle = "bg-rose-500 text-white font-bold border-rose-500";
                      }
                    } else if (isThisCorrect) {
                      // Nếu chọn sai, hiển thị viền xanh nhẹ cho đáp án đúng để học viên học hỏi
                      cardStyle =
                        "border-2 border-emerald-500/70 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-medium";
                      badgeStyle = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/40";
                    } else {
                      cardStyle = "opacity-40 border-[var(--border)] text-[var(--muted)] pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`group relative flex items-start gap-3 rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${cardStyle}`}
                    >
                      {/* Vòng tròn định danh lựa chọn (A, B, C, D) */}
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all mt-0.5 ${badgeStyle}`}
                      >
                        {isAnswered && isThisSelected ? (
                          isThisCorrect ? (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          ) : (
                            <X className="h-3.5 w-3.5 stroke-[3]" />
                          )
                        ) : isAnswered && isThisCorrect ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          opt.id
                        )}
                      </span>

                      {/* Nội dung lựa chọn theo chế độ ngôn ngữ */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        {langMode === "bilingual" && (
                          <>
                            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                              {opt.textEn}
                            </p>
                            {opt.textVi && (
                              <p className="text-[11px] sm:text-xs text-[var(--muted-strong)] leading-relaxed">
                                {opt.textVi}
                              </p>
                            )}
                          </>
                        )}
                        {langMode === "en" && (
                          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {opt.textEn || opt.textVi}
                          </p>
                        )}
                        {langMode === "vi" && (
                          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                            {opt.textVi || opt.textEn}
                          </p>
                        )}
                      </div>

                      {/* Nhãn phụ khi câu này là đáp án đúng */}
                      {isAnswered && isThisCorrect && !isThisSelected && (
                        <span className="shrink-0 self-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {q.answerProvenance === "study-analysis" ? "Đáp án tham khảo" : "Đáp án đúng"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Khung giải thích chi tiết & Phản hồi (Mở ra ngay khi chọn phương án) */}
              {isAnswered && (
                <div
                  className={`rounded-2xl border p-4 sm:p-5 transition-all animate-fade-in space-y-2.5 mt-3 ${
                    isCorrect
                      ? "border-emerald-500/25 bg-emerald-500/[0.04]"
                      : "border-amber-500/25 bg-amber-500/[0.04]"
                  }`}
                >
                  {/* Phản hồi Coursera */}
                  {(isAnswered && isCorrect && (q.feedbackEn || q.feedbackVi)) && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Phản hồi Coursera:</span>
                      </span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {langMode === "en" ? q.feedbackEn : langMode === "vi" ? q.feedbackVi : `${q.feedbackEn} — ${q.feedbackVi}`}
                      </span>
                    </div>
                  )}

                  {/* Phân tích giải thích chi tiết */}
                  {(q.explanationVi || q.explanationEn) && (
                    <div className="space-y-1 text-xs leading-relaxed text-[var(--foreground)]">
                      <div className="font-bold text-[11px] text-[var(--muted-strong)] uppercase tracking-wider">
                        Giải thích chi tiết:
                      </div>
                      {langMode === "bilingual" && (
                        <>
                          {q.explanationEn && (
                            <p className="font-medium text-[var(--foreground)]">
                              {q.explanationEn}
                            </p>
                          )}
                          {q.explanationVi && (
                            <p className="text-[var(--muted-strong)] whitespace-pre-line pt-0.5">
                              {q.explanationVi}
                            </p>
                          )}
                        </>
                      )}
                      {langMode === "en" && (
                        <p className="font-medium text-[var(--foreground)] whitespace-pre-line">
                          {q.explanationEn || q.explanationVi}
                        </p>
                      )}
                      {langMode === "vi" && (
                        <p className="font-medium text-[var(--foreground)] whitespace-pre-line">
                          {q.explanationVi || q.explanationEn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Tổng kết hoàn thành bài kiểm tra */}
      {isAllAnswered && (
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-[var(--surface)] to-emerald-500/5 p-6 sm:p-8 text-center space-y-3 shadow-sm animate-fade-in">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight">
            Chúc mừng bạn đã hoàn thành bài kiểm tra!
          </h3>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Kết quả của bạn: {correctCount} / {totalQuestions} câu đúng ({scorePercent}%)
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Làm lại bài thi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
