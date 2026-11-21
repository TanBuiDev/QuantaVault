import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { getCourseBySlug } from "@/lib/courses";
import { SpringReadingStudio } from "../SpringReadingStudio";
import { getLessonQuiz, springQuizRegistry } from "../quizData";

const expectedCounts: Record<string, number> = {
  "lesson-05": 10, "lesson-10": 10, "lesson-14": 10,
  "lesson-21": 5, "lesson-28": 5, "lesson-30": 10,
  "lesson-38": 5, "lesson-43": 5, "lesson-45": 10
};
const expectedAnswerIds: Record<string, string> = {
  "lesson-14": "BBDCCCCDBA",
  "lesson-21": "BDBCB",
  "lesson-28": "AABBA",
  "lesson-30": "CAADDDDCAC",
  "lesson-38": "DCDCB",
  "lesson-43": "DBCBD",
  "lesson-45": "CCCCDDCCCC"
};

describe("generated Spring quiz integrity", () => {
  it("covers exactly 9 lessons and 70 questions", () => {
    const course = getCourseBySlug("spring-framework-for-java");
    expect(course).toBeDefined();
    expect(Object.keys(springQuizRegistry).sort()).toEqual(Object.keys(expectedCounts).sort());
    expect(Object.values(springQuizRegistry).reduce((sum, questions) => sum + questions.length, 0)).toBe(70);
    for (const id of Object.keys(expectedCounts)) {
      expect(course?.lessons.find(lesson => lesson.id === id)?.lessonType).toBe("quiz");
      expect(getLessonQuiz(id)).toHaveLength(expectedCounts[id]);
    }
  });

  it.each(Object.keys(expectedCounts))("%s has valid bilingual questions, choices and grading", id => {
    const questions = springQuizRegistry[id];
    const ids = new Set<string>();
    questions.forEach((q, index) => {
      expect(q.number).toBe(index + 1);
      expect(q.questionEn.trim()).not.toBe("");
      expect(q.questionVi.trim()).not.toBe("");
      expect(q.questionEn).not.toMatch(/\*\*EN:|\*\*VI:/);
      expect(q.options.map(option => option.id)).toEqual(["A", "B", "C", "D"]);
      expect(q.options.filter(option => option.isCorrect)).toHaveLength(1);
      q.options.forEach(option => {
        expect(option.textEn.trim()).not.toBe("");
        expect(option.textVi.trim()).not.toBe("");
      });
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);
    });
  });

  it.each(Object.entries(expectedAnswerIds))("%s matches the source answer key", (id, answers) => {
    expect(springQuizRegistry[id].map(q => q.options.find(o => o.isCorrect)?.id).join("")).toBe(answers);
  });

  it("links lesson 38 graded evidence to 100% Coursera feedback without claiming a clicked choice", () => {
    const lesson = getCourseBySlug("spring-framework-for-java")!.lessons.find(l => l.id === "lesson-38")!;
    expect(lesson.contentMarkdown).toMatch(/Your grade: 100%/);
    expect((lesson.contentMarkdown.match(/\*\*EN:\*\* Nice work/g) || [])).toHaveLength(5);
    expect(springQuizRegistry["lesson-38"].map(q => q.answerProvenance)).toEqual(Array(5).fill("graded-evidence"));
    expect(springQuizRegistry["lesson-38"].map(q => q.options.find(o => o.isCorrect)?.id).join("")).toBe("DCDCB");
  });

  it("keeps question 5 of lesson 28 and lesson 14 as study analysis", () => {
    expect(springQuizRegistry["lesson-28"][4].answerProvenance).toBe("study-analysis");
    expect(springQuizRegistry["lesson-14"].every(q => q.answerProvenance === "study-analysis")).toBe(true);
  });

  it("retains answer provenance instead of claiming every answer is Coursera-confirmed", () => {
    expect(springQuizRegistry["lesson-14"].every(q => q.answerProvenance === "study-analysis")).toBe(true);
    expect(springQuizRegistry["lesson-38"].every(q => q.answerProvenance === "graded-evidence")).toBe(true);
    expect(springQuizRegistry["lesson-30"].every(q => q.answerProvenance === "coursera")).toBe(true);
    expect(springQuizRegistry["lesson-28"][4].answerProvenance).toBe("study-analysis");
  });
});

describe("real quiz rendering and grading", () => {
  beforeEach(() => window.sessionStorage.removeItem("spring_reading_lang_mode"));
  function renderQuiz(id: string) {
    const lesson = getCourseBySlug("spring-framework-for-java")!.lessons.find(l => l.id === id)!;
    render(<SpringReadingStudio lesson={lesson} quizQuestions={getLessonQuiz(id)} />);
  }

  it("restores four options in lesson 38 and never praises an incorrect selection", () => {
    renderQuiz("lesson-38");
    const q = springQuizRegistry["lesson-38"][0];
    const card = document.getElementById("quiz-q-1")!;
    expect(within(card).getByText(q.questionEn)).toBeInTheDocument();
    q.options.forEach(o => expect(within(card).getByText(o.textEn)).toBeInTheDocument());
    expect(screen.queryByText(/\*\*EN:/)).not.toBeInTheDocument();
    fireEvent.click(within(card).getByText(q.options[0].textEn).closest("button")!);
    expect(within(card).getByText("Chưa chính xác")).toBeInTheDocument();
    expect(screen.queryByText("Nice work")).not.toBeInTheDocument();
    expect(screen.getByText(/Nguồn bài quiz: kết quả Coursera 100%/)).toBeInTheDocument();
    expect(within(card).getByText("Đáp án đúng")).toBeInTheDocument();
    expect(screen.queryByText(/chưa được Coursera xác nhận riêng cho câu này/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Làm lại bài tập"));
    expect(screen.queryByText("Chưa chính xác")).not.toBeInTheDocument();
  });

  it.each(["lesson-14", "lesson-30", "lesson-43", "lesson-45"])("%s grades a correct answer", id => {
    renderQuiz(id);
    const q = springQuizRegistry[id][0];
    const correct = q.options.find(o => o.isCorrect)!;
    const card = document.getElementById("quiz-q-1")!;
    fireEvent.click(within(card).getByText(correct.textEn).closest("button")!);
    expect(within(card).getByText("Chính xác (+1)")).toBeInTheDocument();
  });

  it("switches lesson 43 between all three language modes", () => {
    renderQuiz("lesson-43");
    const q = springQuizRegistry["lesson-43"][0];
    const card = document.getElementById("quiz-q-1")!;
    fireEvent.click(screen.getByRole("button", { name: "Tiếng Việt" }));
    expect(within(card).getByText(q.questionVi)).toBeInTheDocument();
    expect(within(card).queryByText(q.questionEn)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tiếng Anh" }));
    expect(within(card).getByText(q.questionEn)).toBeInTheDocument();
    expect(within(card).queryByText(q.questionVi)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Song ngữ" }));
    expect(within(card).getByText(q.questionEn)).toBeInTheDocument();
    expect(within(card).getByText(q.questionVi)).toBeInTheDocument();
  });

  it("refuses to grade structurally broken quiz data", () => {
    const id = "lesson-38";
    const lesson = getCourseBySlug("spring-framework-for-java")!.lessons.find(l => l.id === id)!;
    const broken = [{...springQuizRegistry[id][0], options:[{id:"A",textEn:"Broken",textVi:"Lỗi",isCorrect:false}]}];
    render(<SpringReadingStudio lesson={lesson} quizQuestions={broken} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Chấm điểm đã được tạm tắt");
    expect(screen.queryByText("Broken")).not.toBeInTheDocument();
  });
});
