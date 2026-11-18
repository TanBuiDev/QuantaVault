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

const mockSpringCourse: CourseManifest = {
  id: "spring-framework-for-java",
  slug: "spring-framework-for-java",
  title: "Spring Framework for Java Development",
  tagline: "Khóa học Spring chuẩn",
  icon: "Leaf",
  badge: "Spring Core",
  level: "Beginner",
  totalLessons: 2,
  chapters: [
    {
      id: "ch-01",
      title: "Chương 1: Nền tảng Spring",
      lessonIds: ["lesson-01", "lesson-02"]
    }
  ],
  lessons: [
    {
      id: "lesson-01",
      slug: "lesson-01",
      number: 1,
      chapterId: "ch-01",
      title: "Bài 01: Giới thiệu Spring",
      titleEn: "Introduction to Spring",
      summary: "Tóm tắt tổng quan Spring Framework và hệ sinh thái.",
      durationMinutes: 15,
      tags: ["Spring", "Java", "Backend"],
      videoId: "X4Pho7r5sDg",
      flashcards: [
        {
          id: "card-1",
          questionEn: "What is Spring?",
          questionVi: "Spring là gì?",
          answerEn: "A Java framework.",
          answerVi: "Một framework Java."
        }
      ],
      transcript: [
        {
          id: "sent-1",
          en: "Welcome to Spring tutorial.",
          vi: "Chào mừng đến với bài học Spring."
        }
      ],
      contentMarkdown: "## Kiến trúc Spring Framework"
    },
    {
      id: "lesson-02",
      slug: "lesson-02",
      number: 2,
      chapterId: "ch-01",
      title: "Bài 02: Dependency Injection",
      summary: "Tóm tắt DI",
      durationMinutes: 20,
      contentMarkdown: "## DI & IoC"
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
    expect(screen.getByText("Bản đồ 2 bài học")).toBeInTheDocument();
    expect(screen.getByText("#01")).toBeInTheDocument();
    expect(screen.getByText("#02")).toBeInTheDocument();

    const markBtn = screen.getByRole("button", { name: /đánh dấu đã học/i });
    expect(markBtn).toBeInTheDocument();

    fireEvent.click(markBtn);
    expect(screen.getByRole("button", { name: /đã học xong/i })).toBeInTheDocument();
  });

  it("renders text size controls in both right rail and mobile bar", () => {
    const { container } = render(
      <CourseLessonView
        course={mockCourse}
        lesson={mockCourse.lessons[0]}
        chapterTitle="Chương 1: Nền tảng"
      />
    );

    const controls = container.querySelectorAll('[role="group"][aria-label="Điều chỉnh cỡ chữ"]');
    expect(controls.length).toBeGreaterThanOrEqual(1);
    expect(container.textContent).toContain("Cỡ chữ bài học");
  });

  it("renders specialized YouTube-style compact layout for Spring courses", () => {
    render(
      <CourseLessonView
        course={mockSpringCourse}
        lesson={mockSpringCourse.lessons[0]}
        chapterTitle="Chương 1: Nền tảng Spring"
        nextLesson={mockSpringCourse.lessons[1]}
      />
    );

    // 1. YouTube video player at top
    const iframe = screen.getByTitle("Bài 01: Giới thiệu Spring");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("X4Pho7r5sDg"));

    // 2. Title & English subtitle
    expect(screen.getByText("Bài 01: Giới thiệu Spring")).toBeInTheDocument();
    expect(screen.getByText("Introduction to Spring")).toBeInTheDocument();

    // 3. Action toolbar
    expect(screen.getByRole("button", { name: /đánh dấu đã học/i })).toBeInTheDocument();
    expect(screen.getByTitle("Sao chép liên kết bài học")).toBeInTheDocument();
    expect(screen.getByTitle("Mở video trên YouTube")).toHaveAttribute("href", "https://youtu.be/X4Pho7r5sDg");

    // 4. Collapsible description card
    expect(screen.getByText(/Tóm tắt tổng quan Spring Framework/i)).toBeInTheDocument();
    const expandBtn = screen.getByRole("button", { name: /... Xem thêm/i });
    expect(expandBtn).toBeInTheDocument();

    // Click expand
    fireEvent.click(expandBtn);
    expect(screen.getByText("#Spring")).toBeInTheDocument();
    expect(screen.getByText("#Backend")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Thu gọn/i })).toBeInTheDocument();

    // 5. Right Rail with Transcript tab & Syllabus switcher
    const transcriptBtns = screen.getAllByRole("button", { name: /Transcript \(1\)/i });
    expect(transcriptBtns.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /Mục lục \(2\)/i })).toBeInTheDocument();

    // By default, Transcript is active in right rail
    expect(screen.getByText("Welcome to Spring tutorial.")).toBeInTheDocument();
    expect(screen.getByText("Chào mừng đến với bài học Spring.")).toBeInTheDocument();

    // Switch to Syllabus tab in Right Rail
    const syllabusTab = screen.getByRole("button", { name: /Mục lục \(2\)/i });
    fireEvent.click(syllabusTab);
    expect(screen.getByText("Bản đồ 2 bài học")).toBeInTheDocument();
  });
});
