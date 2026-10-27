"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  RotateCcw,
  Bookmark,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Eye,
  EyeOff,
  Edit3,
} from "lucide-react";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import type { InterviewQuestion } from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES } from "@/lib/interview/types";

export interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  index: number;
  isLearned: boolean;
  isReview: boolean;
  isBookmarked: boolean;
  isDraft?: boolean;
  onToggleLearned: () => void;
  onToggleReview: () => void;
  onToggleBookmark: () => void;
  onEdit?: () => void;
  onDiscardDraft?: () => void;
  defaultExpanded?: boolean;
  defaultShowSummary?: boolean;
}

export function InterviewQuestionCard({
  question,
  index,
  isLearned,
  isReview,
  isBookmarked,
  isDraft = false,
  onToggleLearned,
  onToggleReview,
  onToggleBookmark,
  onEdit,
  onDiscardDraft,
  defaultExpanded = false,
  defaultShowSummary = false,
}: InterviewQuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showSummary, setShowSummary] = useState(defaultShowSummary);
  const [copied, setCopied] = useState(false);

  const categoryMeta = INTERVIEW_CATEGORIES[question.category] || {
    id: question.category,
    label: question.category,
  };

  const difficultyColors = {
    junior: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    middle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    senior: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }[question.difficulty];

  const difficultyLabel = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
  }[question.difficulty];

  const handleCopy = () => {
    const textToCopy = `Câu hỏi phỏng vấn Java: ${question.title}\n\nTóm tắt:\n${question.summary}\n\nChi tiết:\n${question.answerMarkdown}`;
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={`rounded-3xl border transition-all duration-200 ${
        isLearned
          ? "border-emerald-500/30 bg-emerald-500/[0.02]"
          : isReview
          ? "border-amber-500/30 bg-amber-500/[0.02]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
      }`}
    >
      {/* 1. Header Row */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2.5 flex-1 min-w-0">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[var(--muted)]">
                #{String(index + 1).padStart(2, "0")}
              </span>

              {/* Category */}
              <span className="rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-2 py-0.5 font-semibold text-[var(--muted-strong)]">
                {categoryMeta.label}
              </span>

              {/* Difficulty */}
              <span className={`rounded-md border px-2 py-0.5 font-bold ${difficultyColors}`}>
                {difficultyLabel}
              </span>

              {/* Companies */}
              {question.companies?.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <Building2 className="h-3 w-3" />
                  {comp}
                </span>
              ))}

              {/* Draft Indicator */}
              {isDraft && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Bản nháp</span>
                  {onDiscardDraft && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDiscardDraft();
                      }}
                      title="Hủy bản nháp câu hỏi này"
                      className="ml-0.5 rounded p-0.5 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
                      aria-label="Hủy bản nháp"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )}
            </div>

            {/* Question Title */}
            <h2 className="text-base sm:text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]">
              {question.title}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[var(--surface-hover)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Study Action Buttons */}
          <div className="flex items-center gap-1.5 self-start shrink-0 pt-1">
            {/* Edit button */}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                title="Chỉnh sửa câu hỏi này"
                className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Chỉnh sửa câu hỏi"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}

            {/* Bookmark button */}
            <button
              type="button"
              onClick={onToggleBookmark}
              title={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi này"}
              className={`rounded-xl p-2 transition-all ${
                isBookmarked
                  ? "bg-indigo-500 text-white shadow-xs"
                  : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              aria-label={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi"}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              title="Copy câu hỏi và câu trả lời"
              className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Copy nội dung"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 2. Active Recall Quick Summary */}
        <div className="mt-4 pt-3 border-t border-[var(--border)]/60">
          {!showSummary && !isExpanded ? (
            <button
              type="button"
              onClick={() => setShowSummary(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Xem tóm tắt nhanh (Active Recall)</span>
            </button>
          ) : (
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                <span>⚡ Tóm tắt cốt lõi:</span>
                {!isExpanded && (
                  <button
                    type="button"
                    onClick={() => setShowSummary(false)}
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <EyeOff className="h-3 w-3" />
                    <span>Ẩn</span>
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--foreground)]/90">
                {question.summary.replace(/^Tóm tắt cốt lõi:\s*/i, "")}
              </p>
            </div>
          )}
        </div>

        {/* 3. Deep Dive / Expandable Answer Section */}
        {isExpanded && (
          <div className="mt-5 space-y-5 border-t border-[var(--border)] pt-5 animate-fade-in">
            {/* Key Takeaways */}
            {question.keyTakeaways && question.keyTakeaways.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>Điểm mấu chốt cần nhớ khi phỏng vấn:</span>
                </div>
                <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-[var(--foreground)]/90 pl-5 list-disc">
                  {question.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Detailed Answer */}
            <div className="prose prose-sm dark:prose-invert max-w-none w-full">
              <MarkdownContent markdown={question.answerMarkdown} fullWidth />
            </div>

            {/* Related LeetCode Problems Cross-link */}
            {question.relatedProblems && question.relatedProblems.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-3.5 text-xs">
                <span className="font-semibold text-[var(--muted)]">Bài tập LeetCode thực hành liên quan:</span>
                {question.relatedProblems.map((probId) => (
                  <Link
                    key={probId}
                    href={`/problems`}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface)] px-2.5 py-1 font-bold text-indigo-600 dark:text-indigo-400 border border-[var(--border)] hover:border-indigo-500 transition-colors"
                  >
                    <span>Bài #{probId}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Bottom Action Bar: Status Tags & Expand Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]/60">
          {/* Status Buttons */}
          <div className="flex items-center gap-2 text-xs">
            {/* Learned button */}
            <button
              type="button"
              onClick={onToggleLearned}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
                isLearned
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:border-emerald-500 hover:text-emerald-500"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isLearned ? "Đã hiểu" : "Đánh dấu đã hiểu"}</span>
            </button>

            {/* Review button */}
            <button
              type="button"
              onClick={onToggleReview}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
                isReview
                  ? "bg-amber-500 text-white shadow-xs"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:border-amber-500 hover:text-amber-500"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isReview ? "Cần ôn lại" : "Cần ôn lại"}</span>
            </button>
          </div>

          {/* Expand / Collapse Answer Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface-hover)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--border)] transition-colors ml-auto"
          >
            <span>{isExpanded ? "Thu gọn đáp án" : "Xem đáp án chi tiết"}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
}
