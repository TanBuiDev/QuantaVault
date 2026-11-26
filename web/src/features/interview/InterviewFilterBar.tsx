"use client";

import { useMemo } from "react";
import { Search, X, Building2 } from "lucide-react";
import type {
  InterviewFilterState,
  InterviewPriority,
  InterviewQuestion,
} from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES } from "@/lib/interview/types";
import { getTopicsByCategory, SPLIT_CATEGORY_GUIDANCE } from "@/lib/interview/topics";
import { interviewMatchesCategory } from "@/lib/interview";

export interface InterviewFilterBarProps {
  questions: InterviewQuestion[];
  filter: InterviewFilterState;
  onFilterChange: (next: InterviewFilterState) => void;
  onResetFilter: () => void;
}

export function InterviewFilterBar({
  questions,
  filter,
  onFilterChange,
  onResetFilter,
}: InterviewFilterBarProps) {
  // Count questions per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of questions) {
      for (const category of Object.values(INTERVIEW_CATEGORIES)) {
        if (interviewMatchesCategory(q, category.id)) {
          counts[category.id] = (counts[category.id] || 0) + 1;
        }
      }
    }
    return counts;
  }, [questions]);

  // Extract unique companies
  const companies = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) {
      if (q.companies) {
        for (const c of q.companies) set.add(c);
      }
    }
    return Array.from(set).sort();
  }, [questions]);

  const availableTopics = useMemo(() => {
    const topics = getTopicsByCategory(filter.category);
    return topics.filter((t) => questions.some((q) => q.topicId === t.id));
  }, [filter.category, questions]);

  const splitGuidance = filter.category !== "all" ? SPLIT_CATEGORY_GUIDANCE[filter.category] : undefined;

  const hasActiveFilters =
    filter.search.trim() !== "" ||
    filter.category !== "all" ||
    (filter.topic ?? "all") !== "all" ||
    filter.difficulty !== "all" ||
    (filter.priority ?? "all") !== "all" ||
    filter.status !== "all" ||
    filter.company !== "all";

  const categories = Object.values(INTERVIEW_CATEGORIES);

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-xs">
      {/* 1. Search Bar & Company dropdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            placeholder="Tìm theo câu hỏi (#087, 87), tiêu đề, từ khóa, công nghệ (HashMap, volatile, Redis...)"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] py-2.5 pl-10 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--focus)] focus:bg-[var(--surface)] focus:outline-hidden transition-all"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filter, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Company Filter Dropdown */}
        {companies.length > 0 && (
          <div className="relative shrink-0">
            <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5">
              <Building2 className="h-4 w-4 text-[var(--muted)]" />
              <select
                value={filter.company}
                onChange={(e) => onFilterChange({ ...filter, company: e.target.value })}
                className="bg-transparent text-xs font-semibold text-[var(--foreground)] focus:outline-hidden cursor-pointer"
                aria-label="Lọc theo công ty phỏng vấn"
              >
                <option value="all">Tất cả công ty</option>
                {companies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-1.5 self-start rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

      {/* 2. Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onFilterChange({ ...filter, category: "all", topic: "all" })}
          className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filter.category === "all"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
          }`}
        >
          Tất cả ({questions.length})
        </button>

        {categories.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isSelected = filter.category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ ...filter, category: isSelected ? "all" : cat.id, topic: "all" })}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] ${isSelected ? "text-white/80" : "text-[var(--muted)]"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Split Category Guidance */}
      {splitGuidance && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-[var(--muted-strong)]">
          <span>{splitGuidance.note}</span>
          {splitGuidance.related.map((relId) => (
            <button
              key={relId}
              type="button"
              onClick={() => onFilterChange({ ...filter, category: relId, topic: "all" })}
              className="rounded-lg border border-indigo-500/30 bg-[var(--surface)] px-2 py-0.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            >
              {INTERVIEW_CATEGORIES[relId].label} →
            </button>
          ))}
        </div>
      )}

      {/* Topic Sub-filter Row */}
      {availableTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--border)]/60 text-xs">
          <span className="font-semibold text-[var(--muted)] mr-1">Chủ đề:</span>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, topic: "all" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              (filter.topic ?? "all") === "all"
                ? "bg-[var(--foreground)] text-[var(--surface)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Tất cả
          </button>
          {availableTopics.map((topic) => {
            const active = filter.topic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onFilterChange({ ...filter, topic: active ? "all" : topic.id })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white font-bold"
                    : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                {topic.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Difficulty & Priority Rows */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[var(--border)]/60 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[var(--muted)]">Cấp độ:</span>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, difficulty: "all" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.difficulty === "all"
                ? "bg-[var(--foreground)] text-[var(--surface)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Tất cả
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, difficulty: "fresher" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.difficulty === "fresher"
                ? "bg-sky-500 text-white font-bold"
                : "text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
            }`}
          >
            Fresher (Nền tảng)
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, difficulty: "junior" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.difficulty === "junior"
                ? "bg-emerald-500 text-white font-bold"
                : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            Junior (Cơ bản)
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, difficulty: "middle" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.difficulty === "middle"
                ? "bg-amber-500 text-white font-bold"
                : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            }`}
          >
            Middle (Trung cấp)
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, difficulty: "senior" })}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.difficulty === "senior"
                ? "bg-rose-500 text-white font-bold"
                : "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
            }`}
          >
            Senior (Nâng cao)
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-[var(--muted)]">Ưu tiên:</span>
          {([
            { id: "all", label: "Tất cả" },
            { id: "p1", label: "P1 (Bắt buộc)" },
            { id: "p2", label: "P2 (Quan trọng)" },
            { id: "p3", label: "P3 (Nâng cao)" },
          ] as const).map((item) => {
            const active = (filter.priority ?? "all") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange({ ...filter, priority: item.id as InterviewPriority | "all" })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? item.id === "p1"
                      ? "bg-indigo-600 text-white font-bold"
                      : item.id === "p2"
                      ? "bg-violet-600 text-white font-bold"
                      : item.id === "p3"
                      ? "bg-slate-700 text-white font-bold"
                      : "bg-[var(--foreground)] text-[var(--surface)] font-bold"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
