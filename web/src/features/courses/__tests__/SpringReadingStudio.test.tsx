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
    expect(biText).toContain("> 🇻🇳 **Dịch:** Chúc mừng! Bạn đã hoàn thành mô-đun này.");
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
});
