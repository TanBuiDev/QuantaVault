import "@testing-library/jest-dom/vitest";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringLessonContent } from "../SpringLessonContent";
import type { CourseManifest } from "@/lib/courses";

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

  it("renders workspace tabs and displays flashcards by default", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    expect(screen.getByRole("button", { name: /Thẻ Flashcard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kiến trúc & Phân tích chuyên sâu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Transcript/i })).toBeInTheDocument();

    // Default tab is Flashcards (auto-shuffled)
    expect(screen.getByText(/What is (Spring|DI)\?/)).toBeInTheDocument();
    expect(screen.getByText(/(Spring|DI) là gì\?/)).toBeInTheDocument();
  });

  it("supports flipping and navigating flashcards", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    // Front of card (shuffled)
    const frontText = screen.getByText(/What is (Spring|DI)\?/);
    expect(frontText).toBeInTheDocument();

    // Click to flip card
    fireEvent.click(frontText);
    expect(screen.getByText(/A Java framework|Dependency Injection/)).toBeInTheDocument();

    // Click next button
    const nextBtn = screen.getByRole("button", { name: /Thẻ tiếp theo|Xem kết quả/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/1 \/ 2|2 \/ 2/)).toBeInTheDocument();
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

  it("switches to mobile transcript fallback and filters sentences by search query", () => {
    render(
      <SpringLessonContent
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
      />
    );

    const transcriptTab = screen.getByRole("button", { name: /Transcript/i });
    fireEvent.click(transcriptTab);

    expect(screen.getByText("Welcome to the Spring course.")).toBeInTheDocument();
    expect(screen.getByText("Chào mừng đến với khóa học Spring.")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Tìm trong bài...");
    fireEvent.change(searchInput, { target: { value: "injection" } });

    expect(screen.queryByText("Welcome to the Spring course.")).not.toBeInTheDocument();
    expect(screen.getByText("Spring provides dependency injection.")).toBeInTheDocument();
  });
});
