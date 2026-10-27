"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Code2,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  Plus,
  Edit3,
} from "lucide-react";
import type { InterviewFilterState, InterviewQuestion } from "@/lib/interview/types";
import { filterInterviewQuestions } from "@/lib/interview";
import { useInterviewProgress } from "@/lib/interview/progress";
import {
  useInterviewDrafts,
  mergeQuestionsWithDrafts,
} from "@/lib/interview/draftStore";
import { InterviewStatsCard } from "./InterviewStatsCard";
import { InterviewFilterBar } from "./InterviewFilterBar";
import { InterviewQuestionCard } from "./InterviewQuestionCard";
import { InterviewEditModal } from "./InterviewEditModal";
import { PublishDrawer } from "./PublishDrawer";

export interface InterviewListViewProps {
  initialQuestions: InterviewQuestion[];
}

const DEFAULT_FILTER: InterviewFilterState = {
  search: "",
  category: "all",
  difficulty: "all",
  status: "all",
  company: "all",
};

export type RecallMode = "hidden" | "summaries" | "answers";

function getPageList(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    const list: number[] = [];
    for (let i = 1; i <= totalPages; i++) list.push(i);
    return list;
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function InterviewListView({ initialQuestions }: InterviewListViewProps) {
  const [filter, setFilter] = useState<InterviewFilterState>(DEFAULT_FILTER);
  const [recallMode, setRecallMode] = useState<RecallMode>("hidden");
  const [pageSize, setPageSize] = useState<number | "all">(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const listTopRef = useRef<HTMLDivElement>(null);

  const currentFilterKey = `${filter.search}|${filter.category}|${filter.difficulty}|${filter.status}|${filter.company}|${pageSize}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  // Reader Mode by default, Editor Mode on demand (?edit=true or Ctrl+Shift+E)
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true" || urlParams.get("mode") === "editor") {
      try {
        localStorage.setItem("interview_edit_mode", "true");
      } catch {}
      return true;
    }
    try {
      return localStorage.getItem("interview_edit_mode") === "true";
    } catch {
      return false;
    }
  });

  // Shortcut Ctrl + Shift + E to toggle edit mode
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        setIsEditMode((prev) => {
          const next = !prev;
          try {
            if (next) {
              localStorage.setItem("interview_edit_mode", "true");
            } else {
              localStorage.removeItem("interview_edit_mode");
            }
          } catch {}
          return next;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem("interview_edit_mode", "true");
        } else {
          localStorage.removeItem("interview_edit_mode");
        }
      } catch {}
      return next;
    });
  };

  // Draft management hook (Offline-first localStorage)
  const {
    drafts,
    publishedCache,
    saveDraft,
    removeDraft,
    markDeleted,
    clearAllDrafts,
    commitDraftsToPublished,
  } = useInterviewDrafts();

  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Merge canonical initialQuestions with user drafts and published cache
  const mergedQuestions = useMemo(() => {
    return mergeQuestionsWithDrafts(initialQuestions, drafts, publishedCache);
  }, [initialQuestions, drafts, publishedCache]);

  const canonicalQuestion = useMemo(() => {
    if (!editingQuestion) return undefined;
    return initialQuestions.find((q) => q.id === editingQuestion.id);
  }, [initialQuestions, editingQuestion]);

  const {
    state: progress,
    isLearned,
    isReview,
    isBookmarked,
    toggleLearned,
    toggleReview,
    toggleBookmark,
  } = useInterviewProgress();

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return filterInterviewQuestions(mergedQuestions, filter, progress);
  }, [mergedQuestions, filter, progress]);

  // Calculate pagination with boundary safeguards
  const totalPages = pageSize === "all" ? 1 : Math.max(1, Math.ceil(filteredQuestions.length / Number(pageSize)));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedQuestions = useMemo(() => {
    if (pageSize === "all") return filteredQuestions;
    const size = Number(pageSize);
    const start = (safeCurrentPage - 1) * size;
    return filteredQuestions.slice(start, start + size);
  }, [filteredQuestions, safeCurrentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    const page = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleResetFilter = () => {
    setFilter(DEFAULT_FILTER);
  };

  const handleSelectStatusFilter = (status: InterviewFilterState["status"]) => {
    setFilter((prev) => ({ ...prev, status }));
  };

  return (
    <div className="mx-auto max-w-5xl xl:max-w-6xl space-y-8 lg:space-y-10 animate-fade-in">
      {/* 1. Header Banner */}
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>
              Java Interview Hub
            </Badge>
            <span className="text-sm font-medium text-[var(--muted)]">
              {initialQuestions.length} câu hỏi chọn lọc · Cập nhật phỏng vấn 2026
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src="/brand-logo.png"
              alt="Logo Java"
              className="size-10 sm:size-12 rounded-2xl object-cover shadow-lg shadow-indigo-500/20 ring-1 ring-[var(--border)] shrink-0"
            />
            <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl xl:text-5xl">
              Bộ Câu Hỏi Phỏng Vấn Java
            </h1>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Tổng hợp câu hỏi phỏng vấn thực tế từ các công ty công nghệ hàng đầu (FPT, Viettel, VNG, VNPay, Shopee, Techcombank).
            Ôn luyện từ nền tảng <strong>Java Core, Concurrency, JVM</strong> đến <strong>Spring Boot & Database</strong>.
          </p>
        </div>

        {/* Action buttons: Add question (only in Edit mode) & switch to LeetCode practice */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          {isEditMode ? (
            <>
              <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <Edit3 className="h-4 w-4" />
                <span>Chế độ Biên tập</span>
                <button
                  type="button"
                  onClick={handleToggleEditMode}
                  className="ml-1 rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold hover:bg-indigo-500/30 transition-colors cursor-pointer text-indigo-700 dark:text-indigo-300"
                  title="Thoát chế độ biên tập và quay lại chế độ đọc"
                >
                  Thoát
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `q-${Date.now().toString().slice(-4)}`;
                  const newQ: InterviewQuestion = {
                    id: newId,
                    title: "[Mới] Tiêu đề câu hỏi phỏng vấn của bạn...",
                    category: "java-core",
                    difficulty: "junior",
                    tags: ["Java", "Interview"],
                    summary: "",
                    answerMarkdown: "### Trả lời chi tiết:\n\n",
                    keyTakeaways: ["Điểm mấu chốt 1"],
                  };
                  setEditingQuestion(newQ);
                  setIsEditModalOpen(true);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </>
          ) : null}

          <Link
            href="/problems"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-xs transition-all hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            <Code2 className="h-4 w-4 text-indigo-500" />
            <span>Luyện 150 Thuật toán</span>
          </Link>
        </div>
      </header>

      {/* 2. Progress Overview Stats Card */}
      <section aria-label="Thống kê tiến độ ôn luyện">
        <InterviewStatsCard
          questions={initialQuestions}
          progress={progress}
          activeStatusFilter={filter.status}
          onSelectStatusFilter={handleSelectStatusFilter}
        />
      </section>

      {/* 3. Filter Controls */}
      <section aria-label="Bộ lọc câu hỏi">
        <InterviewFilterBar
          questions={initialQuestions}
          filter={filter}
          onFilterChange={setFilter}
          onResetFilter={handleResetFilter}
        />
      </section>

      {/* 4. Questions List Toolbar & Content */}
      <section aria-label="Danh sách câu hỏi phỏng vấn" className="space-y-4">
        {/* Scroll anchor target */}
        <div ref={listTopRef} className="-mt-4 pt-4" />

        {/* Toolbar info & Bulk view controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 text-xs text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span>
              Hiển thị{" "}
              <strong>
                {filteredQuestions.length === 0
                  ? 0
                  : pageSize === "all"
                  ? `1 - ${filteredQuestions.length}`
                  : `${(currentPage - 1) * Number(pageSize) + 1} - ${Math.min(
                      currentPage * Number(pageSize),
                      filteredQuestions.length
                    )}`}
              </strong>{" "}
              / {filteredQuestions.length} câu hỏi
            </span>

            {filter.status !== "all" && (
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 font-bold text-indigo-600 dark:text-indigo-400">
                Lọc: {filter.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span>Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(e.target.value === "all" ? "all" : Number(e.target.value))
                }
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-2 py-1 text-xs font-semibold text-[var(--foreground)] cursor-pointer"
                aria-label="Số câu hỏi mỗi trang"
              >
                <option value={15}>15 / trang</option>
                <option value={30}>30 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
                <option value="all">Tất cả ({filteredQuestions.length})</option>
              </select>
            </div>

            {/* Bulk Active Recall Mode Switcher */}
            {filteredQuestions.length > 0 && (
              <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setRecallMode("hidden")}
                  title="Chế độ Tự nhẩm: Ẩn tóm tắt và lời giải để bạn tự trả lời trong đầu"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    recallMode === "hidden"
                      ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <EyeOff className="h-3 w-3" />
                  <span>Tự nhẩm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecallMode("summaries")}
                  title="Hiện tóm tắt cốt lõi của tất cả câu hỏi"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    recallMode === "summaries"
                      ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span>Tóm tắt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecallMode("answers")}
                  title="Mở bung toàn bộ lời giải chi tiết"
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    recallMode === "answers"
                      ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <BookOpen className="h-3 w-3" />
                  <span>Đầy đủ</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards or Empty State */}
        {pagedQuestions.length > 0 ? (
          <div className="space-y-4">
            {pagedQuestions.map((question, idx) => {
              const globalIndex =
                pageSize === "all"
                  ? idx
                  : (currentPage - 1) * Number(pageSize) + idx;
              const isQuestionDraft = Boolean(drafts[question.id]);

              return (
                <InterviewQuestionCard
                  key={`${question.id}-${recallMode}`}
                  question={question}
                  index={globalIndex}
                  isLearned={isLearned(question.id)}
                  isReview={isReview(question.id)}
                  isBookmarked={isBookmarked(question.id)}
                  isDraft={isQuestionDraft}
                  onEdit={
                    isEditMode
                      ? () => {
                          setEditingQuestion(question);
                          setIsEditModalOpen(true);
                        }
                      : undefined
                  }
                  onDiscardDraft={
                    isEditMode && isQuestionDraft ? () => removeDraft(question.id) : undefined
                  }
                  onToggleLearned={() => toggleLearned(question.id)}
                  onToggleReview={() => toggleReview(question.id)}
                  onToggleBookmark={() => toggleBookmark(question.id)}
                  defaultExpanded={recallMode === "answers"}
                  defaultShowSummary={
                    recallMode === "summaries" || recallMode === "answers"
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-12">
            <HelpCircle className="mx-auto h-12 w-12 text-[var(--muted)]" />
            <h3 className="mt-4 text-base font-bold text-[var(--foreground)] sm:text-lg">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[var(--muted)]">
              Không có câu hỏi nào khớp với từ khóa tìm kiếm hoặc các bộ lọc bạn đã chọn.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleResetFilter}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary)]/90 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Đặt lại toàn bộ bộ lọc</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Pagination Bar */}
        {totalPages > 1 && pageSize !== "all" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border)] text-xs">
            <div className="text-[var(--muted)] font-medium">
              Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> ({filteredQuestions.length} câu hỏi)
            </div>

            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-2xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Trước</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {getPageList(currentPage, totalPages).map((p, pIdx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${pIdx}`}
                      className="px-2 py-1 text-[var(--muted)] font-bold select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      type="button"
                      onClick={() => handlePageChange(p as number)}
                      className={`h-8 w-8 rounded-xl font-bold text-xs transition-all ${
                        currentPage === p
                          ? "bg-[var(--primary)] text-white shadow-xs scale-105"
                          : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-2xs"
              >
                <span>Sau</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 5. Footer Info Box */}
      <aside className="rounded-3xl border border-[var(--border)] bg-gradient-to-r from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] p-5 sm:p-6 text-xs text-[var(--muted)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-[var(--foreground)]">
              {isEditMode ? "Chế độ Biên tập đang bật" : "Phương pháp ôn tập gợi nhớ chủ động (Active Recall)"}
            </span>
          </div>
          <span>
            {isEditMode ? (
              <>
                Bạn có thể sửa câu hỏi trực tiếp hoặc thêm câu mới, sau đó xuất bản 1 commit lên GitHub khi kết thúc buổi làm việc.
              </>
            ) : (
              <>
                Hãy thử tự trả lời hoặc tóm tắt ý chính trước khi bấm <code className="rounded bg-[var(--surface-hover)] px-1.5 py-0.5 font-mono text-[var(--foreground)]">Xem chi tiết</code> để tối đa hóa hiệu quả ghi nhớ dài hạn khi đi phỏng vấn.
              </>
            )}
          </span>
        </div>
      </aside>

      {/* 6. Interview Edit Modal (Only active in Edit Mode) */}
      {isEditMode && (
        <InterviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingQuestion(null);
          }}
          question={editingQuestion}
          canonicalQuestion={canonicalQuestion}
          onSave={(updated, canonical) => {
            saveDraft(updated, canonical);
          }}
          onDelete={(q) => {
            markDeleted(q);
          }}
        />
      )}

      {/* 7. Floating Bottom Publish Drawer (Only visible in Edit Mode) */}
      {isEditMode && (
        <PublishDrawer
          drafts={drafts}
          publishedCache={publishedCache}
          canonicalQuestions={initialQuestions}
          onClearAll={clearAllDrafts}
          onPublishSuccess={commitDraftsToPublished}
        />
      )}
    </div>
  );
}
