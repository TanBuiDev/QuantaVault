import type { StudyPlan } from "@/lib/content";
import { getProblemProgress, type ProgressStateV1 } from "@/lib/progress";

export interface DashboardMetrics {
  total: number;
  solved: number;
  inProgress: number;
  review: number;
  remaining: number;
}

export interface SectionProgress extends DashboardMetrics {
  name: string;
  slug: string;
}

export function calculateDashboardMetrics(
  problemIds: readonly number[],
  progress: ProgressStateV1,
): DashboardMetrics {
  let solved = 0;
  let inProgress = 0;
  let review = 0;

  for (const id of problemIds) {
    const record = getProblemProgress(progress, id);
    if (record?.status === "solved") solved += 1;
    else if (record?.status === "in-progress") inProgress += 1;
    else if (record?.status === "review") review += 1;
  }

  const total = problemIds.length;
  return {
    total,
    solved,
    inProgress,
    review,
    remaining: total - solved - inProgress - review,
  };
}

export function calculateSectionProgress(
  plan: StudyPlan,
  progress: ProgressStateV1,
): SectionProgress[] {
  return plan.sections.map((section) => ({
    name: section.name,
    slug: section.slug,
    ...calculateDashboardMetrics(section.problemIds, progress),
  }));
}
