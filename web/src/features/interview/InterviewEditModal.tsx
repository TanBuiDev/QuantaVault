"use client";

import { useState, useEffect, useRef, useDeferredValue } from "react";
import { Modal } from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  FileText,
  Sliders,
  Eye,
  Edit3,
  Columns,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Check,
} from "lucide-react";
import type {
  InterviewCategory,
  InterviewDifficulty,
  InterviewQuestion,
} from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES, formatQuestionBadge } from "@/lib/interview/types";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import { MarkdownEditorToolbar } from "./MarkdownEditorToolbar";

export interface InterviewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: InterviewQuestion | null;
  canonicalQuestion?: InterviewQuestion;
  onSave: (updatedQuestion: InterviewQuestion, canonicalQuestion?: InterviewQuestion) => void;
  onDelete?: (question: InterviewQuestion) => void;
}

const COMMON_COMPANIES = [
  "VNPay",
  "Axon",
  "One Mount",
  "FPT Software",
  "Viettel",
  "VNG",
  "Shopee",
  "Techcombank",
  "MB Bank",
  "Momo",
  "Tiki",
  "Grab",
  "ZaloPay",
];

interface FormProps {
  question: InterviewQuestion;
  canonicalQuestion?: InterviewQuestion;
  onClose: () => void;
  onSave: (updatedQuestion: InterviewQuestion, canonicalQuestion?: InterviewQuestion) => void;
  onDelete?: (question: InterviewQuestion) => void;
}

