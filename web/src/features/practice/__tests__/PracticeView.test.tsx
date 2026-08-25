import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PracticeView } from "@/features/practice/PracticeView";
import { parseProblemId } from "@/features/practice/route";
import type { ProblemContent } from "@/lib/content";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress";
import { ProgressProvider } from "@/lib/progress/provider";

const problem121: ProblemContent = {
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
  problemMarkdown: "# VISIBLE PROBLEM\n\nEnglish statement.\n\nVietnamese statement.",
  hintsMarkdown: "## Hint 1\nHint one body.\n\n## Hint 2\nHint two body.\n\n## Hint 3\nHint three body.",
  solutionMarkdown: "# SECRET SOLUTION\n\nUse a running minimum.",
  interviewMarkdown: "# INTERVIEW ANSWER\n\nExplain the invariant.",
  javaSource: "class Solution { /* SECRET JAVA */ }",
  casesYaml: "problem_id: 121",
};

import { ToastProvider } from "@/components/ui/Toast";

function renderPractice(content: ProblemContent = problem121) {
  return render(
    <ToastProvider>
      <ProgressProvider>
        <PracticeView
          content={content}
          hints={["## Hint 1\nHint one body.", "## Hint 2\nHint two body.", "## Hint 3\nHint three body."]}
          previous={{ id: 189, title: "Rotate Array" }}
          next={{ id: 122, title: "Best Time to Buy and Sell Stock II" }}
          sectionName="Array / String"
        />
      </ProgressProvider>
    </ToastProvider>,
  );
}


describe("practice route parsing", () => {
  it("accepts positive integer IDs and rejects malformed routes", () => {
    expect(parseProblemId("121")).toBe(121);
    expect(parseProblemId("00121")).toBe(121);
    expect(parseProblemId("0")).toBeNull();
    expect(parseProblemId("-1")).toBeNull();
    expect(parseProblemId("121abc")).toBeNull();
    expect(parseProblemId("1.5")).toBeNull();
  });
});

describe("PracticeView", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });


  it("shows the problem tab first without rendering inactive tab content", async () => {
    renderPractice();

    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());
    expect(screen.queryByText("SECRET SOLUTION")).not.toBeInTheDocument();
    expect(screen.queryByText(/SECRET JAVA/)).not.toBeInTheDocument();
    expect(screen.queryByText("INTERVIEW ANSWER")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Problem" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows all hints immediately when the Hints tab is selected", async () => {
    renderPractice();
    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("tab", { name: "Hints" }));
    expect(screen.getByText("Hint one body.")).toBeInTheDocument();
    expect(screen.getByText("Hint two body.")).toBeInTheDocument();
  });

  it("shows solution markdown and Java source immediately when selected", async () => {
    renderPractice();
    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("tab", { name: "Solution" }));
    expect(screen.getByText("SECRET SOLUTION")).toBeInTheDocument();
    expect(screen.getByText(/SECRET JAVA/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Java solution" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy Java solution/i })).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    expect(stored.problems["121"].solutionViewed).toBe(true);
  });

  it("records an intentional interview view", async () => {
    renderPractice();
    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("tab", { name: "Interview" }));
    expect(screen.getByText("INTERVIEW ANSWER")).toBeInTheDocument();

    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    expect(stored.problems["121"].interviewViewed).toBe(true);
  });

  it("persists status, bookmark, confidence, and personal notes", async () => {
    renderPractice();
    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Solved" }));
    fireEvent.click(screen.getByRole("button", { name: /Bookmark/i }));
    fireEvent.change(screen.getByLabelText("Confidence"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Personal notes"), {
      target: { value: "Remember the running-minimum invariant." },
    });

    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null");
    expect(stored.problems["121"]).toMatchObject({
      status: "solved",
      bookmarked: true,
      confidence: 5,
      notes: "Remember the running-minimum invariant.",
    });
  });

  it("uses canonical previous and next destinations", async () => {
    renderPractice();
    await waitFor(() => expect(screen.getByText("VISIBLE PROBLEM")).toBeInTheDocument());

    expect(screen.getByRole("link", { name: /Previous.*Rotate Array/i })).toHaveAttribute(
      "href",
      "/problems/189",
    );
    expect(
      screen.getByRole("link", { name: /Next.*Best Time to Buy and Sell Stock II/i }),
    ).toHaveAttribute("href", "/problems/122");
  });

  it("disables unavailable study tabs and explains missing canonical source", async () => {
    const unavailable: ProblemContent = {
      ...problem121,
      id: 999,
      title: "Limited Source Problem",
      contentStatus: {
        ...problem121.contentStatus,
        source: "list-only",
        translation: "none",
        hints: "none",
        solution: "none",
        interview: "none",
        cases: "none",
      },
      problemMarkdown: null,
      hintsMarkdown: null,
      solutionMarkdown: null,
      interviewMarkdown: null,
      javaSource: null,
      casesYaml: null,
    };

    renderPractice(unavailable);
    await waitFor(() => expect(screen.getByText("Limited Source Problem")).toBeInTheDocument());

    expect(screen.getByRole("tab", { name: "Hints" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Solution" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Interview" })).toBeDisabled();
    expect(screen.getByText(/full problem source is not available/i)).toBeInTheDocument();
  });
});
