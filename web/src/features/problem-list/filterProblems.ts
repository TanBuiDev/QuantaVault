import type { Difficulty, ProblemSummary } from "@/lib/content";
import { getProblemProgress, type LearningStatus, type ProgressStateV1 } from "@/lib/progress";

export type ProblemStatusFilter = "all" | "not-started" | LearningStatus;

export interface ProblemFilters {
  query: string;
  difficulty: "all" | Difficulty;
  section: "all" | string;
  topic: "all" | string;
  status: ProblemStatusFilter;
}

function learnerStatus(
  progress: ProgressStateV1,
  problemId: number,
): Exclude<ProblemStatusFilter, "all"> {
  return getProblemProgress(progress, problemId)?.status ?? "not-started";
}

export function filterProblems(
  problems: readonly ProblemSummary[],
  progress: ProgressStateV1,
  filters: ProblemFilters,
): ProblemSummary[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return problems.filter((problem) => {
    if (query) {
      const matchesId = String(problem.id).includes(query);
      const matchesTitle = problem.title.toLocaleLowerCase().includes(query);
      if (!matchesId && !matchesTitle) return false;
    }

    if (filters.difficulty !== "all" && problem.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.section !== "all" && problem.primarySection !== filters.section) {
      return false;
    }
    if (filters.topic !== "all" && !problem.topics.includes(filters.topic)) {
      return false;
    }
    if (filters.status !== "all" && learnerStatus(progress, problem.id) !== filters.status) {
      return false;
    }

    return true;
  });
}