function InterviewEditModalForm({ question, canonicalQuestion, onClose, onSave, onDelete }: FormProps) {
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState<"content" | "metadata">("content");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");

  // Initializing state directly from active question (Single Source of Truth)
  const [title, setTitle] = useState(question.title ?? "");
  const [category, setCategory] = useState<InterviewCategory>(
    question.category ?? "java-core"
  );
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>(
    question.difficulty ?? "junior"
  );
  const [summary, setSummary] = useState(question.summary ?? "");
  const [answerMarkdown, setAnswerMarkdown] = useState(
    question.answerMarkdown ?? ""
  );
  const deferredAnswerMarkdown = useDeferredValue(answerMarkdown);
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    question.keyTakeaways ? [...question.keyTakeaways] : []
  );
  const [companies, setCompanies] = useState<string[]>(
    question.companies ? [...question.companies] : []
  );
  const [tags, setTags] = useState<string[]>(
    question.tags ? [...question.tags] : []
  );
  const [relatedProblems, setRelatedProblems] = useState<string>(
    question.relatedProblems && question.relatedProblems.length > 0
      ? question.relatedProblems.join(", ")
      : ""
  );
  const [companyInput, setCompanyInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clear any legacy sessionStorage draft for this question to prevent ghost data
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        sessionStorage.removeItem(`interview_draft_${question.id}`);
      } catch {}
    }
  }, [question.id]);

  // Handle Save
  function handleSave() {
    const parsedRelatedProblems = relatedProblems
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);

    const updated: InterviewQuestion = {
      ...question,
      title: title.trim() || question.title,
      category,
      difficulty,
      summary: summary.trim(),
      answerMarkdown: answerMarkdown.trim(),
      keyTakeaways: keyTakeaways.map((k) => k.trim()).filter((k) => k.length > 0),
      companies: companies.length > 0 ? companies : undefined,
      tags: tags.length > 0 ? tags : ["Java"],
      relatedProblems:
        parsedRelatedProblems.length > 0 ? parsedRelatedProblems : undefined,
    };

    onSave(updated, canonicalQuestion);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  }

  // Keyboard shortcut Ctrl+S or Ctrl+Enter to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S" || e.key === "Enter")) {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Add / remove takeaways
  function handleAddTakeaway() {
    setKeyTakeaways((prev) => [...prev, ""]);
  }
  function handleUpdateTakeaway(index: number, val: string) {
    setKeyTakeaways((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }
  function handleRemoveTakeaway(index: number) {
    setKeyTakeaways((prev) => prev.filter((_, idx) => idx !== index));
  }

  // Add / remove company tags
  function handleAddCompany(companyName: string) {
    const trimmed = companyName.trim();
    if (trimmed && !companies.includes(trimmed)) {
      setCompanies((prev) => [...prev, trimmed]);
      setCompanyInput("");
    }
  }
  function handleRemoveCompany(companyName: string) {
    setCompanies((prev) => prev.filter((c) => c !== companyName));
  }

  // Add / remove tags
  function handleAddTag(tagName: string) {
    const trimmed = tagName.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  }
  function handleRemoveTag(tagName: string) {
    setTags((prev) => prev.filter((t) => t !== tagName));
  }

  return (
    <div className="flex flex-col max-h-[85vh]">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--border)] px-5 py-3.5 bg-[var(--surface)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-lg">
            {formatQuestionBadge(question.id)}
          </span>
          <h2 className="text-sm font-bold text-[var(--foreground)] truncate max-w-md sm:max-w-lg">
            Chỉnh sửa: {title || question.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switchers */}
          <div className="flex items-center rounded-xl bg-[var(--surface-hover)] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "content"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Nội dung</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("metadata")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                activeTab === "metadata"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Thuộc tính</span>
            </button>
          </div>
        </div>
      </div>


      {/* 2. Modal Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* TAB 1: Markdown Content Editor */}
        {activeTab === "content" && (
          <div className="space-y-3.5">
            {/* Question Title (2 rows) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Tiêu đề câu hỏi phỏng vấn
              </label>
              <textarea
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                placeholder="Ví dụ: [Câu 3] Hãy giải thích kiến trúc Modular Monolith..."
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs sm:text-sm font-semibold leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:bg-[var(--surface)] transition-all [contain:content]"
              />
            </div>

            {/* Top View Mode Controls */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Soạn thảo câu trả lời (Markdown & Java Code)
              </span>

              <div className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  title="Chỉ soạn thảo"
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
                    viewMode === "edit"
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-2xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Soạn thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  title="Xem trước kết quả"
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
                    viewMode === "preview"
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-2xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Xem trước</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  title="Xem song song"
                  className={`hidden md:inline-flex items-center gap-1 rounded-md px-2.5 py-1 transition-all ${
                    viewMode === "split"
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-2xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Song song</span>
                </button>
              </div>
            </div>

            {/* Editor + Preview Area */}
            <div
              className={`grid gap-4 ${
                viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {/* Editor Container */}
              {(viewMode === "edit" || viewMode === "split") && (
                <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
                  <MarkdownEditorToolbar
                    textareaRef={textareaRef}
                    value={answerMarkdown}
                    onChange={setAnswerMarkdown}
                  />
                  <textarea
                    ref={textareaRef}
                    rows={16}
                    value={answerMarkdown}
                    onChange={(e) => setAnswerMarkdown(e.target.value)}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    placeholder="Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown..."
                    className="w-full resize-none p-4 font-mono text-xs sm:text-sm leading-relaxed text-[var(--foreground)] bg-transparent outline-none focus:ring-0 [contain:content] [font-variant-ligatures:none]"
                  />
                </div>
              )}

              {/* Preview Container */}
              {(viewMode === "preview" || viewMode === "split") && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 overflow-y-auto max-h-[500px] shadow-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)]">
                    Xem trước hiển thị thực tế:
                  </div>
                  {deferredAnswerMarkdown.trim() ? (
                    <MarkdownContent markdown={deferredAnswerMarkdown} fullWidth />
                  ) : (
                    <p className="text-xs text-[var(--muted)] italic">
                      Chưa có nội dung xem trước...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Metadata & Properties */}
        {activeTab === "metadata" && (
          <div className="space-y-4">
            {/* Question Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Tiêu đề câu hỏi phỏng vấn
              </label>
              <textarea
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                placeholder="Ví dụ: [Câu 3] Hãy giải thích kiến trúc Modular Monolith..."
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs sm:text-sm font-semibold leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:bg-[var(--surface)] transition-all [contain:content]"
              />
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Danh mục chủ đề
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InterviewCategory)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2.5 text-xs sm:text-sm font-semibold text-[var(--foreground)] outline-none cursor-pointer focus:border-[var(--focus)]"
                >
                  {Object.values(INTERVIEW_CATEGORIES).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Cấp độ (Difficulty)
                </label>
                <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 text-xs">
                  {(["junior", "middle", "senior"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition-all ${
                        difficulty === lvl
                          ? lvl === "junior"
                            ? "bg-emerald-500 text-white shadow-xs"
                            : lvl === "middle"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-rose-500 text-white shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Tóm tắt cốt lõi (Hiển thị trong chế độ Active Recall)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                placeholder="Câu đúc kết 1-2 dòng quan trọng nhất mà ứng viên cần bật ra ngay..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:bg-[var(--surface)] transition-all [contain:content]"
              />
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Điểm mấu chốt cần nhớ khi phỏng vấn ({keyTakeaways.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm điểm</span>
                </button>
              </div>

              <div className="space-y-2">
                {keyTakeaways.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[var(--muted)] shrink-0 w-5">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                      placeholder={`Điểm lưu ý #${idx + 1}...`}
                      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:bg-[var(--surface)]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Xóa điểm này"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Companies Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Công ty hay hỏi ({companies.length})
              </label>
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {companies.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompany(c)}
                      className="hover:opacity-75"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick Add Common Companies */}
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-[var(--muted)]">
                <span>Gợi ý nhanh:</span>
                {COMMON_COMPANIES.filter((c) => !companies.includes(c))
                  .slice(0, 6)
                  .map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleAddCompany(c)}
                      className="rounded-md bg-[var(--surface-hover)] px-1.5 py-0.5 hover:bg-[var(--border)] transition-colors"
                    >
                      +{c}
                    </button>
                  ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCompany(companyInput);
                    }
                  }}
                  placeholder="Gõ tên công ty rồi ấn Enter..."
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--focus)]"
                />
                <button
                  type="button"
                  onClick={() => handleAddCompany(companyInput)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-hover)]"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Tags & Related LeetCode Problems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Thẻ phân loại Tags ({tags.length})
                </label>
                <div className="flex flex-wrap items-center gap-1 pb-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-hover)] px-2 py-0.5 text-xs font-medium text-[var(--muted-strong)]"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:opacity-75"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Thêm tag (ví dụ: Concurrency, Volatile)..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--focus)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Bài tập LeetCode liên quan (ID)
                </label>
                <input
                  type="text"
                  value={relatedProblems}
                  onChange={(e) => setRelatedProblems(e.target.value)}
                  placeholder="Nhập ID bài tập cách nhau bởi dấu phẩy (ví dụ: 1, 15, 206)..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3.5 bg-[var(--surface)]">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Lưu tạm vào bộ nhớ máy (<kbd className="rounded border px-1">Ctrl+S</kbd>)</span>
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={async () => {
                const isConfirmed = await confirm({
                  title: "Xác nhận xóa câu hỏi?",
                  message: `Bạn có chắc chắn muốn xóa câu hỏi "${title || question.title}" khỏi danh sách ôn luyện không? Thao tác này sẽ đánh dấu xóa câu hỏi.`,
                  confirmText: "Xóa câu hỏi",
                  cancelText: "Hủy bỏ",
                  variant: "danger",
                });
                if (isConfirmed) {
                  onDelete(question);
                  onClose();
                }
              }}
              title="Xóa câu hỏi này khỏi danh sách ôn luyện"
              className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition-colors mr-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa câu này</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            Hủy bỏ (Esc)
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white transition-all shadow-xs ${
              savedSuccess
                ? "bg-emerald-600"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Đã lưu nháp!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InterviewEditModal({
  isOpen,
  onClose,
  question,
  canonicalQuestion,
  onSave,
  onDelete,
}: InterviewEditModalProps) {
  if (!isOpen || !question) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      className="max-w-4xl! p-0 overflow-hidden"
    >
      <InterviewEditModalForm
        key={question.id}
        question={question}
        canonicalQuestion={canonicalQuestion}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
      />
    </Modal>
  );
}
