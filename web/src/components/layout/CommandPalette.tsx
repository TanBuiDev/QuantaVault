"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

interface MinimalProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  primarySection: string;
  topics: string[];
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [problems, setProblems] = useState<MinimalProblem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Bắt phím Ctrl + K hoặc Cmd + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Load danh sách bài tập khi mở lần đầu
  useEffect(() => {
    if (isOpen && problems.length === 0) {
      const loadingTimer = window.setTimeout(() => setLoading(true), 0);
      fetch("/api/problems")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProblems(data);
          }
        })
        .catch(() => {})
        .finally(() => {
          window.clearTimeout(loadingTimer);
          setLoading(false);
        });

      return () => window.clearTimeout(loadingTimer);
    }
  }, [isOpen, problems.length]);

  // Tự động focus input khi mở
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isOpen) {
        inputRef.current?.focus();
      } else {
        setQuery("");
        setSelectedIndex(0);
      }
    }, isOpen ? 50 : 0);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Lọc bài tập
  const filtered = useMemo(() => {
    if (!query.trim()) return problems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return problems
      .filter((p) => {
        return (
          String(p.id).includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.primarySection.toLowerCase().includes(q) ||
          p.topics.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 10);
  }, [query, problems]);

  // Điều hướng bằng bàn phím ArrowUp/ArrowDown & Enter
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        goToProblem(target.id);
      }
    }
  }

  function goToProblem(id: number) {
    setIsOpen(false);
    router.push(`/problems/${id}`);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-[12vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette Card */}
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-in">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <svg className="h-5 w-5 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm bài tập theo số hiệu (#380), tên bài, topic..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
          />
          <kbd className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)] sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* List Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <div className="py-12 text-center text-sm text-[var(--muted)]">Đang tải danh sách bài tập...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--muted)]">
              Không tìm thấy bài tập nào khớp với &quot;<span className="text-[var(--foreground)] font-semibold">{query}</span>&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((prob, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={prob.id}
                    type="button"
                    onClick={() => goToProblem(prob.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                      isSelected
                        ? "bg-[var(--primary-soft)] text-[var(--primary-strong)] ring-1 ring-[var(--primary)]/20"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--muted)]">#{prob.id}</span>
                      <span className="truncate font-semibold text-sm">{prob.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden text-xs text-[var(--muted)] sm:inline">{prob.primarySection}</span>
                      <Badge
                        variant={
                          prob.difficulty === "Easy"
                            ? "success"
                            : prob.difficulty === "Medium"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <footer className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-hover)] px-5 py-2.5 text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-sans font-semibold">↑</kbd>{" "}
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-sans font-semibold">↓</kbd> di chuyển
            </span>
            <span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-sans font-semibold">↵</kbd> mở bài
            </span>
          </div>
          <span>Top Interview 150</span>
        </footer>
      </div>
    </div>
  );
}
