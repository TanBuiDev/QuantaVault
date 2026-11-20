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
  Sparkles,
  Volume2
} from "lucide-react";
import { LanguageModeToggle, type LanguageMode } from "@/components/ui/LanguageModeToggle";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
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
 * Transforms raw bilingual markdown into tailored presentation based on the selected LanguageMode:
 * - "vi": Filters out EN lines, strips VI markers, produces 100% fluent Vietnamese reading text.
 * - "en": Filters out VI lines, strips EN markers, produces 100% original English reading text.
 * - "bilingual": Elegantly formats EN and VI pairs into card-like blockquotes, removes noisy '---' dividers.
 */
export function transformBilingualMarkdown(raw: string, mode: LanguageMode): string {
  if (!raw) return "";

  // 1. Temporarily isolate code blocks to avoid regex corruption
  const codeBlocks: string[] = [];
  let text = raw.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  if (mode === "vi") {
    // 1. Headings: '## EN / VI' -> '## VI'
    text = text.replace(/^(#{1,6}\s+)(.*?)\s*\/\s*(.*)$/gm, "$1$3");
    // 2. Headings with VI (Tiêu đề):
    text = text.replace(/^(#{1,6}\s+.*)\n\*\*VI(?:\s*\(Tiêu đề\))?:?\*\*\s*(.*)$/gm, "$1 — $2");
    // 3. Convert bullet pairs '- **EN:** en\n  **VI:** vi' -> '- vi'
    text = text.replace(/^(\s*)-\s*(?:\*\*)?EN:?\*?\*?\s*(.*?)\s*\n\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*(.*)$/gm, "$1- $3");
    // 4. Remove EN lines
    text = text.replace(/^\s*(?:\*\*)?EN:?\*?\*?\s*.*$/gm, "");
    // 5. Clean VI markers
    text = text.replace(/^\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*/gm, "");
    text = text.replace(/^(\s*)-\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*/gm, "$1- ");
    // 6. Remove isolated --- dividers
    text = text.replace(/\n\s*---\s*\n/g, "\n\n");
  } else if (mode === "en") {
    // 1. Headings: '## EN / VI' -> '## EN'
    text = text.replace(/^(#{1,6}\s+)(.*?)\s*\/\s*(.*)$/gm, "$1$2");
    // 2. Remove VI subtitles on headings
    text = text.replace(/^(#{1,6}\s+.*)\n\*\*VI(?:\s*\(Tiêu đề\))?:?\*\*\s*.*$/gm, "$1");
    // 3. Convert bullet pairs '- **EN:** en\n  **VI:** vi' -> '- en'
    text = text.replace(/^(\s*)-\s*(?:\*\*)?EN:?\*?\*?\s*(.*?)\s*\n\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*.*$/gm, "$1- $2");
    // 4. Remove VI lines
    text = text.replace(/^\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*.*$/gm, "");
    // 5. Clean EN markers
    text = text.replace(/^\s*(?:\*\*)?EN:?\*?\*?\s*/gm, "");
    text = text.replace(/^(\s*)-\s*(?:\*\*)?EN:?\*?\*?\s*/gm, "$1- ");
    // 6. Remove isolated --- dividers
    text = text.replace(/\n\s*---\s*\n/g, "\n\n");
  } else {
    // Bilingual mode: Format EN and VI pairs into elegant presentation
    // Remove standalone --- dividers
    text = text.replace(/\n\s*---\s*\n/g, "\n\n");
    // Convert headings '## Title EN / Title VI'
    text = text.replace(/^(#{1,6}\s+)(.*?)\s*\/\s*(.*)$/gm, "$1$2\n*Bản dịch:* $3");
    // Handle bullet list pairs
    text = text.replace(/^(\s*)-\s*(?:\*\*)?EN:?\*?\*?\s*(.*?)\s*\n\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*(.*)$/gm, (_m, indent, enPart, viPart) => {
      return `${indent}- **EN:** ${enPart.trim()}\n${indent}  > 🇻🇳 **Dịch:** ${viPart.trim()}`;
    });
    // Convert block pairs of EN: and VI: into clean blockquotes
    text = text.replace(/(?:\*\*)?EN:?\*?\*?\s*([\s\S]*?)\s*\n+\s*(?:\*\*)?VI(?:\s*\(Tiêu đề\)|(?:\s*Dịch))?:?\*?\*?\s*([\s\S]*?)(?=\n\n|$)/g, (_m, en, vi) => {
      return `**EN:** ${en.trim()}\n\n> 🇻🇳 **Dịch:** ${vi.trim()}`;
    });
  }

  // Restore code blocks
  text = text.replace(/___CODE_BLOCK_(\d+)___/g, (_, i) => codeBlocks[Number(i)]);

  // Clean excessive empty lines
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
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

  // Transformed markdown based on active language mode
  const displayMarkdown = useMemo(() => {
    let md = transformBilingualMarkdown(lesson.contentMarkdown, langMode);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const lines = md.split("\n");
      const matched = lines.filter((line) => {
        if (line.startsWith("#")) return true;
        return line.toLowerCase().includes(q);
      });
      md = matched.join("\n");
    }

    return md;
  }, [lesson.contentMarkdown, langMode, searchQuery]);

  // Extract quick section headings for Table of Contents jump
  const sections = useMemo(() => {
    if (hasQuizQuestions && quizQuestions) {
      return quizQuestions.map((q) => ({
        id: `quiz-q-${q.number}`,
        title: `Câu ${q.number}: ${q.title || `Câu hỏi ${q.number}`}`
      }));
    }

    const rawHeadings = lesson.contentMarkdown.match(/^##\s+(.+)$/gm) || [];
    return rawHeadings.map((h, index) => {
      const rawTitle = h.replace(/^##\s+/, "").trim();
      const parts = rawTitle.split("/");
      let title = rawTitle;
      if (langMode === "vi" && parts.length > 1) {
        title = parts[1].trim();
      } else if (langMode === "en" && parts.length > 1) {
        title = parts[0].trim();
      }
      return { id: `sec-${index}`, title };
    }).slice(0, 8); // limit top 8
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
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    if (sec.id.startsWith("quiz-q-")) {
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      return;
                    }
                    const headingEl = Array.from(document.querySelectorAll("h2, h3")).find((el) =>
                      el.textContent?.toLowerCase().includes(sec.title.toLowerCase().slice(0, 15))
                    );
                    if (headingEl) {
                      headingEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--muted-strong)] hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer truncate max-w-[260px]"
                >
                  <span className="mr-1 text-[10px] font-bold text-emerald-500">#{idx + 1}</span>
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

        {/* 4. MAIN READING CONTENT AREA */}
        <section
          aria-label="Nội dung phân tích kiến trúc bài học"
          className="prose dark:prose-invert max-w-none [contain:content] pt-2 space-y-6"
          style={{ fontSize: `${textScale}%` }}
        >
          {/* For Quiz lessons: render question analysis & answer key cards */}
          {hasQuizQuestions && (
            <div className="not-prose space-y-5">
              {filteredQuizQuestions.map((q) => {
                const correctOption = q.options.find((o) => o.isCorrect);
                return (
                  <div
                    key={q.id}
                    id={`quiz-q-${q.number}`}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-4 sm:p-6 space-y-3.5 transition-all hover:border-emerald-500/30"
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

                    {/* Correct Option Highlight Box */}
                    {correctOption && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 sm:p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span>Đáp án chính xác: ({correctOption.id})</span>
                        </div>
                        <div className="pl-5.5 space-y-0.5">
                          {langMode !== "vi" && correctOption.textEn && (
                            <p className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                              {correctOption.textEn}
                            </p>
                          )}
                          {langMode !== "en" && correctOption.textVi && (
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                              {correctOption.textVi}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Explanation / Key takeaway */}
                    {(q.explanationVi || q.explanationEn || q.feedbackVi || q.feedbackEn) && (
                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs leading-relaxed space-y-1 text-[var(--muted-strong)]">
                        <span className="font-bold text-[var(--foreground)] flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>Phân tích & Điểm mấu chốt:</span>
                        </span>
                        <p>{q.explanationVi || q.explanationEn || q.feedbackVi || q.feedbackEn}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Render markdown content (for all lessons, or additional notes on quiz) */}
          {displayMarkdown && (
            <MarkdownContent markdown={displayMarkdown} />
          )}
        </section>
      </div>
    </div>
  );
}
