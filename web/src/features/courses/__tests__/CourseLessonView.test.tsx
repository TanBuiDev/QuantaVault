import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CourseLessonView } from "../CourseLessonView";
import type { CourseManifest } from "@/lib/courses";

const mockCourse: CourseManifest = {
  id: "test-course",
  slug: "test-course",
  title: "Test Course Title",
  tagline: "Test course tagline",
  icon: "Database",
  badge: "Lộ trình 20 bài",
  level: "Intermediate",
  totalLessons: 2,
  chapters: [
    {
      id: "ch-01",
      title: "Chương 1: Nền tảng",
      lessonIds: ["lesson-01", "lesson-02"]
    }
  ],
  lessons: [
    {
      id: "lesson-01",
      slug: "lesson-01",
      number: 1,
      chapterId: "ch-01",
      title: "Bài 1: Khởi động",
      summary: "Tóm tắt bài 1",
      durationMinutes: 10,
      tags: ["Test", "Intro"],
      contentMarkdown: "## Nội dung bài 1\n\nNội dung chi tiết ở đây."
    },
    {
      id: "lesson-02",
      slug: "lesson-02",
      number: 2,
      chapterId: "ch-01",
      title: "Bài 2: Nâng cao",
      summary: "Tóm tắt bài 2",
      durationMinutes: 15,
      tags: ["Advanced"],
      contentMarkdown: "## Nội dung bài 2"
    }
  ]
};

describe("CourseLessonView", () => {
  it("renders lesson details, badges and navigation", () => {
    render(
      <CourseLessonView
        course={mockCourse}
        lesson={mockCourse.lessons[0]}
        chapterTitle="Chương 1: Nền tảng"
        nextLesson={mockCourse.lessons[1]}
      />
    );

    expect(screen.getByText("Bài 1: Khởi động")).toBeInTheDocument();
    expect(screen.getAllByText("Chương 1: Nền tảng").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tóm tắt bài 1")).toBeInTheDocument();
    expect(screen.getByText("Bài 2: Nâng cao")).toBeInTheDocument();

    const markBtn = screen.getByRole("button", { name: /đánh dấu đã học/i });
    expect(markBtn).toBeInTheDocument();

    fireEvent.click(markBtn);
    expect(screen.getByRole("button", { name: /đã học xong/i })).toBeInTheDocument();
  });
});
