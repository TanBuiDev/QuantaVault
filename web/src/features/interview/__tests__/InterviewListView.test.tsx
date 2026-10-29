import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { InterviewListView } from "../InterviewListView";
import type { InterviewQuestion } from "@/lib/interview/types";

const mockQuestions: InterviewQuestion[] = [
  {
    id: "test-001",
    title: "Sự khác biệt giữa equals() và hashCode()?",
    category: "java-core",
    difficulty: "junior",
    tags: ["Object", "equals"],
    companies: ["FPT Software"],
    summary: "equals so sánh ngữ nghĩa, hashCode sinh mã băm cho HashMap.",
    answerMarkdown: "### Chi tiết câu trả lời về equals và hashCode.",
    keyTakeaways: ["Luôn override cả hai cùng lúc."],
    relatedProblems: [1],
  },
  {
    id: "test-002",
    title: "Từ khóa volatile và JMM trong Java?",
    category: "concurrency",
    difficulty: "senior",
    tags: ["volatile", "concurrency"],
    companies: ["Shopee"],
    summary: "volatile đảm bảo visibility và cấm reordering lệnh.",
    answerMarkdown: "### Chi tiết về volatile và CPU cache barrier.",
    keyTakeaways: ["volatile không đảm bảo tính nguyên tử."],
  },
];

describe("InterviewListView Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the main heading and question count", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    expect(screen.getByRole("heading", { name: /Bộ Câu Hỏi Phỏng Vấn Java/i })).toBeDefined();
    expect(screen.getByText(/2 câu hỏi chọn lọc/i)).toBeDefined();
  });

  it("renders all initial question cards", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    expect(screen.getByText("Sự khác biệt giữa equals() và hashCode()?")).toBeDefined();
    expect(screen.getByText("Từ khóa volatile và JMM trong Java?")).toBeDefined();
  });

  it("filters questions by search query", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    const searchInput = screen.getByPlaceholderText(/Tìm theo câu hỏi/i);
    fireEvent.change(searchInput, { target: { value: "volatile" } });

    expect(screen.getByText("Từ khóa volatile và JMM trong Java?")).toBeDefined();
    expect(screen.queryByText("Sự khác biệt giữa equals() và hashCode()?")).toBeNull();
  });

  it("shows summary by default and allows toggling full answers", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    // Summary text is visible by default
    expect(screen.getByText(/equals so sánh ngữ nghĩa/i)).toBeDefined();

    // Toggle full answers mode
    const fullModeBtn = screen.getByRole("button", { name: /Đầy đủ/i });
    fireEvent.click(fullModeBtn);
    expect(screen.getAllByText(/Chi tiết câu trả lời/i).length).toBeGreaterThan(0);
  });

  it("toggles full answer expansion", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    const expandButtons = screen.getAllByText(/Xem đáp án chi tiết/i);
    expect(expandButtons.length).toBeGreaterThan(0);

    fireEvent.click(expandButtons[0]);

    expect(screen.getByText("Thu gọn đáp án")).toBeDefined();
  });

  it("shows empty state when no questions match", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    const searchInput = screen.getByPlaceholderText(/Tìm theo câu hỏi/i);
    fireEvent.change(searchInput, { target: { value: "not-found-term-xyz" } });

    expect(screen.getByText("Không tìm thấy câu hỏi phù hợp")).toBeDefined();
  });

  it("opens and closes presentation mode via header button", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    const presentationBtn = screen.getByRole("button", { name: /Trình chiếu \(P\)/i });
    fireEvent.click(presentationBtn);

    expect(screen.getByRole("dialog", { name: /Trình chiếu/i })).toBeDefined();

    // Close presentation mode with Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: /Trình chiếu/i })).toBeNull();
  });

  it("toggles presentation mode using key P", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    fireEvent.keyDown(window, { key: "p" });
    expect(screen.getByRole("dialog", { name: /Trình chiếu/i })).toBeDefined();

    fireEvent.keyDown(window, { key: "p" });
    expect(screen.queryByRole("dialog", { name: /Trình chiếu/i })).toBeNull();
  });
});
