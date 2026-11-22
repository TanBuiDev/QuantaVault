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
    expect(course?.totalLessons).toBe(46);
    expect(course?.chapters).toHaveLength(3);
    expect(course?.lessons).toHaveLength(46);
  });

  it("keeps both source and website course manifests byte-for-byte identical", () => {
    expect(readFileSync(webManifestPath, "utf8")).toBe(readFileSync(sourceManifestPath, "utf8"));
  });

  it("ensures all lessons have complete metadata, video IDs, flashcards and transcripts", () => {
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
    expect(lessons[1].contentMarkdown).toContain("So sánh trực diện qua Code thực tế");

    // Lesson 3
    expect(lessons[2].id).toBe("lesson-03");
    expect(lessons[2].videoId).toBe("hFuleFszKcA");
    expect(lessons[2].flashcards?.length).toBeGreaterThanOrEqual(8);
    expect(lessons[2].transcript?.length).toBeGreaterThanOrEqual(50);
    expect(lessons[2].contentMarkdown).toContain("Inversion of Control (IoC) và Dependency Injection (DI)");

    // Lesson 4
    expect(lessons[3].id).toBe("lesson-04");
    expect(lessons[3].flashcards?.length).toBeGreaterThanOrEqual(8);
    expect(lessons[3].transcript?.length).toBeGreaterThanOrEqual(50);

    // Lesson 5 (Practice Quiz)
    expect(lessons[4].id).toBe("lesson-05");
    expect(lessons[4].flashcards?.length).toBeGreaterThanOrEqual(30);

    // Lesson 10 (Practice Quiz Fundamentals)
    expect(lessons[9].id).toBe("lesson-10");
    expect(lessons[9].flashcards?.length).toBeGreaterThanOrEqual(70);

    // Lesson 14 (Graded Quiz Module 1)
    expect(lessons[13].id).toBe("lesson-14");
    expect(lessons[13].flashcards?.length).toBeGreaterThanOrEqual(70);

    // Module 2: Lesson 15 (Intro to Spring Boot)
    expect(lessons[14].id).toBe("lesson-15");
    expect(lessons[14].videoId).toBe("8nZkOMkIUUI");
    expect(lessons[14].flashcards?.length).toBeGreaterThanOrEqual(8);
    expect(lessons[14].transcript?.length).toBeGreaterThanOrEqual(50);

    // Module 2: Lesson 30 (Graded Quiz Deep Dive)
    expect(lessons[29].id).toBe("lesson-30");
    expect(lessons[29].flashcards?.length).toBeGreaterThanOrEqual(80);

    // Module 3: Lesson 32 (Intro to Spring MVC)
    expect(lessons[31].id).toBe("lesson-32");
    expect(lessons[31].videoId).toBe("s2wf8WIwZEM");
    expect(lessons[31].flashcards?.length).toBeGreaterThanOrEqual(8);
    expect(lessons[31].transcript?.length).toBeGreaterThanOrEqual(80);

    // The supplied bilingual transcripts for lessons 39–41 stay aligned with their videos.
    for (const [id, count, keyTerms] of [
      ["lesson-39", 64, ["Authentication", "CSRF", "OAuth 2.0"]],
      ["lesson-40", 66, ["Spring Initializr", "RBAC", "@PreAuthorize"]],
      ["lesson-41", 71, ["Form-Based", "PasswordEncoder", "BCrypt"]]
    ] as const) {
      const lesson = lessons.find((item) => item.id === id);
      expect(lesson?.lessonType).toBe("video");
      expect(lesson?.transcript).toHaveLength(count);
      expect(lesson?.videoId).toBeTruthy();
      expect(lesson?.contentMarkdown).toContain("## 1. Overview & Learning Goals /");
      expect(lesson?.contentMarkdown).toContain("Key Takeaways /");
      expect(lesson?.contentMarkdown).not.toContain("are being updated");
      for (const term of keyTerms) expect(lesson?.contentMarkdown, id).toContain(term);
      expect((lesson?.contentMarkdown.match(/^\*\*EN:\*\*/gm) || []).length)
        .toBe((lesson?.contentMarkdown.match(/^\*\*VI:\*\*/gm) || []).length);
    }

    // Module 3: Lesson 45 (Graded Quiz MVC & Security)
    expect(lessons[44].id).toBe("lesson-45");
    expect(lessons[44].flashcards?.length).toBeGreaterThanOrEqual(68);
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
    expect(l3?.nextLesson?.id).toBe("lesson-04");

    const l14 = getCourseLesson("spring-framework-for-java", "lesson-14");
    expect(l14?.prevLesson?.id).toBe("lesson-13");
    expect(l14?.nextLesson?.id).toBe("lesson-15");

    const l15 = getCourseLesson("spring-framework-for-java", "lesson-15");
    expect(l15?.prevLesson?.id).toBe("lesson-14");
    expect(l15?.nextLesson?.id).toBe("lesson-16");

    const l46 = getCourseLesson("spring-framework-for-java", "lesson-46");
    expect(l46?.prevLesson?.id).toBe("lesson-45");
    expect(l46?.nextLesson).toBeUndefined();
  });
});
