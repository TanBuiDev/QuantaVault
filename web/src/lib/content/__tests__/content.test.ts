// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  getAdjacentProblemIds,
  getAllProblemSummaries,
  getOrderedProblemIds,
  getProblemContent,
  getProblemSummary,
  getTopInterview150,
  splitHints,
} from "@/lib/content";

describe("canonical Top Interview 150 content", () => {
  it("preserves the canonical study-plan order and resolves exactly 150 unique IDs", () => {
    const plan = getTopInterview150();
    const ids = getOrderedProblemIds();

    expect(plan.id).toBe("top-interview-150");
    expect(plan.sections[0]).toMatchObject({
      name: "Array / String",
      slug: "array-string",
      problemIds: [88, 27, 26, 80, 169, 189, 121],
    });
    expect(ids).toHaveLength(150);
    expect(new Set(ids).size).toBe(150);
    expect(ids.slice(0, 8)).toEqual([88, 27, 26, 80, 169, 189, 121, 122]);
  });

  it("resolves every study-plan ID to exactly one canonical summary", () => {
    const ids = getOrderedProblemIds();
    const summaries = getAllProblemSummaries();
    const counts = new Map<number, number>();

    for (const summary of summaries) {
      counts.set(summary.id, (counts.get(summary.id) ?? 0) + 1);
    }

    for (const id of ids) {
      expect(counts.get(id), `problem ${id}`).toBe(1);
    }
  });

  it("loads the complete V2 package for problem 121", () => {
    const summary = getProblemSummary(121);
    const content = getProblemContent(121);

    expect(summary).toMatchObject({
      id: 121,
      slug: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      primarySection: "array-string",
      contentStatus: {
        source: "full-source",
        translation: "complete",
        hints: "complete",
        solution: "complete",
        interview: "complete",
        cases: "complete",
      },
    });
    expect(content?.problemMarkdown).toContain("Best Time to Buy and Sell Stock");
    expect(content?.hintsMarkdown).toContain("## Hint 1");
    expect(content?.solutionMarkdown).toBeTruthy();
    expect(content?.interviewMarkdown).toBeTruthy();
    expect(content?.javaSource).toContain("class Solution");
    expect(content?.casesYaml).toContain("problem_id: 121");
  });

  it("returns null for unknown problem IDs", () => {
    expect(getProblemSummary(999999)).toBeNull();
    expect(getProblemContent(999999)).toBeNull();
  });

  it("computes first, middle, and last adjacency from canonical order", () => {
    const ids = getOrderedProblemIds();
    const middleIndex = Math.floor(ids.length / 2);
    const middle = ids[middleIndex];

    expect(getAdjacentProblemIds(ids[0])).toEqual({ previous: null, next: ids[1] });
    expect(getAdjacentProblemIds(middle)).toEqual({
      previous: ids[middleIndex - 1],
      next: ids[middleIndex + 1],
    });
    expect(getAdjacentProblemIds(ids.at(-1)!)).toEqual({
      previous: ids.at(-2)!,
      next: null,
    });
  });

  it("splits progressive hint sections while preserving markdown", () => {
    expect(splitHints(null)).toEqual([]);

    const hints = splitHints(getProblemContent(121)?.hintsMarkdown ?? null);
    expect(hints).toHaveLength(3);
    expect(hints[0]).toContain("## Hint 1");
    expect(hints[1]).toContain("minimum price seen so far");
    expect(hints[2]).toContain("currentPrice - minPrice");
  });
});
