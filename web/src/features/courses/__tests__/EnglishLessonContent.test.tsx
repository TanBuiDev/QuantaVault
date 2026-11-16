import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnglishLessonContent } from "../EnglishLessonContent";

// Mock practice questions
vi.mock("@/lib/courses/englishPractice", () => ({
  practiceQuestions: [
    {
      id: "interview-en-i-001",
      lessonId: "lesson-01",
      questionEn: "Tell me a little about yourself.",
      questionVi: "Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.",
      answers: [
        {
          id: "interview-en-i-001:answer:1",
          en: "I attended MIT where I majored in Electrical Engineering.",
          vi: "Tôi học tại MIT, nơi tôi theo học chuyên ngành Kỹ sư điện."
        },
        {
          id: "interview-en-i-001:answer:2",
          en: "I grew up in Korea and studied accounting.",
          vi: "Tôi lớn lên ở Hàn quốc và đã học kế toán."
        }
      ]
    },
    {
      id: "interview-en-i-117",
      lessonId: "lesson-01",
      questionEn: "Are you able to make frequent business trips?",
      questionVi: "Anh/chị có thể đi công tác thường xuyên không?",
      answers: []
    }
  ]
}));

const mockSpeak = vi.fn();
const mockIsSpeaking = vi.fn().mockReturnValue(false);

vi.mock("@/lib/courses/speech", () => ({
  useEnglishSpeech: () => ({
    speak: mockSpeak,
    isSpeaking: mockIsSpeaking,
    stop: vi.fn(),
    activeText: null
  })
}));

describe("EnglishLessonContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
  });

  it("renders structured question cards with sample answers", () => {
    render(<EnglishLessonContent lessonId="lesson-01" />);

    // Renders question headlines
    expect(screen.getByText("Tell me a little about yourself.")).toBeInTheDocument();
    expect(screen.getByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).toBeInTheDocument();

    // Renders sample answers
    expect(screen.getByText("Mẫu trả lời 1")).toBeInTheDocument();
    expect(screen.getByText("I attended MIT where I majored in Electrical Engineering.")).toBeInTheDocument();
    expect(screen.getByText("Tôi học tại MIT, nơi tôi theo học chuyên ngành Kỹ sư điện.")).toBeInTheDocument();

    // Renders question with 0 answers nicely
    expect(screen.getByText("Are you able to make frequent business trips?")).toBeInTheDocument();
    expect(screen.getByText("Câu hỏi không có mẫu cố định")).toBeInTheDocument();
  });

  it("toggles bilingual display modes correctly", () => {
    render(<EnglishLessonContent lessonId="lesson-01" />);

    // Default is bilingual: Vietnamese translation visible
    expect(screen.getByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).toBeInTheDocument();

    // Switch to English only
    fireEvent.click(screen.getByRole("button", { name: /chỉ tiếng anh/i }));
    expect(screen.queryByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).not.toBeInTheDocument();

    // Switch to Mask Vietnamese
    fireEvent.click(screen.getByRole("button", { name: /ẩn bản dịch/i }));
    expect(screen.queryByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).not.toBeInTheDocument();

    // Click to reveal question 1 translation
    const revealBtn = screen.getByRole("button", { name: "Mở bản dịch câu hỏi 1" });
    fireEvent.click(revealBtn);
    expect(screen.getByText("Hãy nói sơ qua cho tôi nghe về bản thân của anh/chị.")).toBeInTheDocument();
  });

  it("triggers audio speech when clicking audio buttons", () => {
    render(<EnglishLessonContent lessonId="lesson-01" />);

    const speakQuestionBtn = screen.getByRole("button", { name: "Nghe câu hỏi 1" });
    fireEvent.click(speakQuestionBtn);

    expect(mockSpeak).toHaveBeenCalledWith("Tell me a little about yourself.");
  });

  it("copies text to clipboard when clicking copy buttons", () => {
    render(<EnglishLessonContent lessonId="lesson-01" />);

    const copyBtn = screen.getByRole("button", { name: "Sao chép câu hỏi 1" });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("Tell me a little about yourself.")
    );
  });
});
