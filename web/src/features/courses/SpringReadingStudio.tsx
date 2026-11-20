"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Code2,
  Headphones,
  Terminal,
  Clock,
  Search,
  X,
  Copy,
  Check,
  Layers,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Volume2
} from "lucide-react";
import { LanguageModeToggle, type LanguageMode } from "@/components/ui/LanguageModeToggle";
import { SpringStudyMarkdown, getSpringStudySections } from "./SpringStudyMarkdown";
export { transformBilingualMarkdown } from "./SpringStudyMarkdown";
import type { CourseLesson, CourseQuizQuestion } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";

interface SpringReadingStudioProps {
  lesson: CourseLesson;
  textScale?: number;
  quizQuestions?: CourseQuizQuestion[] | null;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (seconds: number) => void;
}

/**
 * Unified Reading Workspace for all 46 lessons:
 * - video: Kiến trúc & Phân tích chuyên sâu
 * - reading: Tài liệu chuyên đề
 * - reading-audio: Bài đọc kết hợp Audio Lecture
 * - cheatsheet: Sổ tay tra cứu mã nguồn
 * - practice: Bài thực hành tình huống
 * - quiz: Kiến thức trọng tâm & Giải thích bài tập
 */
export function SpringReadingStudio({
  lesson,
  textScale = 100,
  quizQuestions
}: SpringReadingStudioProps) {
  const [langMode, setLangMode] = useState<LanguageMode>(() => {
    if (typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem("spring_reading_lang_mode");
      if (saved === "bilingual" || saved === "vi" || saved === "en") return saved;
    }
    return "bilingual";
  });

  const handleLangModeChange = (mode: LanguageMode) => {
    setLangMode(mode);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("spring_reading_lang_mode", mode);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const { speak } = useEnglishSpeech();

  const isQuiz = lesson.lessonType === "quiz";
  const hasQuizQuestions = Boolean(isQuiz && quizQuestions && quizQuestions.length > 0);

  // Interactive state for quiz questions
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (userAnswers[questionId] || revealedAnswers[questionId]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleReveal = (questionId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedAnswers({});
  };

  const totalQuestions = quizQuestions?.length || 0;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = useMemo(() => {
    if (!quizQuestions) return 0;
    return quizQuestions.filter(
      (q) => userAnswers[q.id] && q.options.find((o) => o.id === userAnswers[q.id])?.isCorrect
    ).length;
  }, [quizQuestions, userAnswers]);

  // Badge configuration based on lesson type
  const typeConfig = useMemo(() => {
    switch (lesson.lessonType) {
      case "video":
        return {
          icon: Layers,
          label: "Kiến trúc & Phân tích chuyên sâu",
          color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
        };
      case "quiz":
        return {
          icon: Award,
          label: "Kiến thức trọng tâm & Giải thích bài tập",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        };
      case "reading-audio":
        return {
          icon: Headphones,
          label: "Bài đọc kết hợp Audio Lecture",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        };
      case "cheatsheet":
        return {
          icon: Code2,
          label: "Sổ tay tra cứu mã nguồn",
          color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
        };
      case "practice":
        return {
          icon: Terminal,
          label: "Bài thực hành tình huống",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        };
      default:
        return {
          icon: BookOpen,
          label: "Tài liệu chuyên đề",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        };
    }
  }, [lesson.lessonType]);

  const Icon = typeConfig.icon;

  // Stable section anchors are generated from source headings, independent of the language view.
  const sections = useMemo(() => {
    if (hasQuizQuestions && quizQuestions) {
      return quizQuestions.map((q) => ({
        id: "quiz-q-" + q.number,
        title: "Câu " + q.number + ": " + (q.title || "Câu hỏi " + q.number)
      }));
    }
    return getSpringStudySections(lesson.contentMarkdown, langMode).slice(0, 8);
  }, [hasQuizQuestions, quizQuestions, lesson.contentMarkdown, langMode]);

  // Filter quiz questions based on search query
  const filteredQuizQuestions = useMemo(() => {
    if (!hasQuizQuestions || !quizQuestions) return [];
    if (!searchQuery.trim()) return quizQuestions;
    const q = searchQuery.toLowerCase().trim();
    return quizQuestions.filter((item) => {
      return (
        item.questionEn.toLowerCase().includes(q) ||
        item.questionVi.toLowerCase().includes(q) ||
        (item.explanationVi && item.explanationVi.toLowerCase().includes(q)) ||
        (item.explanationEn && item.explanationEn.toLowerCase().includes(q)) ||
        item.options.some((o) => o.textEn.toLowerCase().includes(q) || o.textVi.toLowerCase().includes(q))
      );
    });
  }, [hasQuizQuestions, quizQuestions, searchQuery]);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Card Wrapper */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 lg:p-10 shadow-xs space-y-6">
        {/* 1. TOP BAR: Badge + LanguageModeToggle + Quick Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          {/* Left: Type Badge & Reading Metadata */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold ${typeConfig.color}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{typeConfig.label}</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
              <Clock className="h-3 w-3 text-emerald-500" />
              <span>{lesson.durationMinutes || 15} phút đọc</span>
            </span>

            {lesson.lessonType === "video" && (
              <span className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Layers className="h-3 w-3" />
                <span>Đi kèm video bài giảng</span>
              </span>
            )}

            {lesson.audioUrl && (
              <span className="inline-flex items-center gap-1 rounded-xl border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                <Headphones className="h-3 w-3" />
                <span>Có audio bài giảng</span>
              </span>
            )}

            {hasQuizQuestions && (
              <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Award className="h-3 w-3" />
                <span>{quizQuestions?.length} câu hỏi trọng tâm</span>
              </span>
            )}
          </div>

          {/* Right: LanguageModeToggle & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Shared Language Mode Toggle */}
            <LanguageModeToggle value={langMode} onChange={handleLangModeChange} showIcon />

            {/* Quick Share / Copy Link */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-2.5 py-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
              title="Sao chép liên kết bài học"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Reminder Notice Banner (if reading has audio lecture attached) */}
        {lesson.audioUrl && (
          <div className="flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3.5 text-xs sm:text-sm text-purple-700 dark:text-purple-300">
            <Headphones className="h-5 w-5 shrink-0 text-purple-500" />
            <div className="flex-1">
              <span className="font-bold">Bài đọc có kèm file ghi âm bài giảng: </span>
              <span>Bạn có thể sử dụng trình phát âm thanh ở khung phía trên để vừa nghe vừa theo dõi văn bản bài học.</span>
            </div>
          </div>
        )}

        {/* 2. SECTION NAVIGATION PILLS (Quick Table of Contents) */}
        {sections.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
              <Layers className="h-3.5 w-3.5 text-emerald-500" />
              <span>Chuyển nhanh đến phần chính:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer truncate max-w-[260px]"
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Search Bar within Lesson */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung bài học..."
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 pl-9 pr-9 py-2 text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* 3.1 Quiz Progress & Reset Toolbar */}
        {hasQuizQuestions && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/30 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[var(--muted-strong)]">
                Tiến độ: <strong className="text-[var(--foreground)]">{answeredCount}</strong> / {totalQuestions} câu
              </span>
              {answeredCount > 0 && (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Đúng: {correctCount} / {answeredCount} ({Math.round((correctCount / answeredCount) * 100)}%)
                </span>
              )}
            </div>

            {(answeredCount > 0 || Object.keys(revealedAnswers).length > 0) && (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                title="Làm lại tất cả câu hỏi trắc nghiệm"
              >
                <RotateCcw className="h-3.5 w-3.5 text-emerald-500" />
                <span>Làm lại bài tập</span>
              </button>
            )}
          </div>
        )}

        {/* 4. MAIN READING CONTENT AREA */}
        <section
          aria-label="Nội dung phân tích kiến trúc bài học"
          className="prose dark:prose-invert max-w-none [contain:content] pt-2 space-y-6"
          style={{ fontSize: `${textScale}%` }}
        >
          {/* For Quiz lessons: render interactive questions & answer evaluation */}
          {hasQuizQuestions && (
            <div className="not-prose space-y-5">
              {filteredQuizQuestions.map((q) => {
                const selectedOptionId = userAnswers[q.id];
                const isRevealed = Boolean(selectedOptionId || revealedAnswers[q.id]);
                const isAnswered = Boolean(selectedOptionId);
                const selectedOption = isAnswered ? q.options.find((o) => o.id === selectedOptionId) : null;
                const isCorrect = selectedOption?.isCorrect ?? false;

                return (
                  <div
                    key={q.id}
                    id={`quiz-q-${q.number}`}
                    className={`rounded-2xl border transition-all p-4 sm:p-6 space-y-4 ${
                      !isRevealed
                        ? "border-[var(--border)] bg-[var(--surface-hover)]/30 hover:border-emerald-500/30"
                        : isCorrect
                        ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                        : "border-rose-500/30 bg-rose-500/[0.02]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          Câu {q.number} / {quizQuestions?.length}
                        </span>
                        {q.title && (
                          <span className="text-xs font-semibold text-[var(--muted)]">
                            {q.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Result badge after answering */}
                        {isAnswered && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold border transition-all ${
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

                        {q.questionEn && (
                          <button
                            type="button"
                            onClick={() => speak(q.questionEn)}
                            title="Nghe phát âm câu hỏi tiếng Anh"
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-semibold">Nghe</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="space-y-1.5">
                      {langMode !== "vi" && q.questionEn && (
                        <p className="text-sm sm:text-base font-bold text-[var(--foreground)] leading-relaxed">
                          {q.questionEn}
                        </p>
                      )}
                      {langMode !== "en" && q.questionVi && (
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            langMode === "bilingual"
                              ? "text-[var(--muted-strong)] italic"
                              : "text-[var(--foreground)] font-semibold"
                          }`}
                        >
                          {langMode === "bilingual" ? `🇻🇳 ${q.questionVi}` : q.questionVi}
                        </p>
                      )}
                    </div>

                    {/* Options list A, B, C, D */}
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isThisSelected = selectedOptionId === opt.id;
                        const isThisCorrect = opt.isCorrect;

                        let cardStyle =
                          "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/50 hover:bg-[var(--surface-hover)] cursor-pointer text-[var(--foreground)]";
                        let badgeStyle =
                          "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)]";

                        if (isRevealed) {
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
                            disabled={isRevealed}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`group relative flex items-start gap-3 rounded-2xl border p-3.5 sm:p-4 text-left transition-all ${cardStyle}`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all mt-0.5 ${badgeStyle}`}
                            >
                              {isRevealed && isThisSelected ? (
                                isThisCorrect ? (
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                ) : (
                                  <X className="h-3.5 w-3.5 stroke-[3]" />
                                )
                              ) : isRevealed && isThisCorrect ? (
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              ) : (
                                opt.id
                              )}
                            </span>

                            <div className="flex-1 min-w-0 space-y-0.5">
                              {langMode !== "vi" && opt.textEn && (
                                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                                  {opt.textEn}
                                </p>
                              )}
                              {langMode !== "en" && opt.textVi && (
                                <p
                                  className={`text-xs leading-relaxed ${
                                    langMode === "bilingual"
                                      ? "text-[var(--muted-strong)]"
                                      : "font-semibold"
                                  }`}
                                >
                                  {opt.textVi}
                                </p>
                              )}
                            </div>

                            {isRevealed && isThisCorrect && (
                              <span className="shrink-0 self-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Đáp án đúng
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* If not yet revealed, show button to reveal answer & explanation */}
                    {!isRevealed ? (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleReveal(q.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-strong)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Xem đáp án & giải thích</span>
                        </button>
                      </div>
                    ) : (
                      /* Explanation & Feedback block */
                      <div
                        className={`rounded-2xl border p-4 sm:p-5 transition-all animate-fade-in space-y-2 mt-2 ${
                          isCorrect
                            ? "border-emerald-500/25 bg-emerald-500/[0.04]"
                            : "border-amber-500/25 bg-amber-500/[0.04]"
                        }`}
                      >
                        {(q.feedbackEn || q.feedbackVi) && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Phản hồi:</span>
                            </span>
                            <span className="text-xs font-semibold text-[var(--foreground)]">
                              {langMode === "en"
                                ? q.feedbackEn
                                : langMode === "vi"
                                ? q.feedbackVi
                                : `${q.feedbackEn} — ${q.feedbackVi}`}
                            </span>
                          </div>
                        )}

                        {(q.explanationVi || q.explanationEn) && (
                          <div className="space-y-1 text-xs leading-relaxed text-[var(--foreground)]">
                            <div className="font-bold text-[11px] text-[var(--muted-strong)] uppercase tracking-wider">
                              Phân tích & Điểm mấu chốt:
                            </div>
                            {langMode !== "vi" && q.explanationEn && (
                              <p className="font-medium text-[var(--foreground)]">
                                {q.explanationEn}
                              </p>
                            )}
                            {langMode !== "en" && q.explanationVi && (
                              <p className="text-[var(--muted-strong)] whitespace-pre-line pt-0.5">
                                {q.explanationVi}
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
          )}

          {/* Render markdown content (for all lessons, or additional notes on quiz) */}
          {lesson.contentMarkdown && (
            <SpringStudyMarkdown markdown={lesson.contentMarkdown} mode={langMode} query={searchQuery} />
          )}
        </section>
      </div>
    </div>
  );
}
