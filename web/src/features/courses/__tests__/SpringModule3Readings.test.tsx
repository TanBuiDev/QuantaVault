import { describe, expect, it } from "vitest";
import { getCourseBySlug } from "@/lib/courses";
import { getSpringStudySections, parseSpringStudyMarkdown, transformBilingualMarkdown } from "../SpringStudyMarkdown";

const course = getCourseBySlug("spring-framework-for-java")!;
const lesson = (id: string) => course.lessons.find(item => item.id === id)!;

describe("Spring Module 3 bilingual readings", () => {
  it("keeps course metadata and the existing audio intact", () => {
    expect(course.lessons).toHaveLength(46);
    expect(lesson("lesson-42").lessonType).toBe("reading");
    expect(lesson("lesson-44").lessonType).toBe("reading-audio");
    expect(lesson("lesson-44").audioUrl).toBe("/audio/courses/spring-framework-for-java/lesson-44-summary.mp3");
    expect(lesson("lesson-46").lessonType).toBe("cheatsheet");
  });

  it.each(["lesson-42", "lesson-44", "lesson-46"])("%s has complete bilingual headings and paragraphs", id => {
    const md = lesson(id).contentMarkdown;
    expect(getSpringStudySections(md, "bilingual").length).toBeGreaterThanOrEqual(2);
    const blocks = parseSpringStudyMarkdown(md);
    expect(blocks.some(b => b.type === "pair")).toBe(true);
    expect(blocks.some(b => b.type === "bullets")).toBe(true);
    expect(transformBilingualMarkdown(md, "en")).not.toContain("**VI:**");
    expect(transformBilingualMarkdown(md, "vi")).not.toContain("**EN:**");
    expect(transformBilingualMarkdown(md, "en")).not.toContain("**Giải thích (VI):**");
    expect(transformBilingualMarkdown(md, "en")).not.toContain("**VI-NOTE:**");
  });

  it("preserves RBAC concepts and numbered headings", () => {
    const md = lesson("lesson-42").contentMarkdown;
    expect(md).toContain("### 4.1. Roles / Vai trò");
    expect(md).toContain("### 4.2. Permissions / Quyền");
    expect(md).toContain("### 4.3. Users / Người dùng");
    expect(md).toContain("### 4.4. Sessions / Phiên làm việc");
    expect(transformBilingualMarkdown(md, "vi")).toContain("### 4.4. Phiên làm việc");
  });

  it("retains module 3 summary and its nested ideas", () => {
    const md = lesson("lesson-44").contentMarkdown;
    expect(md).toContain("**EN:** Spring MVC enables building web applications using the Model-View-Controller design pattern and includes:");
    expect(md).toContain("- **EN:** Separation of application logic into Model, View, and Controller");
    expect(md).toContain("Secure session management and logout");
    expect(parseSpringStudyMarkdown(md).filter(b => b.type === "bullets").length).toBeGreaterThanOrEqual(7);
  });

  it("preserves 35 source code blocks, Spring Security compatibility notes, and the source preface", () => {
    const md = lesson("lesson-46").contentMarkdown;
    expect((md.match(/^```/gm) || []).length).toBe(70);
    expect(md).toContain("WebSecurityConfigurerAdapter");
    expect(md).toContain("new BCryptPasswordEncoder()");
    expect(md).toContain("SecurityFilterChain");
    expect(md).toContain("javax.persistence.*");
    expect(md).toContain("Các đoạn mã giữ nguyên nội dung gốc");
    expect(md).toContain("2025-02-15 · 0.1 · Rashi Kapur · Template created");
    expect(parseSpringStudyMarkdown(md).filter(b => b.type === "vi-only")).toHaveLength(41);
  });
});
