import { describe, it, expect } from "vitest";
import {
  getAllInterviewQuestions,
  getInterviewQuestionById,
  getAllCategories,
  getAllCompanies,
  filterInterviewQuestions,
} from "../index";
import type { InterviewFilterState, InterviewProgressState } from "../types";

describe("Interview Data Access and Filtering", () => {
  it("loads all starter interview questions successfully", () => {
    const questions = getAllInterviewQuestions();
    expect(questions.length).toBeGreaterThanOrEqual(480);

    for (const q of questions) {
      expect(q.id).toBeDefined();
      expect(q.title.trim().length).toBeGreaterThan(5);
      expect(q.category).toBeDefined();
      expect(q.difficulty).toMatch(/junior|middle|senior/);
      expect(q.summary.trim().length).toBeGreaterThan(10);
      expect(q.answerMarkdown.trim().length).toBeGreaterThan(20);
      expect(Array.isArray(q.tags)).toBe(true);
    }
  });

  it("finds a question by id", () => {
    const question = getInterviewQuestionById("q-054");
    expect(question).toBeDefined();
    expect(question?.title).toContain("equals()");
  });

  it("returns undefined for non-existent id", () => {
    const question = getInterviewQuestionById("non-existent-id-999");
    expect(question).toBeUndefined();
  });

  it("retrieves unique category list and company tags", () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThanOrEqual(7);

    const companies = getAllCompanies();
    expect(companies).toContain("FPT Software");
    expect(companies).toContain("Viettel");
  });

  it("filters questions by search term", () => {
    const all = getAllInterviewQuestions();
    const filter: InterviewFilterState = {
      search: "volatile",
      category: "all",
      difficulty: "all",
      status: "all",
      company: "all",
    };

    const results = filterInterviewQuestions(all, filter);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((q) => q.id === "q-178")).toBe(true);
  });

  it("filters questions quickly by question number and badge (#087, 87, 087)", () => {
    const all = getAllInterviewQuestions();
    
    // Search with #087
    const byBadge = filterInterviewQuestions(all, {
      search: "#087",
      category: "all",
      difficulty: "all",
      status: "all",
      company: "all",
    });
    expect(byBadge.length).toBeGreaterThan(0);
    expect(byBadge[0].id).toBe("q-087");

    // Search with plain number 87
    const byPlainNum = filterInterviewQuestions(all, {
      search: "87",
      category: "all",
      difficulty: "all",
      status: "all",
      company: "all",
    });
    expect(byPlainNum.length).toBeGreaterThan(0);
    expect(byPlainNum[0].id).toBe("q-087");

    // Search with unpadded badge #87
    const byUnpaddedBadge = filterInterviewQuestions(all, {
      search: "#87",
      category: "all",
      difficulty: "all",
      status: "all",
      company: "all",
    });
    expect(byUnpaddedBadge.length).toBeGreaterThan(0);
    expect(byUnpaddedBadge[0].id).toBe("q-087");
  });

  it("filters questions by category", () => {
    const all = getAllInterviewQuestions();
    const filter: InterviewFilterState = {
      search: "",
      category: "concurrency",
      difficulty: "all",
      status: "all",
      company: "all",
    };

    const results = filterInterviewQuestions(all, filter);
    expect(results.length).toBeGreaterThan(0);
    for (const q of results) {
      expect(q.category).toBe("concurrency");
    }
  });

  it("filters questions by difficulty", () => {
    const all = getAllInterviewQuestions();
    const filter: InterviewFilterState = {
      search: "",
      category: "all",
      difficulty: "senior",
      status: "all",
      company: "all",
    };

    const results = filterInterviewQuestions(all, filter);
    expect(results.length).toBeGreaterThan(0);
    for (const q of results) {
      expect(q.difficulty).toBe("senior");
    }
  });

  it("filters questions by progress status", () => {
    const all = getAllInterviewQuestions();
    const mockProgress: InterviewProgressState = {
      learned: { "q-001": true },
      review: { "q-002": true },
      bookmarks: { "q-178": true },
    };

    const learnedResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "learned", company: "all" },
      mockProgress
    );
    expect(learnedResults.map((q) => q.id)).toEqual(["q-001"]);

    const reviewResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "review", company: "all" },
      mockProgress
    );
    expect(reviewResults.map((q) => q.id)).toEqual(["q-002"]);

    const bookmarkResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "bookmarked", company: "all" },
      mockProgress
    );
    expect(bookmarkResults.map((q) => q.id)).toEqual(["q-178"]);
  });
});
