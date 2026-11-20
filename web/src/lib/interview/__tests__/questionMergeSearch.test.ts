import { describe, expect, it } from "vitest";
import { getAllInterviewQuestions, getInterviewQuestionById, filterInterviewQuestions, interviewMatchesCategory } from "../index";
import type { InterviewFilterState } from "../types";

const filters: InterviewFilterState = {
  search: "", category: "all", difficulty: "all", status: "all", company: "all",
};

describe("published 504-question bank with preserved historic links", () => {
  const questions = getAllInterviewQuestions();

  it("contains exactly 504 unique canonical questions", () => {
    expect(questions).toHaveLength(504);
    expect(new Set(questions.map(q => q.id)).size).toBe(504);
    expect(questions.some(q => q.id === "q-194")).toBe(false);
    expect(questions.some(q => q.id === "q-193")).toBe(true);
  });

  it("does not guess a destination for retired or ambiguous IDs", () => {
    expect(getInterviewQuestionById("q-194")).toBeUndefined();
    expect(getInterviewQuestionById("q-024")).toBeUndefined();
    expect(getInterviewQuestionById("q-999")).toBeUndefined();
  });

  it.each(["q-194", "#194", "194"])("does not silently search another question for retired ID (%s)", search => {
    expect(filterInterviewQuestions(questions, { ...filters, search })).toEqual([]);
  });

  it("retains both source categories for cross-category merged questions", () => {
    const spring = getInterviewQuestionById("q-007")!;
    const docker = getInterviewQuestionById("q-487")!;
    expect(interviewMatchesCategory(spring, "project-covie")).toBe(true);
    expect(interviewMatchesCategory(spring, "spring")).toBe(true);
    expect(interviewMatchesCategory(docker, "microservices")).toBe(true);
    expect(filterInterviewQuestions(questions, { ...filters, category: "spring" }).some(q => q.id === "q-007")).toBe(true);
    expect(filterInterviewQuestions(questions, { ...filters, category: "microservices" }).some(q => q.id === "q-487")).toBe(true);
  });

  it("keeps independent interview questions unrelated to the merges", () => {
    expect(getInterviewQuestionById("q-101")?.id).toBe("q-101");
    expect(getInterviewQuestionById("q-412")?.id).toBe("q-412");
    expect(getInterviewQuestionById("q-407")?.id).toBe("q-407");
  });
});
