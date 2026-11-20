import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpringReadingStudio, transformBilingualMarkdown } from "../SpringReadingStudio";
import type { CourseLesson } from "@/lib/courses";

const mockLesson: CourseLesson = {
  id: "lesson-29",
  slug: "lesson-29",
  number: 29,
  chapterId: "chapter-02",
  title: "Bài 29: Tóm tắt và những điểm nổi bật của Module 2",
  titleEn: "Summary and Highlights: Deep Dive into Spring Boot",
  summary: "Đúc kết toàn diện kiến thức cốt lõi của Module 2.",
  durationMinutes: 15,
  lessonType: "reading-audio",
  tags: ["Summary", "Spring Boot"],
  videoId: "",
  audioUrl: "/audio/courses/spring-framework-for-java/lesson-29-summary.mp3",
  contentMarkdown: `# Summary and Highlights: Deep Dive into Spring Boot

## Introduction / Giới thiệu

**EN:** Congratulations! You have completed this module.

**VI:** Chúc mừng! Bạn đã hoàn thành mô-đun này.

---

## Key Takeaways / Những điểm chính

- **EN:** Spring Boot automates configuration.
  **VI:** Spring Boot tự động hóa cấu hình.
`
};

describe("transformBilingualMarkdown", () => {
  it("transforms into clean Vietnamese text in vi mode", () => {
    const viText = transformBilingualMarkdown(mockLesson.contentMarkdown, "vi");
    expect(viText).toContain("Giới thiệu");
    expect(viText).toContain("Chúc mừng! Bạn đã hoàn thành mô-đun này.");
    expect(viText).not.toContain("Congratulations!");
    expect(viText).not.toContain("**EN:**");
    expect(viText).not.toContain("**VI:**");
  });

  it("transforms into clean English text in en mode", () => {
    const enText = transformBilingualMarkdown(mockLesson.contentMarkdown, "en");
    expect(enText).toContain("Introduction");
    expect(enText).toContain("Congratulations! You have completed this module.");
    expect(enText).not.toContain("Chúc mừng!");
    expect(enText).not.toContain("**EN:**");
    expect(enText).not.toContain("**VI:**");
  });

  it("formats into elegant bilingual cards in bilingual mode", () => {
    const biText = transformBilingualMarkdown(mockLesson.contentMarkdown, "bilingual");
    expect(biText).toContain("Congratulations! You have completed this module.");
    expect(biText).toContain("Chúc mừng! Bạn đã hoàn thành mô-đun này.");
    expect(biText).not.toContain("**EN:**");
    expect(biText).not.toContain("**VI:**");
    expect(biText).not.toContain("🇻🇳");
    expect(biText).not.toContain("**Dịch:**");
    expect(biText).not.toContain("> ");
  });
});

describe("SpringReadingStudio", () => {
  it("renders reading studio with language toggle and type badge", () => {
    render(<SpringReadingStudio lesson={mockLesson} />);

    expect(screen.getByText("Bài đọc kết hợp Audio Lecture")).toBeInTheDocument();
    expect(screen.getByText("15 phút đọc")).toBeInTheDocument();
    expect(screen.getByText("Có audio bài giảng")).toBeInTheDocument();

    expect(screen.getByText("Song ngữ")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Việt")).toBeInTheDocument();
    expect(screen.getByText("Tiếng Anh")).toBeInTheDocument();
  });

  it("switches to Tiếng Việt when clicking Tiếng Việt toggle", () => {
    render(<SpringReadingStudio lesson={mockLesson} />);

    const viToggle = screen.getByText("Tiếng Việt");
    fireEvent.click(viToggle);

    expect(screen.getByText(/Chúc mừng! Bạn đã hoàn thành mô-đun này/i)).toBeInTheDocument();
    expect(screen.queryByText(/Congratulations! You have completed this module/i)).not.toBeInTheDocument();
  });

  it("switches to Tiếng Anh when clicking Tiếng Anh toggle", () => {
    render(<SpringReadingStudio lesson={mockLesson} />);

    const enToggle = screen.getByText("Tiếng Anh");
    fireEvent.click(enToggle);

    expect(screen.getByText(/Congratulations! You have completed this module/i)).toBeInTheDocument();
    expect(screen.queryByText(/Chúc mừng! Bạn đã hoàn thành mô-đun này/i)).not.toBeInTheDocument();
  });

  it("filters content when entering search query", () => {
    render(<SpringReadingStudio lesson={mockLesson} />);

    const searchInput = screen.getByPlaceholderText("Tìm kiếm nội dung bài học...");
    fireEvent.change(searchInput, { target: { value: "automates" } });

    expect(screen.getByText(/Spring Boot automates configuration/i)).toBeInTheDocument();
    expect(screen.queryByText(/Congratulations/i)).not.toBeInTheDocument();
  });

  it("renders interactive quiz questions without spoiling the answer upfront, and reveals upon selection", () => {
    const quizLesson: CourseLesson = {
      ...mockLesson,
      id: "lesson-21",
      lessonType: "quiz",
      title: "Bài 21: Trắc nghiệm Spring Boot"
    };

    const mockQuizQuestions = [
      {
        id: "q-1",
        number: 1,
        title: "Mục đích chính của Spring Boot",
        questionEn: "What is the primary purpose of Spring Boot?",
        questionVi: "Mục đích chính của Spring Boot là gì?",
        options: [
          {
            id: "A",
            textEn: "To provide a new language",
            textVi: "Cung cấp ngôn ngữ mới",
            isCorrect: false
          },
          {
            id: "B",
            textEn: "To simplify Java app development by automating configuration",
            textVi: "Đơn giản hóa việc phát triển ứng dụng Java bằng cách tự động hóa cấu hình",
            isCorrect: true
          }
        ],
        explanationVi: "Spring Boot tự động hóa cấu hình.",
        explanationEn: "Spring Boot automates configuration."
      }
    ];

    render(
      <SpringReadingStudio
        lesson={quizLesson}
        quizQuestions={mockQuizQuestions}
      />
    );

    // 1. Question and options A and B are rendered
    expect(screen.getByText("What is the primary purpose of Spring Boot?")).toBeInTheDocument();
    expect(screen.getByText(/To provide a new language/i)).toBeInTheDocument();
    expect(screen.getByText(/To simplify Java app development/i)).toBeInTheDocument();

    // 2. Crucial: The explanation and "Đáp án đúng" badge are NOT shown initially!
    expect(screen.queryByText(/Phân tích & Điểm mấu chốt/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Chính xác \(\+1\)/i)).not.toBeInTheDocument();
    expect(screen.getByText("Xem đáp án & giải thích")).toBeInTheDocument();

    // 3. User clicks Option B (correct)
    const optionB = screen.getByText(/To simplify Java app development/i);
    fireEvent.click(optionB);

    // 4. Now the result is revealed with correct badge and explanation!
    expect(screen.getByText(/Chính xác \(\+1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Đáp án đúng/i)).toBeInTheDocument();
    expect(screen.getByText(/Phân tích & Điểm mấu chốt/i)).toBeInTheDocument();
    expect(screen.getByText("Làm lại bài tập")).toBeInTheDocument();

    // 5. Clicking "Làm lại bài tập" resets the quiz
    fireEvent.click(screen.getByText("Làm lại bài tập"));
    expect(screen.queryByText(/Chính xác \(\+1\)/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Phân tích & Điểm mấu chốt/i)).not.toBeInTheDocument();
  });
});
