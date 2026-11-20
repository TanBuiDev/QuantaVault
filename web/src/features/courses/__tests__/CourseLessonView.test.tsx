import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLearningSessionActive } from "@/lib/auth/progressAccess";
import { render, screen, fireEvent } from "@testing-library/react";
import { CourseLessonView } from "../CourseLessonView";
import type { CourseManifest } from "@/lib/courses";

vi.mock("@/lib/auth/AccountProvider", () => ({ useAccount: () => ({ requestLogin: vi.fn() }) }));

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
  beforeEach(() => setLearningSessionActive(true));
  afterEach(() => setLearningSessionActive(false));
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

  it("renders specialized Quiz layout for quiz lessons without video player", () => {
    const quizLesson = {
      ...mockSpringCourse.lessons[0],
      id: "lesson-05",
      title: "Bài 05: Bài tập trắc nghiệm - Khám phá Spring Framework",
      lessonType: "quiz" as const,
      videoId: undefined,
      transcript: undefined,
      flashcards: [
        {
          id: "card-1",
          questionEn: "What is Spring IoC?",
          questionVi: "Spring IoC là gì?",
          answerEn: "Inversion of Control",
          answerVi: "Đảo ngược điều khiển"
        }
      ],
      contentMarkdown: "## Chi tiết câu hỏi trắc nghiệm"
    };

    render(
      <CourseLessonView
        course={mockSpringCourse}
        lesson={quizLesson}
        chapterTitle="Chương 1: Nền tảng Spring"
      />
    );

    // Should NOT have any video iframe or video placeholder
    expect(screen.queryByTitle(/Bài 05/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Video bài giảng trực tuyến đang chờ cập nhật/i)).not.toBeInTheDocument();

    // Should render Quiz Stage & Flashcards
    expect(screen.getAllByText("Bài 05: Bài tập trắc nghiệm - Khám phá Spring Framework").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("What is Spring IoC?").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Spring IoC là gì?").length).toBeGreaterThanOrEqual(1);
    // Should render interactive Quiz Studio below
    expect(screen.getByText(/Bài tập trắc nghiệm tương tác/i)).toBeInTheDocument();

    // Right rail should NOT duplicate the Flashcard tab on quiz lessons (to avoid 2 flashcard areas)
    expect(screen.queryByRole("button", { name: /Flashcard \(1\)/i })).not.toBeInTheDocument();
    // Right rail should default to Syllabus tab
    expect(screen.getByRole("button", { name: /Mục lục \(2\)/i })).toBeInTheDocument();
    expect(screen.getByText("Bản đồ 2 bài học")).toBeInTheDocument();
  });

  it("renders specialized Audio Lecture layout for reading-audio lessons", () => {
    const audioLesson = {
      ...mockSpringCourse.lessons[0],
      id: "lesson-12",
      title: "Bài 12: Tóm tắt Module 1",
      lessonType: "reading-audio" as const,
      videoId: undefined,
      audioUrl: "/audio/courses/spring-framework-for-java/lesson-12-summary.mp3",
      transcript: undefined,
      contentMarkdown: "## Tóm tắt kiến thức cốt lõi"
    };

    render(
      <CourseLessonView
        course={mockSpringCourse}
        lesson={audioLesson}
        chapterTitle="Chương 1: Nền tảng Spring"
      />
    );

    // Should NOT have video
    expect(screen.queryByText(/Video bài giảng trực tuyến đang chờ cập nhật/i)).not.toBeInTheDocument();

    // Should render Audio badge and Audio controls
    expect(screen.getAllByText(/Bài đọc kết hợp Audio Lecture/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/Phát audio/i)).toBeInTheDocument();

    // Right rail should have Syllabus tab
    expect(screen.getByRole("button", { name: /Mục lục \(2\)/i })).toBeInTheDocument();
  });

  it("renders specialized Cheatsheet / Reading layout for article lessons", () => {
    const cheatsheetLesson = {
      ...mockSpringCourse.lessons[0],
      id: "lesson-13",
      title: "Bài 13: Sổ tay tra cứu mã nguồn",
      lessonType: "cheatsheet" as const,
      videoId: undefined,
      transcript: undefined,
      contentMarkdown: "Bảng tra cứu Annotations chi tiết"
    };

    const { container } = render(
      <CourseLessonView
        course={mockSpringCourse}
        lesson={cheatsheetLesson}
        chapterTitle="Chương 1: Nền tảng Spring"
      />
    );

    // Should NOT have video
    expect(screen.queryByText(/Video bài giảng trực tuyến đang chờ cập nhật/i)).not.toBeInTheDocument();

    // Should render Cheatsheet badge and content
    expect(screen.getByText("Sổ tay tra cứu mã nguồn (Cheat Sheet)")).toBeInTheDocument();
    expect(container.textContent).toContain("Bảng tra cứu Annotations chi tiết");

    // Right rail should have Syllabus tab
    expect(screen.getByRole("button", { name: /Mục lục \(2\)/i })).toBeInTheDocument();
  });
});
