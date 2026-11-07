import { describe, expect, it } from "vitest";
import mermaid from "mermaid";
import { getAllCourses, getCourseBySlug, getCourseLesson } from "../index";

const course = getCourseBySlug("redis-for-java");
const fence = String.fromCharCode(96).repeat(3);

describe("Redis Java course integrity", () => {
  it("registers Redis as a second course without replacing PostgreSQL", () => {
    const courses = getAllCourses();
    expect(courses.map((c) => c.slug)).toContain("postgres-for-java");
    expect(courses.map((c) => c.slug)).toContain("redis-for-java");
    const postgres = getCourseBySlug("postgres-for-java");
    expect(postgres?.lessons).toHaveLength(20);
    expect(course).toBeDefined();
    expect(course?.lessons).toHaveLength(10);
    expect(course?.totalLessons).toBe(10);
  });

  it("has a consistent lesson and chapter map with stable IDs", () => {
    expect(course).toBeDefined();
    const lessons = course!.lessons;
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(10);
    expect(new Set(lessons.map((l) => l.slug)).size).toBe(10);
    const chapterIds = new Set(course!.chapters.map((c) => c.id));
    const mappedIds = course!.chapters.flatMap((c) => c.lessonIds);
    expect(mappedIds).toEqual(ids);
    lessons.forEach((lesson, i) => {
      expect(lesson.id).toBe("lesson-" + String(i + 1).padStart(2, "0"));
      expect(lesson.number).toBe(i + 1);
      expect(chapterIds.has(lesson.chapterId)).toBe(true);
      expect(lesson.title.length).toBeGreaterThan(12);
      expect(lesson.summary.length).toBeGreaterThan(40);
      expect(lesson.contentMarkdown.length).toBeGreaterThan(1300);
    });
    const first = getCourseLesson("redis-for-java", "lesson-01");
    const last = getCourseLesson("redis-for-java", "lesson-10");
    expect(first?.prevLesson).toBeUndefined();
    expect(first?.nextLesson?.id).toBe("lesson-02");
    expect(last?.prevLesson?.id).toBe("lesson-09");
    expect(last?.nextLesson).toBeUndefined();
  });

  it("covers each of the 40 source interview topics exactly once", () => {
    const topics = course!.lessons.flatMap((lesson) => {
      const match = lesson.contentMarkdown.match(/các chủ đề số ([\d, ]+)\./);
      expect(match, "missing source-topic mapping for " + lesson.id).not.toBeNull();
      return match![1].split(",").map((n) => Number(n.trim()));
    });
    expect(topics).toHaveLength(40);
    expect(topics.slice().sort((a, b) => a - b)).toEqual(
      Array.from({ length: 40 }, (_, i) => i + 1)
    );
  });

  it("does not include unsafe metadata on fenced code blocks", () => {
    const unsafeInfo = new RegExp(fence + "[^\\n]*\\bid\\s*=", "i");
    course!.lessons.forEach((lesson) => {
      expect(lesson.contentMarkdown).not.toMatch(unsafeInfo);
    });
  });
});

const mermaidFence = new RegExp(fence + "mermaid\\s*([\\s\\S]*?)" + fence, "g");
const diagrams = (course?.lessons ?? []).flatMap((lesson) =>
  [...lesson.contentMarkdown.matchAll(mermaidFence)].map((m, i) => ({
    name: lesson.id + " diagram " + (i + 1),
    chart: m[1]
  }))
);

describe("Redis course Mermaid compatibility", () => {
  it("contains non-empty diagrams to verify", () => {
    expect(diagrams.length).toBeGreaterThanOrEqual(3);
  });

  it.each(diagrams)("parses $name using strict mode", async ({ chart }) => {
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict", htmlLabels: false });
    await expect(mermaid.parse(chart)).resolves.toBeTruthy();
  });
});
