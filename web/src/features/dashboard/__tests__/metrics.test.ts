import { describe, expect, it } from "vitest";

import { calculateDashboardMetrics, calculateSectionProgress } from "@/features/dashboard/metrics";
import type { ProgressStateV1 } from "@/lib/progress";
import type { StudyPlan } from "@/lib/content";

function progressState(): ProgressStateV1 {
  return {
    version: 1,
    problems: {
      "88": {
        problemId: 88,
        status: "solved",
        bookmarked: false,
        confidence: 4,
        revealedHints: 0,
        solutionViewed: false,
        interviewViewed: false,
        notes: "",
        updatedAt: "2026-08-17T00:00:00.000Z",
      },
      "27": {
        problemId: 27,
        status: "in-progress",
        bookmarked: false,
        confidence: null,
        revealedHints: 0,
        solutionViewed: false,
        interviewViewed: false,
        notes: "",
        updatedAt: "2026-08-17T00:00:00.000Z",
      },
      "121": {
        problemId: 121,
        status: "review",
        bookmarked: true,
        confidence: 3,
        revealedHints: 1,
        solutionViewed: true,
        interviewViewed: false,
        notes: "",
        updatedAt: "2026-08-17T00:00:00.000Z",
      },
    },
  };
}

const plan: StudyPlan = {
  id: "top-interview-150",
  title: "Top Interview 150",
  sections: [
    { name: "Array / String", slug: "array-string", problemIds: [88, 27, 121] },
    { name: "Two Pointers", slug: "two-pointers", problemIds: [125, 392] },
  ],
};

describe("dashboard progress math", () => {
  it("derives status totals from canonical IDs and treats missing records as remaining", () => {
    expect(calculateDashboardMetrics([88, 27, 121, 125, 392], progressState())).toEqual({
      total: 5,
      solved: 1,
      inProgress: 1,
      review: 1,
      remaining: 2,
    });
  });

  it("calculates solved progress independently for each canonical section", () => {
    expect(calculateSectionProgress(plan, progressState())).toEqual([
      {
        name: "Array / String",
        slug: "array-string",
        total: 3,
        solved: 1,
        inProgress: 1,
        review: 1,
        remaining: 0,
      },
      {
        name: "Two Pointers",
        slug: "two-pointers",
        total: 2,
        solved: 0,
        inProgress: 0,
        review: 0,
        remaining: 2,
      },
    ]);
  });
});
