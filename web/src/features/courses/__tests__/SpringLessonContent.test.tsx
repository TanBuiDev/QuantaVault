import "@testing-library/jest-dom/vitest";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringLessonContent } from "../SpringLessonContent";
import type { CourseLesson, CourseManifest } from "@/lib/courses";

const mockSpringCourse: CourseManifest = {
  id: "spring-framework-for-java",
  slug: "spring-framework-for-java",
  title: "Spring Framework for Java Development",
  tagline: "Test course tagline",
  icon: "Leaf",
  badge: "Spring Core",
  level: "Beginner",
  totalLessons: 1,
  chapters: [
    {
      id: "ch-01",
      title: "Chương 1",
      lessonIds: ["lesson-01"]
    }
  ],
  lessons: [
    {
      id: "lesson-01",
      slug: "lesson-01",
      number: 1,
      chapterId: "ch-01",
      title: "Bài 1: Tổng quan Spring",
      titleEn: "Course Introduction",
      summary: "Tóm tắt bài 1",
      durationMinutes: 10,
      tags: ["Spring", "Java"],
      videoId: "X4Pho7r5sDg",
      flashcards: [
        {
          id: "card-1",
          questionEn: "What is Spring?",
          questionVi: "Spring là gì?",
          answerEn: "A Java framework.",
          answerVi: "Một framework Java.",
          explanationVi: "Spring giúp đơn giản hóa phát triển ứng dụng doanh nghiệp."
        },
        {
          id: "card-2",
          questionEn: "What is DI?",
          questionVi: "DI là gì?",
          answerEn: "Dependency Injection.",
          answerVi: "Tiêm phụ thuộc.",
          explanationVi: "Cung cấp các đối tượng phụ thuộc từ bên ngoài."
        }
      ],
      transcript: [
        {
          id: "sent-1",
          en: "Welcome to the Spring course.",
          vi: "Chào mừng đến với khóa học Spring."
        },
        {
          id: "sent-2",
          en: "Spring provides dependency injection.",
          vi: "Spring cung cấp cơ chế tiêm phụ thuộc."
        }
      ],
      contentMarkdown: "## Phân tích kiến trúc Spring\n\nNội dung Markdown chuyên sâu."
    }
  ]
};

describe("SpringLessonContent", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("renders tabs and displays video and transcript by default", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    expect(screen.getByRole("button", { name: /Bài giảng & Transcript/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Thẻ Flashcard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kiến trúc & Phân tích chuyên sâu/i })).toBeInTheDocument();

    // Verify YouTube iframe
    const iframe = screen.getByTitle("Bài 1: Tổng quan Spring");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("X4Pho7r5sDg"));

    // Verify Transcript
    expect(screen.getByText("Welcome to the Spring course.")).toBeInTheDocument();
    expect(screen.getByText("Chào mừng đến với khóa học Spring.")).toBeInTheDocument();
  });

  it("switches to Flashcards tab and supports 3D flip and self-assessment", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    const flashcardsTab = screen.getByRole("button", { name: /Thẻ Flashcard/i });
    fireEvent.click(flashcardsTab);

    // Front of card 1
    expect(screen.getByText("What is Spring?")).toBeInTheDocument();
    expect(screen.getByText("Spring là gì?")).toBeInTheDocument();
    expect(screen.queryByText("A Java framework.")).not.toBeInTheDocument();

    // Click to flip card
    fireEvent.click(screen.getByText("What is Spring?"));
    expect(screen.getByText("A Java framework.")).toBeInTheDocument();
    expect(screen.getByText("Một framework Java.")).toBeInTheDocument();

    // Mark as remembered
    const rememberBtn = screen.getByRole("button", { name: /Đã ghi nhớ/i });
    fireEvent.click(rememberBtn);

    // Should score in localStorage
    const saved = localStorage.getItem("quantavault-spring-flashcards:v1:lesson-01");
    expect(saved).toContain("remembered");
  });

  it("switches to Architecture Blueprint tab and renders markdown content", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    const blueprintTab = screen.getByRole("button", { name: /Kiến trúc & Phân tích chuyên sâu/i });
    fireEvent.click(blueprintTab);

    expect(screen.getByText("Phân tích kiến trúc Spring")).toBeInTheDocument();
    expect(screen.getByText("Nội dung Markdown chuyên sâu.")).toBeInTheDocument();
  });

  it("filters transcript by search query", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    const searchInput = screen.getByPlaceholderText("Tìm trong bài...");
    fireEvent.change(searchInput, { target: { value: "injection" } });

    expect(screen.queryByText("Welcome to the Spring course.")).not.toBeInTheDocument();
    expect(screen.getByText("Spring provides dependency injection.")).toBeInTheDocument();
  });
});
