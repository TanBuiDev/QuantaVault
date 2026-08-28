import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { ToastProvider } from "@/components/ui/Toast";
import { PracticeView } from "@/features/practice/PracticeView";
import type { ProblemContent } from "@/lib/content";
import { ProgressProvider } from "@/lib/progress/provider";

const content: ProblemContent = {
  id: 121,
  slug: "best-time-to-buy-and-sell-stock",
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  primarySection: "array-string",
  topics: ["Array"],
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
  problemMarkdown: "# Problem body",
  hintsMarkdown: "## Hint 1\nThink first.",
  solutionMarkdown: "# Solution",
  interviewMarkdown: "# Interview",
  javaSource: "class Solution {}",
  casesYaml: null,
};

describe("Practice workspace layout", () => {
  it("separates study content from the personal progress panel", () => {
    render(
      <ToastProvider>
        <ConfirmProvider>
          <ProgressProvider>
            <PracticeView
              content={content}
              hints={["## Hint 1\nThink first."]}
              previous={{ id: 189, title: "Rotate Array" }}
              next={{ id: 122, title: "Best Time to Buy and Sell Stock II" }}
              sectionName="Array / String"
            />
          </ProgressProvider>
        </ConfirmProvider>
      </ToastProvider>,
    );

    expect(screen.getByRole("region", { name: "Study content" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Study progress" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open on LeetCode" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Open on LeetCode" })).toHaveAttribute("rel", "noreferrer");
  });
});
