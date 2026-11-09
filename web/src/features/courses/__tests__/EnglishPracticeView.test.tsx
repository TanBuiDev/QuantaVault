import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { EnglishPracticeView } from "../EnglishPracticeView";

const lessons = [
  { id: "lesson-01", number: 1, title: "Bài 01: Bản thân, điểm mạnh và điểm yếu", titleEn: "About Yourself, Strengths and Weaknesses" },
  { id: "lesson-16", number: 16, title: "Bài 16: Vị trí và yêu cầu công việc", titleEn: "Job Roles and Requirements" }
];

describe("EnglishPracticeView", () => {
  const speakMock = vi.fn();
  const cancelMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    speakMock.mockClear();
    cancelMock.mockClear();
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speak: speakMock,
        cancel: cancelMock,
        getVoices: () => [
          { lang: "en-US", name: "Google US English", default: true, localService: false }
        ],
        speaking: false
      },
      writable: true,
      configurable: true
    });
    // Stub SpeechSynthesisUtterance if not defined in jsdom
    if (typeof window.SpeechSynthesisUtterance === "undefined") {
      (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class {
        text: string;
        lang = "en-US";
        rate = 1;
        pitch = 1;
        voice = null;
        onend = null;
        onerror = null;
        constructor(text: string) {
          this.text = text;
        }
      };
    }
  });

  it("hides the translation until requested, supports self-assessment and resets text on next card", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    expect(screen.getByRole("heading", { name: "Luyện dịch hai chiều" })).toBeInTheDocument();
    expect(screen.getByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).toBeInTheDocument();
    expect(screen.queryByText("Tell me a little about yourself.")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Bản dịch của bạn" }), { target: { value: "My answer" } });
    fireEvent.click(screen.getByRole("button", { name: "Hiện bản dịch tham khảo" }));
    expect(screen.getByText("Tell me a little about yourself.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Đã nhớ" }));
    expect(localStorage.getItem("quantavault-english-practice:v1")).toContain("remembered");
    fireEvent.click(screen.getByRole("button", { name: "Thẻ tiếp" }));
    expect(screen.getByRole("textbox", { name: "Bản dịch của bạn" })).toHaveValue("");
    expect(screen.queryByText("Tell me a little about yourself.")).not.toBeInTheDocument();
  });

  it("switches direction and handles lessons with no example answers", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    fireEvent.click(within(screen.getByRole("group", { name: "Hướng dịch" })).getByRole("button", { name: "Anh → Việt" }));
    expect(screen.getByText("Tell me a little about yourself.")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Chọn bài luyện tập" }), { target: { value: "lesson-16" } });
    fireEvent.click(within(screen.getByRole("group", { name: "Loại bài tập" })).getByRole("button", { name: "Mẫu trả lời" }));
    expect(screen.getByText(/chưa có mẫu trả lời/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Chuyển sang luyện câu hỏi" }));
    expect(screen.getByText(/Thẻ 1\/9/)).toBeInTheDocument();
  });

  it("triggers Web Speech API pronunciation on clicking the speaker button or shortcut P", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    const speakBtn = screen.getByRole("button", { name: "Nghe phát âm câu tiếng Anh" });
    fireEvent.click(speakBtn);
    expect(speakMock).toHaveBeenCalledTimes(1);

    // Keyboard shortcut P
    fireEvent.keyDown(window, { key: "p" });
    expect(speakMock).toHaveBeenCalledTimes(2);
  });

  it("supports keyboard shortcuts: Ctrl+Enter (reveal), 1 (review), 2 (remembered), and arrow navigation", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    const textarea = screen.getByRole("textbox", { name: "Bản dịch của bạn" });

    // Ctrl + Enter toggles reveal
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(screen.getByText("Tell me a little about yourself.")).toBeInTheDocument();

    // Key 1 marks "Cần ôn"
    fireEvent.keyDown(window, { key: "1" });
    expect(localStorage.getItem("quantavault-english-practice:v1")).toContain("review");

    // Key 2 marks "Đã nhớ"
    fireEvent.keyDown(window, { key: "2" });
    expect(localStorage.getItem("quantavault-english-practice:v1")).toContain("remembered");

    // ArrowRight moves to next card
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText(/Thẻ 2\//)).toBeInTheDocument();

    // ArrowLeft moves back
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByText(/Thẻ 1\//)).toBeInTheDocument();
  });

  it("filters cards by status (Cần ôn, Đã nhớ, Chưa làm)", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    // Mark card 1 as review
    fireEvent.click(screen.getByRole("button", { name: "Hiện bản dịch tham khảo" }));
    fireEvent.click(screen.getByRole("button", { name: "Cần ôn" }));

    // Filter by "Cần ôn"
    const filterGroup = screen.getByRole("group", { name: "Bộ lọc trạng thái ghi nhớ" });
    fireEvent.click(within(filterGroup).getByRole("button", { name: /Cần ôn/ }));
    expect(screen.getByText("Thẻ 1/1")).toBeInTheDocument();

    // Filter by "Đã nhớ" -> shows friendly empty state
    fireEvent.click(within(filterGroup).getByRole("button", { name: /Đã nhớ/ }));
    expect(screen.getByText(/Không có thẻ nào trong mục.*Đã nhớ/)).toBeInTheDocument();

    // Reset back to all
    fireEvent.click(screen.getByRole("button", { name: /Xem tất cả/ }));
    expect(screen.getByText(/Thẻ 1\/155/)).toBeInTheDocument();
  });

  it("displays Session Summary Card when reaching the final card with an assessment", () => {
    render(<EnglishPracticeView lessons={lessons} />);
    // Choose lesson 16 (has 9 questions)
    fireEvent.change(screen.getByRole("combobox", { name: "Chọn bài luyện tập" }), { target: { value: "lesson-16" } });
    expect(screen.getByText("Thẻ 1/9")).toBeInTheDocument();

    // Navigate to card 9
    for (let i = 1; i < 9; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Thẻ tiếp" }));
    }
    expect(screen.getByText("Thẻ 9/9")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Tổng kết buổi luyện tập" })).not.toBeInTheDocument();

    // Reveal and assess card 9
    fireEvent.click(screen.getByRole("button", { name: "Hiện bản dịch tham khảo" }));
    fireEvent.click(screen.getByRole("button", { name: "Đã nhớ" }));

    // Summary card is now visible
    expect(screen.getByRole("region", { name: "Tổng kết buổi luyện tập" })).toBeInTheDocument();
    expect(screen.getByText(/Tổng kết buổi luyện tập/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Luyện lại từ đầu" })).toBeInTheDocument();
  });
});
