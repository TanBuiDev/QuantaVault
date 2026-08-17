import { describe, expect, it } from "vitest";

import { filterProblems, type ProblemFilters } from "@/features/problem-list/filterProblems";
import type { ProblemSummary } from "@/lib/content";
import type { ProgressStateV1 } from "@/lib/progress";

const problems: ProblemSummary[] = [
  {
    id: 121,
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    primarySection: "array-string",
    topics: ["Array", "Dynamic Programming"],
    patterns: ["Running Minimum"],
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    contentStatus: {
      source: "full-source",
      translation: "complete",
      hints: "complete",
      solution: "complete",
      interview: "complete",
      cases: "complete",
      problemMedia: "none",
      solutionMedia: "none",
    },
  },
  {
    id: 125,
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    primarySection: "two-pointers",
    topics: ["Two Pointers", "String"],
    patterns: ["Two Pointers"],
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
    contentStatus: {
      source: "full-source",
      translation: "complete",
      hints: "complete",
      solution: "complete",
      interview: "complete",
      cases: "complete",
      problemMedia: "none",
      solutionMedia: "none",
    },
  },
  {
    id: 15,
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    primarySection: "two-pointers",
    topics: ["Array", "Two Pointers", "Sorting"],
    patterns: ["Sort + Two Pointers"],
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
    contentStatus: {
      source: "list-only",
      translation: "none",
      hints: "none",
      solution: "none",
      interview: "none",
      cases: "none",
      problemMedia: "none",
      solutionMedia: "none",
    },
  },
];

const progress: ProgressStateV1 = {
  version: 1,
  problems: {
    "121": {
      problemId: 121,
      status: "solved",
      bookmarked: true,
      confidence: 4,
      revealedHints: 2,
      solutionViewed: true,
      interviewViewed: false,
      notes: "",
      updatedAt: "2026-08-17T00:00:00.000Z",
    },
    "15": {
      problemId: 15,
      status: "review",
      bookmarked: false,
      confidence: 2,
      revealedHints: 0,
      solutionViewed: false,
      interviewViewed: false,
      notes: "",
      updatedAt: "2026-08-17T00:00:00.000Z",
    },
  },
};

const emptyFilters: ProblemFilters = {
  query: "",
  difficulty: "all",
  section: "all",
  topic: "all",
  status: "all",
};

describe("problem explorer filters", () => {
  it("locates problem 121 by numeric ID and title text case-insensitively", () => {
    expect(filterProblems(problems, progress, { ...emptyFilters, query: "121" }).map((p) => p.id)).toEqual([121]);
    expect(
      filterProblems(problems, progress, { ...emptyFilters, query: "buy AND sell" }).map((p) => p.id),
    ).toEqual([121]);
  });

  it("composes difficulty and section filters", () => {
    expect(
      filterProblems(problems, progress, {
        ...emptyFilters,
        difficulty: "Easy",
        section: "two-pointers",
      }).map((p) => p.id),
    ).toEqual([125]);
  });

  it("filters topics without losing canonical order", () => {
    expect(
      filterProblems(problems, progress, { ...emptyFilters, topic: "Array" }).map((p) => p.id),
    ).toEqual([121, 15]);
  });

  it("treats a missing progress record as not-started", () => {
    expect(
      filterProblems(problems, progress, { ...emptyFilters, status: "not-started" }).map((p) => p.id),
    ).toEqual([125]);
    expect(
      filterProblems(problems, progress, { ...emptyFilters, status: "solved" }).map((p) => p.id),
    ).toEqual([121]);
  });

  it("returns an empty array for a valid zero-result combination", () => {
    expect(
      filterProblems(problems, progress, {
        ...emptyFilters,
        query: "palindrome",
        difficulty: "Medium",
      }),
    ).toEqual([]);
  });
});
