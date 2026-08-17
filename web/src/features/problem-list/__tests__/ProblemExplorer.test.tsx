import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ProblemExplorer } from "@/features/problem-list/ProblemExplorer";
import type { ProblemSummary, StudyPlanSection } from "@/lib/content";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress";
import { ProgressProvider } from "@/lib/progress/provider";

const summaries: ProblemSummary[] = [
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
    id: 15,
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    primarySection: "two-pointers",
    topics: ["Array", "Two Pointers"],
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

const sections: StudyPlanSection[] = [
  { name: "Array / String", slug: "array-string", problemIds: [121] },
  { name: "Two Pointers", slug: "two-pointers", problemIds: [15] },
];

describe("ProblemExplorer", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        problems: {
          "121": {
            problemId: 121,
            status: "solved",
            bookmarked: true,
            confidence: 4,
            revealedHints: 1,
            solutionViewed: true,
            interviewViewed: false,
            notes: "",
            updatedAt: "2026-08-17T00:00:00.000Z",
          },
        },
      }),
    );
  });

  it("searches by title and links to the practice route", async () => {
    render(
      <ProgressProvider>
        <ProblemExplorer summaries={summaries} sections={sections} />
      </ProgressProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Best Time to Buy and Sell Stock/i })).toBeInTheDocument(),
    );

    expect(screen.getByRole("list", { name: "Problem study list" })).toBeInTheDocument();
    expect(screen.getByLabelText("Bookmarked problem 121")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search problems"), {
      target: { value: "buy and sell" },
    });

    expect(screen.getByRole("link", { name: /Best Time to Buy and Sell Stock/i })).toHaveAttribute(
      "href",
      "/problems/121",
    );
    expect(screen.queryByRole("link", { name: /3Sum/i })).not.toBeInTheDocument();
  });

  it("composes status and difficulty filters and provides a recoverable empty state", async () => {
    render(
      <ProgressProvider>
        <ProblemExplorer summaries={summaries} sections={sections} />
      </ProgressProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Best Time to Buy and Sell Stock/i })).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByLabelText("Learning status"), {
      target: { value: "solved" },
    });
    fireEvent.change(screen.getByLabelText("Difficulty"), {
      target: { value: "Medium" },
    });

    expect(screen.getByText(/No problems match/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Clear all filters/i }));

    expect(screen.getByRole("link", { name: /Best Time to Buy and Sell Stock/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /3Sum/i })).toBeInTheDocument();
  });
});
