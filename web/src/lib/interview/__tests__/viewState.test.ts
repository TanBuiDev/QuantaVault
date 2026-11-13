import { beforeEach, describe, expect, it } from "vitest";
import {
  clearInterviewViewState,
  DEFAULT_INTERVIEW_FILTER,
  getInterviewViewState,
  INTERVIEW_VIEW_STORAGE_KEY,
  parseInterviewViewParams,
  saveInterviewViewState,
} from "../viewState";

describe("interview last-view navigation state", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    window.history.replaceState({}, "", "/interview");
  });

  it("remembers filters and view preferences when returning through plain navigation", () => {
    saveInterviewViewState({
      filter: { search: "volatile", category: "concurrency", difficulty: "junior", status: "review", company: "FPT Software" },
      pageSize: 100,
      currentPage: 3,
      recallMode: "answers",
    });
    window.history.replaceState({}, "", "/interview?auth=connected&edit=true");
    expect(getInterviewViewState()).toEqual({
      filter: { search: "volatile", category: "concurrency", difficulty: "junior", status: "review", company: "FPT Software" },
      pageSize: 100, currentPage: 3, recallMode: "answers",
    });
    expect(localStorage.length).toBe(0);
  });

  it("prioritizes an explicit shared URL without mixing it with stored filters", () => {
    saveInterviewViewState({
      filter: { ...DEFAULT_INTERVIEW_FILTER, difficulty: "junior", search: "stored" },
      pageSize: 30, currentPage: 4, recallMode: "answers",
    });
    window.history.replaceState({}, "", "/interview?edit=true&difficulty=senior");
    expect(getInterviewViewState()).toEqual({
      filter: { ...DEFAULT_INTERVIEW_FILTER, difficulty: "senior" },
      pageSize: 15, currentPage: 1, recallMode: "summaries",
    });
  });

  it("clears saved filters on reset without modifying unrelated local preferences", () => {
    localStorage.setItem("theme", "dark");
    saveInterviewViewState({
      filter: { ...DEFAULT_INTERVIEW_FILTER, difficulty: "junior" },
      pageSize: 15, currentPage: 1, recallMode: "summaries",
    });
    clearInterviewViewState();
    expect(sessionStorage.getItem(INTERVIEW_VIEW_STORAGE_KEY)).toBeNull();
    expect(getInterviewViewState().filter).toEqual(DEFAULT_INTERVIEW_FILTER);
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("validates malformed filter params and accepts 100 questions per page", () => {
    expect(parseInterviewViewParams(new URLSearchParams("category=bad&difficulty=bad&status=bad&page=-5&size=abc"))).toEqual({
      filter: DEFAULT_INTERVIEW_FILTER, currentPage: 1, pageSize: 15, recallMode: "summaries",
    });
    const legacy = parseInterviewViewParams(new URLSearchParams("size=100&page=2&q=java"));
    expect(legacy.pageSize).toBe(100);
    expect(legacy.currentPage).toBe(2);
    expect(legacy.filter.search).toBe("java");
  });
});
