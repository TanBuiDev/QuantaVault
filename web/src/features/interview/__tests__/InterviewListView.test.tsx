import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { InterviewListView } from "../InterviewListView";
import type { InterviewQuestion } from "@/lib/interview/types";
import { saveDraft } from "@/lib/interview/draftStore";

vi.mock("@/components/ui/MermaidRenderer", () => ({ MermaidRenderer: () => null }));
const accountMock = vi.hoisted(() => ({ role: "admin" as "admin" | "user" }));
vi.mock("@/lib/auth/AccountProvider", () => ({
  useAccount: () => ({ user: { id: "test-user", name: "Admin", email: "admin@example.com", role: accountMock.role }, loading: false }),
}));

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
    accountMock.role = "admin";
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.replaceState({}, "", "/interview");
  });

  it("does not open the editor for ordinary users even if URL requests edit=true", () => {
    accountMock.role = "user";
    window.history.replaceState({}, "", "/interview/?edit=true&editQuestion=test-001");
    render(<InterviewListView initialQuestions={mockQuestions} />);
    expect(screen.queryByRole("button", { name: "Thêm câu hỏi" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Vào chế độ biên tập/ })).toBeNull();
    expect(screen.queryByRole("dialog", { name: /Chỉnh sửa/ })).toBeNull();
  });

  it("does not expose unpublished local drafts to a different signed-in ordinary user", async () => {
    accountMock.role = "user";
    saveDraft({ ...mockQuestions[0], title: "Unpublished admin draft" }, mockQuestions[0]);
    render(<InterviewListView initialQuestions={mockQuestions} />);
    await waitFor(() => expect(screen.getByText(mockQuestions[0].title)).toBeInTheDocument());
    expect(screen.queryByText("Unpublished admin draft")).toBeNull();
  });

  it("renders the main heading and question count", () => {
    render(<InterviewListView initialQuestions={mockQuestions} />);

    expect(screen.getByRole("heading", { name: /Bộ Câu Hỏi Phỏng Vấn Java/i })).toBeDefined();
    expect(screen.getByText(/2 câu hỏi chọn lọc/i)).toBeDefined();
  });

  it("shows text size controls inside the right study rail and keeps a smaller-screen fallback", () => {
    const { container } = render(<InterviewListView initialQuestions={mockQuestions} />);
    const rail = container.querySelector("aside.sticky");
    expect(rail).toBeInTheDocument();
    expect(rail?.textContent).toContain("Cỡ chữ bài học");
    expect(rail?.querySelector('[role="group"][aria-label="Điều chỉnh cỡ chữ"]')).toBeInTheDocument();

    const headerFallback = container.querySelector("header .\\32 xl\\:hidden");
    expect(headerFallback).toBeInTheDocument();
    expect(headerFallback?.querySelector('[role="group"][aria-label="Điều chỉnh cỡ chữ"]')).toBeInTheDocument();
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

  it("mở lại modal sau reload dùng phần đã lưu thay vì dữ liệu gốc", () => {
    saveDraft({ ...mockQuestions[0], answerMarkdown: "Nội dung đã chỉnh sửa và lưu" }, mockQuestions[0]);
    localStorage.setItem("interview_edit_mode", "true");
    sessionStorage.setItem("interview_editing_id", mockQuestions[0].id);
    render(<InterviewListView initialQuestions={mockQuestions} />);
    expect(screen.getByPlaceholderText("Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...")).toHaveValue("Nội dung đã chỉnh sửa và lưu");
  });
});
