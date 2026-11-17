import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCourseBySlug, getCourseLesson } from "../index";

const webManifestPath = resolve(process.cwd(), "src", "data", "courses", "spring-framework-for-java", "course.json");
const sourceManifestPath = resolve(process.cwd(), "..", "data", "courses", "spring-framework-for-java", "course.json");

describe("Spring Framework for Java Course", () => {
  const course = getCourseBySlug("spring-framework-for-java");

  it("loads the Spring Framework course manifest properly", () => {
    expect(course).toBeDefined();
    expect(course?.slug).toBe("spring-framework-for-java");
    expect(course?.title).toBe("Spring Framework for Java Development");
    expect(course?.totalLessons).toBe(3);
    expect(course?.chapters).toHaveLength(1);
    expect(course?.lessons).toHaveLength(3);
  });

  it("keeps both source and website course manifests byte-for-byte identical", () => {
    expect(readFileSync(webManifestPath, "utf8")).toBe(readFileSync(sourceManifestPath, "utf8"));
  });

  it("ensures all 3 lessons have complete metadata, video IDs, flashcards and transcripts", () => {
    expect(course?.lessons).toBeDefined();
    const lessons = course!.lessons;

    // Lesson 1
    expect(lessons[0].id).toBe("lesson-01");
    expect(lessons[0].videoId).toBe("X4Pho7r5sDg");
    expect(lessons[0].flashcards?.length).toBeGreaterThanOrEqual(4);
    expect(lessons[0].transcript?.length).toBeGreaterThanOrEqual(10);
    expect(lessons[0].contentMarkdown).toContain("Bản đồ lộ trình học tập toàn diện");

    // Lesson 2
    expect(lessons[1].id).toBe("lesson-02");
    expect(lessons[1].videoId).toBe("-PAN_jBSMLk");
    expect(lessons[1].flashcards?.length).toBeGreaterThanOrEqual(10);
    expect(lessons[1].transcript?.length).toBeGreaterThanOrEqual(50);
    expect(lessons[1].contentMarkdown).toContain("Bảng so sánh chuyên sâu: EJB (Cũ) vs Spring Framework (Mới)");

    // Lesson 3
    expect(lessons[2].id).toBe("lesson-03");
    expect(lessons[2].videoId).toBe("hFuleFszKcA");
    expect(lessons[2].flashcards?.length).toBeGreaterThanOrEqual(8);
    expect(lessons[2].transcript?.length).toBeGreaterThanOrEqual(50);
    expect(lessons[2].contentMarkdown).toContain("Inversion of Control (IoC) và Dependency Injection (DI)");
  });

  it("correctly resolves previous and next lesson navigation", () => {
    const l1 = getCourseLesson("spring-framework-for-java", "lesson-01");
    expect(l1?.prevLesson).toBeUndefined();
    expect(l1?.nextLesson?.id).toBe("lesson-02");

    const l2 = getCourseLesson("spring-framework-for-java", "lesson-02");
    expect(l2?.prevLesson?.id).toBe("lesson-01");
    expect(l2?.nextLesson?.id).toBe("lesson-03");

    const l3 = getCourseLesson("spring-framework-for-java", "lesson-03");
    expect(l3?.prevLesson?.id).toBe("lesson-02");
    expect(l3?.nextLesson).toBeUndefined();
  });
});
