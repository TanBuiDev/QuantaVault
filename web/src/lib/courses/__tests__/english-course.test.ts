import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getAllCourses, getCourseBySlug, getCourseLesson } from "../index";

type SourceQuestion = {
  id: string;
  part: "I" | "II";
  number: number;
  filepath: string;
  lessonId: string;
  chapterId: string;
  questionEnglish: string;
  pages: number[];
};

const sourceRoot = resolve(process.cwd(), "..", "data", "courses", "english-job-interview");
const webManifestPath = resolve(process.cwd(), "src", "data", "courses", "english-job-interview", "course.json");
const sourceManifestPath = resolve(sourceRoot, "course.json");
const questionIndex = JSON.parse(readFileSync(resolve(sourceRoot, "question-index.json"), "utf8")) as SourceQuestion[];
const course = getCourseBySlug("english-job-interview");

describe("English job interview: original PDF -> Markdown -> website", () => {
  it("adds the English course without modifying PostgreSQL or Redis", () => {
    const registry = getAllCourses();
    expect(registry.map((c) => c.slug)).toEqual([
      "postgres-for-java", "redis-for-java", "english-job-interview"
    ]);
    expect(registry[0].lessons).toHaveLength(20);
    expect(registry[1].lessons).toHaveLength(10);
    expect(course).toBeDefined();
    expect(course?.chapters).toHaveLength(8);
    expect(course?.lessons).toHaveLength(18);
    expect(course?.totalLessons).toBe(18);
  });

  it("keeps both source and website course manifests byte-for-byte identical", () => {
    expect(readFileSync(webManifestPath, "utf8")).toBe(readFileSync(sourceManifestPath, "utf8"));
  });

  it("preserves every one of the 155 original numbered questions", () => {
    expect(questionIndex).toHaveLength(155);
    expect(new Set(questionIndex.map((q) => q.id)).size).toBe(155);
    expect(questionIndex.filter((q) => q.part === "I")).toHaveLength(128);
    expect(questionIndex.filter((q) => q.part === "II")).toHaveLength(27);

    const duplicate52 = questionIndex.filter((q) => q.part === "I" && q.number === 52);
    expect(duplicate52.map((q) => q.id).sort()).toEqual([
      "interview-en-i-052a", "interview-en-i-052b"
    ]);

    for (const question of questionIndex) {
      expect(question.filepath).toMatch(/^questions\/part-0[12]\/q-[\da-z]+\.md$/);
      const markdown = readFileSync(resolve(sourceRoot, question.filepath), "utf8");
      expect(markdown).toContain("id: " + question.id);
      expect(markdown).toContain("# " + question.questionEnglish);
      expect(markdown).toContain("**Tiếng Việt:**");
      expect(question.pages.length).toBeGreaterThan(0);
    }
  });

  it("maps 18 standalone Markdown lessons to their chapter, order and source", () => {
    const lessonIds = course!.lessons.map((lesson) => lesson.id);
    expect(lessonIds).toEqual(Array.from({ length: 18 }, (_, i) => "lesson-" + String(i + 1).padStart(2, "0")));
    const flattenedChapters = course!.chapters.flatMap((ch) => ch.lessonIds);
    expect(flattenedChapters).toEqual(lessonIds);
    const headings = course!.lessons.reduce((count, lesson) => {
      const file = readFileSync(resolve(sourceRoot, "lessons", lesson.id + ".md"), "utf8");
      expect(file).toBe(lesson.contentMarkdown);
      expect(lesson.contentMarkdown.length).toBeGreaterThan(1000);
      expect(lesson.title.length).toBeGreaterThan(10);
      expect(lesson.summary.length).toBeGreaterThan(25);
      expect(questionIndex.some((q) => q.lessonId === lesson.id && q.chapterId === lesson.chapterId)).toBe(true);
      const unsafeFence = new RegExp(String.fromCharCode(96).repeat(3) + "[^\\n]*\\bid\\s*=", "i");
      expect(lesson.contentMarkdown).not.toMatch(unsafeFence);
      return count + (lesson.contentMarkdown.match(/^## /gm) || []).length;
    }, 0);
    expect(headings).toBe(155);
  });

  it("navigates the first and last English lesson correctly", () => {
    const first = getCourseLesson("english-job-interview", "lesson-01");
    const last = getCourseLesson("english-job-interview", "lesson-18");
    expect(first?.prevLesson).toBeUndefined();
    expect(first?.nextLesson?.id).toBe("lesson-02");
    expect(last?.prevLesson?.id).toBe("lesson-17");
    expect(last?.nextLesson).toBeUndefined();
  });
});
