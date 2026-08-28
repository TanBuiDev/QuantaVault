"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, CheckCircle2, Clock, Circle, Layers } from "lucide-react";
import { useProgress } from "@/lib/progress/provider";
import type { StudyPlanNavResponse } from "@/app/api/study-plan/route";

function difficultyColor(diff: "Easy" | "Medium" | "Hard") {
  if (diff === "Easy") return "text-emerald-600 dark:text-emerald-400";
  if (diff === "Medium") return "text-amber-500 dark:text-amber-400";
  if (diff === "Hard") return "text-rose-500 dark:text-rose-400";
  return "text-[var(--muted)]";
}

export function ProblemNavTree() {
  const pathname = usePathname();
  const { getProgress } = useProgress();

  const [studyPlan, setStudyPlan] = useState<StudyPlanNavResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Detect current active problem id from pathname (/problems/[id])
  const activeProblemId = useMemo<number | null>(() => {
    const match = pathname?.match(/\/problems\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }, [pathname]);

  // Fetch study plan on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/study-plan");
        if (!res.ok) throw new Error("Failed to fetch study plan");
        const data: StudyPlanNavResponse = await res.json();
        if (isMounted) {
          setStudyPlan(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading problem tree in sidebar:", err);
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // Calculate overall solved count
  const allProblemIds = useMemo(() => {
    if (!studyPlan) return [];
    return studyPlan.sections.flatMap((s) => s.problems.map((p) => p.id));
  }, [studyPlan]);

  const solvedCount = useMemo(() => {
    return allProblemIds.filter((id) => getProgress(id)?.status === "solved").length;
  }, [allProblemIds, getProgress]);

  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-hover)]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--surface-hover)]" />
      </div>
    );
  }

  if (!studyPlan) return null;

  return (
    <div className="space-y-1 text-xs">
      {/* Top Header: Problems / Top Interview 150 */}
      <div className="px-2">
        <div className="flex items-center justify-between rounded-xl p-1.5 hover:bg-[var(--surface-hover)] transition-colors">
          <Link
            href="/problems"
            className="flex items-center gap-2.5 font-bold text-[var(--foreground)] min-w-0"
          >
            <span className="grid size-6 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">Top Interview 150</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {solvedCount}/150
            </span>

            <button
              type="button"
              onClick={() => setIsTreeExpanded((prev) => !prev)}
              className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title={isTreeExpanded ? "Thu gọn toàn bộ" : "Mở rộng toàn bộ"}
            >
              {isTreeExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      {isTreeExpanded && (
        <div className="space-y-1 pt-1">
          {studyPlan.sections.map((section) => {
            const isExpanded = expandedSections[section.slug] ?? (activeProblemId ? section.problems.some((p) => p.id === activeProblemId) : false);
            const sectionSolved = section.problems.filter((p) => getProgress(p.id)?.status === "solved").length;

            return (
              <div key={section.slug} className="overflow-hidden">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.slug)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 font-semibold text-xs transition-colors ${
                    isExpanded
                      ? "bg-[var(--surface-hover)]/70 text-[var(--foreground)]"
                      : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)]/40 hover:text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
                    )}
                    <span className="truncate">{section.name}</span>
                  </div>

                  <span className="shrink-0 text-[10px] font-medium text-[var(--muted)]">
                    {sectionSolved}/{section.problems.length}
                  </span>
                </button>

                {/* Problems List in Section */}
                {isExpanded && (
                  <ul className="mt-0.5 space-y-0.5 pl-3 pr-1 py-1 border-l-2 border-[var(--border)] ml-3.5">
                    {section.problems.map((p) => {
                      const isActive = p.id === activeProblemId;
                      const prog = getProgress(p.id);
                      const status = prog?.status;

                      return (
                        <li key={p.id}>
                          <Link
                            href={`/problems/${p.id}`}
                            className={`group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-all ${
                              isActive
                                ? "bg-[var(--primary)] text-white font-bold shadow-xs"
                                : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {/* Status Icon */}
                              {status === "solved" ? (
                                <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-emerald-500"}`} />
                              ) : status === "in-progress" ? (
                                <Clock className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-amber-500"}`} />
                              ) : (
                                <Circle className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white/60" : "text-[var(--muted)]/50"}`} />
                              )}

                              <span className="truncate text-[11px]">
                                {p.id}. {p.title}
                              </span>
                            </div>

                            {/* Difficulty Tag */}
                            <span
                              className={`shrink-0 text-[10px] font-bold ${
                                isActive ? "text-white/90" : difficultyColor(p.difficulty)
                              }`}
                            >
                              {p.difficulty}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
