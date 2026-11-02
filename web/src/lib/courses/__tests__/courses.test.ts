import { describe, expect, it } from "vitest";
import { getAllCourses, getCourseBySlug, getCourseLesson } from "../index";

describe("Courses Library", () => {
  it("loads all configured courses", () => {
    const courses = getAllCourses();
    expect(courses.length).toBeGreaterThanOrEqual(1);

    const pgCourse = courses.find((c) => c.slug === "postgres-for-java");
    expect(pgCourse).toBeDefined();
    expect(pgCourse?.totalLessons).toBe(20);
    expect(pgCourse?.chapters.length).toBe(5);
  });

  it("retrieves a course by slug", () => {
    const course = getCourseBySlug("postgres-for-java");
    expect(course).toBeDefined();
    expect(course?.title).toBe("Database & PostgreSQL cho Java Backend");
    expect(course?.lessons.length).toBe(20);
  });

  it("returns undefined for non-existent course slug", () => {
    const course = getCourseBySlug("non-existent-course");
    expect(course).toBeUndefined();
  });

  it("resolves the first lesson with chapter title and next lesson", () => {
    const data = getCourseLesson("postgres-for-java", "lesson-01");
    expect(data).toBeDefined();
    expect(data?.lesson.id).toBe("lesson-01");
    expect(data?.lesson.number).toBe(1);
    expect(data?.chapterTitle).toContain("Phần 1");
    expect(data?.prevLesson).toBeUndefined();
    expect(data?.nextLesson).toBeDefined();
    expect(data?.nextLesson?.id).toBe("lesson-02");
  });

  it("resolves the last lesson with previous lesson and no next lesson", () => {
    const data = getCourseLesson("postgres-for-java", "lesson-20");
    expect(data).toBeDefined();
    expect(data?.lesson.id).toBe("lesson-20");
    expect(data?.lesson.number).toBe(20);
    expect(data?.chapterTitle).toContain("Phần 5");
    expect(data?.prevLesson).toBeDefined();
    expect(data?.prevLesson?.id).toBe("lesson-19");
    expect(data?.nextLesson).toBeUndefined();
  });

  it("returns undefined for non-existent lesson ID", () => {
    const data = getCourseLesson("postgres-for-java", "lesson-999");
    expect(data).toBeUndefined();
  });
});
