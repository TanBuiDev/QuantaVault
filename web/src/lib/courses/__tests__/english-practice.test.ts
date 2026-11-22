import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCourseBySlug } from "../index";
import {
  filterPracticeCards,
  getPracticeCards,
  practiceQuestions,
  practiceScoreKey,
  readPracticeScores,
  writePracticeScores
} from "../englishPractice";
import { cleanTextForSpeech } from "../speech";

const root = resolve(process.cwd(), "..", "data", "courses", "english-job-interview");
const manifest = getCourseBySlug("english-job-interview")!;

describe("English interview practice: canonical source, bilingual UX and safe progress", () => {
  beforeEach(() => localStorage.clear());

  it("publishes the 24 approved questions in lessons 01–06 while preserving all later source questions", () => {
    // Original source remains at 155 questions and 348 answers; practice overlays only the first six lessons.
    expect(practiceQuestions).toHaveLength(134);
    expect(new Set(practiceQuestions.map((q) => q.id)).size).toBe(134);
    expect(getPracticeCards("all", "question")).toHaveLength(134);
    expect(getPracticeCards("all", "answer")).toHaveLength(238);
    for (const [lessonId, count] of Object.entries({
      "lesson-01": 7, "lesson-02": 6, "lesson-03": 2,
      "lesson-04": 2, "lesson-05": 3, "lesson-06": 4
    })) {
      const questions = practiceQuestions.filter((q) => q.lessonId === lessonId);
      expect(questions).toHaveLength(count);
      for (const question of questions) {
        expect(question.id).toMatch(/^personal-lesson-0[1-6]-\d{2}$/);
        expect(question.answers).toHaveLength(1);
        expect(question.answers[0].en.split(/\n\s*\n/).length).toBe(
          question.answers[0].vi.split(/\n\s*\n/).length
        );
      }
    }
    expect(practiceQuestions.filter((q) => q.id.includes("-052"))).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "interview-en-i-052a" }),
        expect.objectContaining({ id: "interview-en-i-052b" })])
    );
  });

  it("does not invent answers where the source has none", () => {
    expect(practiceQuestions.find((q) => q.id === "interview-en-i-117")?.answers).toHaveLength(0);
    for (const q of practiceQuestions.filter((q) => q.id.startsWith("interview-en-ii-"))) {
      expect(q.answers).toHaveLength(0);
    }
    expect(practiceQuestions.filter((q) => q.id.startsWith("interview-en-ii-"))).toHaveLength(27);
    expect(getPracticeCards("lesson-16", "answer")).toHaveLength(0);
    expect(getPracticeCards("lesson-16", "question")).toHaveLength(9);
  });

  it("keeps source and website practice datasets byte-for-byte identical", () => {
    const original = readFileSync(resolve(root, "practice.json"), "utf8");
    const mirror = readFileSync(resolve(process.cwd(), "src/data/courses/english-job-interview/practice.json"), "utf8");
    expect(mirror).toBe(original);
  });

  it("renders clean public Markdown with English and Vietnamese titles and no PDF references", () => {
    expect(manifest.lessons).toHaveLength(18);
    for (const lesson of manifest.lessons) {
      expect(lesson.titleEn?.length).toBeGreaterThan(10);
      if (lesson.number <= 6) {
        expect(lesson.contentMarkdown).toContain(" / " + lesson.title);
      } else {
        expect(lesson.contentMarkdown).toContain("**Tiếng Việt:** " + lesson.title);
      }
      expect(lesson.contentMarkdown).toContain(lesson.titleEn);
      expect(lesson.contentMarkdown).not.toMatch(/PDF|Nguồn: PDF|Nội dung gồm .*mục câu hỏi từ/);
    }
    expect(manifest.author).not.toMatch(/PDF/);
    expect(manifest.chapters.every((ch) => Boolean(ch.titleEn) && !/PDF/.test(ch.description || ""))).toBe(true);
  });

  it("persists practice assessments independently from all existing learning and draft keys", () => {
    const protectedKeys = ["quantavault-course-progress:v1", "interview_drafts_v1", "interview-prep-progress-v1"];
    for (const key of protectedKeys) localStorage.setItem(key, "retain:" + key);
    const card = getPracticeCards("lesson-01", "question")[0];
    const scoreKey = practiceScoreKey(card.id, "vi-en");
    writePracticeScores({ [scoreKey]: "review" });
    expect(readPracticeScores()[scoreKey]).toBe("review");
    for (const key of protectedKeys) expect(localStorage.getItem(key)).toBe("retain:" + key);
    expect(readPracticeScores()).not.toHaveProperty(practiceScoreKey(card.id, "en-vi"));
  });

  it("recovers gracefully from corrupted practice-only localStorage", () => {
    localStorage.setItem("quantavault-english-practice:v1", "not-json");
    expect(readPracticeScores()).toEqual({});
  });

  it("filters practice cards by status cleanly without mutating original array", () => {
    const cards = getPracticeCards("lesson-01", "question");
    const scores = {
      [practiceScoreKey(cards[0].id, "vi-en")]: "remembered" as const,
      [practiceScoreKey(cards[1].id, "vi-en")]: "review" as const
    };
    expect(filterPracticeCards(cards, "vi-en", scores, "all")).toHaveLength(cards.length);
    expect(filterPracticeCards(cards, "vi-en", scores, "remembered")).toHaveLength(1);
    expect(filterPracticeCards(cards, "vi-en", scores, "review")).toHaveLength(1);
    expect(filterPracticeCards(cards, "vi-en", scores, "unreviewed")).toHaveLength(cards.length - 2);
  });

  it("cleans markdown and formatting symbols before text-to-speech utterance", () => {
    expect(cleanTextForSpeech("### Question 1: What is **OOP**?")).toBe("Question 1: What is OOP?");
    expect(cleanTextForSpeech("Visit [link](https://example.com) for `code` details.")).toBe(
      "Visit link for code details."
    );
  });
});
