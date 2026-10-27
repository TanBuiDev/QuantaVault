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
    const question = getInterviewQuestionById("q-54");
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
    expect(results.some((q) => q.id === "q-170")).toBe(true);
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
      learned: { "q-3": true },
      review: { "q-4": true },
      bookmarks: { "q-170": true },
    };

    const learnedResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "learned", company: "all" },
      mockProgress
    );
    expect(learnedResults.map((q) => q.id)).toEqual(["q-3"]);

    const reviewResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "review", company: "all" },
      mockProgress
    );
    expect(reviewResults.map((q) => q.id)).toEqual(["q-4"]);

    const bookmarkResults = filterInterviewQuestions(
      all,
      { search: "", category: "all", difficulty: "all", status: "bookmarked", company: "all" },
      mockProgress
    );
    expect(bookmarkResults.map((q) => q.id)).toEqual(["q-170"]);
  });
});
