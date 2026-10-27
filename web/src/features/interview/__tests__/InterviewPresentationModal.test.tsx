import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InterviewPresentationModal } from "../InterviewPresentationModal";
import type { InterviewQuestion } from "@/lib/interview/types";

const mockQuestions: InterviewQuestion[] = [
  {
    id: "q-1",
    title: "Java Memory Model hoạt động thế nào?",
    category: "jvm",
    difficulty: "senior",
    tags: ["JMM", "JVM"],
    companies: ["Viettel"],
    summary: "JMM quy định cách các luồng giao tiếp qua bộ nhớ chia sẻ.",
    answerMarkdown: "### Chi tiết về Java Memory Model...",
    keyTakeaways: ["Happens-before relationship."],
  },
  {
    id: "q-2",
    title: "Phân biệt HashMap và ConcurrentHashMap?",
    category: "collections",
    difficulty: "middle",
    tags: ["HashMap", "Concurrency"],
    companies: ["VNG"],
    summary: "ConcurrentHashMap an toàn đa luồng bằng Segment/CAS.",
    answerMarkdown: "### Chi tiết về ConcurrentHashMap...",
    keyTakeaways: ["Khóa từng bucket/CAS thay vì toàn bộ table."],
  },
];

describe("InterviewPresentationModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <InterviewPresentationModal
        isOpen={false}
        onClose={vi.fn()}
        questions={mockQuestions}
        isLearned={() => false}
        isReview={() => false}
        isBookmarked={() => false}
        onToggleLearned={vi.fn()}
        onToggleReview={vi.fn()}
        onToggleBookmark={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders presentation dialog with first question when open", () => {
    render(
      <InterviewPresentationModal
        isOpen={true}
        onClose={vi.fn()}
        questions={mockQuestions}
        isLearned={() => false}
        isReview={() => false}
        isBookmarked={() => false}
        onToggleLearned={vi.fn()}
        onToggleReview={vi.fn()}
        onToggleBookmark={vi.fn()}
      />
    );

    expect(screen.getByText("Chế Độ Trình Chiếu Hội Trường")).toBeDefined();
    expect(screen.getByText("Java Memory Model hoạt động thế nào?")).toBeDefined();
    expect(screen.getByText("Viettel")).toBeDefined();
    expect(screen.getByText(/Thời Gian Thảo Luận & Tự Trả Lời/i)).toBeDefined();
  });

  it("reveals answer and takeaways on button click", () => {
    render(
      <InterviewPresentationModal
        isOpen={true}
        onClose={vi.fn()}
        questions={mockQuestions}
        isLearned={() => false}
        isReview={() => false}
        isBookmarked={() => false}
        onToggleLearned={vi.fn()}
        onToggleReview={vi.fn()}
        onToggleBookmark={vi.fn()}
      />
    );

    const revealBtn = screen.getByText(/Hiện Lời Giải & Phân Tích/i);
    fireEvent.click(revealBtn);

    expect(screen.getByText("JMM quy định cách các luồng giao tiếp qua bộ nhớ chia sẻ.")).toBeDefined();
    expect(screen.getByText("Happens-before relationship.")).toBeDefined();
  });

  it("navigates between questions using Next and Prev buttons", () => {
    render(
      <InterviewPresentationModal
        isOpen={true}
        onClose={vi.fn()}
        questions={mockQuestions}
        isLearned={() => false}
        isReview={() => false}
        isBookmarked={() => false}
        onToggleLearned={vi.fn()}
        onToggleReview={vi.fn()}
        onToggleBookmark={vi.fn()}
      />
    );

    expect(screen.getByText("Java Memory Model hoạt động thế nào?")).toBeDefined();

    const nextBtn = screen.getByRole("button", { name: /Tiếp \(J\)/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("Phân biệt HashMap và ConcurrentHashMap?")).toBeDefined();
  });

  it("triggers keyboard shortcuts for navigation and answer reveal", () => {
    const handleClose = vi.fn();
    render(
      <InterviewPresentationModal
        isOpen={true}
        onClose={handleClose}
        questions={mockQuestions}
        isLearned={() => false}
        isReview={() => false}
        isBookmarked={() => false}
        onToggleLearned={vi.fn()}
        onToggleReview={vi.fn()}
        onToggleBookmark={vi.fn()}
      />
    );

    // Space to toggle answer
    fireEvent.keyDown(window, { key: " " });
    expect(screen.getByText("JMM quy định cách các luồng giao tiếp qua bộ nhớ chia sẻ.")).toBeDefined();

    // Escape to close
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
