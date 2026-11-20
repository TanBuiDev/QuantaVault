import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringDockFlashcards } from "../SpringDockFlashcards";
import type { CourseFlashcard } from "@/lib/courses";

const mockFlashcards: CourseFlashcard[] = [
  {
    id: "fc-1",
    questionEn: "What is Spring IoC?",
    questionVi: "Spring IoC là gì?",
    answerEn: "Inversion of Control container.",
    answerVi: "Bộ chứa đảo ngược quyền điều khiển.",
    explanationVi: "Quản lý vòng đời và phụ thuộc của các bean."
  },
  {
    id: "fc-2",
    questionEn: "What is Spring Bean?",
    questionVi: "Spring Bean là gì?",
    answerEn: "An object managed by Spring IoC.",
    answerVi: "Đối tượng được quản lý bởi Spring IoC."
  }
];

describe("SpringDockFlashcards", () => {
  it("renders card counter, audio button, and front question", () => {
    render(<SpringDockFlashcards flashcards={mockFlashcards} />);

    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Nghe phát âm/i })).toBeInTheDocument();
    expect(screen.getByText(/What is Spring (IoC|Bean)\?/)).toBeInTheDocument();
  });

  it("flips card on click to reveal answer", () => {
    render(<SpringDockFlashcards flashcards={mockFlashcards} />);

    const frontText = screen.getByText(/What is Spring (IoC|Bean)\?/);
    fireEvent.click(frontText);

    expect(screen.getByText(/Inversion of Control container|An object managed by Spring IoC/)).toBeInTheDocument();
  });

  it("navigates through deck and displays completion state with restart button", () => {
    render(<SpringDockFlashcards flashcards={mockFlashcards} />);

    // Next card 1 -> 2
    const nextBtn = screen.getByRole("button", { name: /Thẻ tiếp theo|Xem kết quả/i });
    fireEvent.click(nextBtn);

    // Next card 2 -> Completed
    const finalNextBtn = screen.getByRole("button", { name: /Thẻ tiếp theo|Xem kết quả/i });
    fireEvent.click(finalNextBtn);

    expect(screen.getByText("Hoàn thành!")).toBeInTheDocument();
    const restartBtn = screen.getByRole("button", { name: /Làm lại/i });
    expect(restartBtn).toBeInTheDocument();

    // Click restart
    fireEvent.click(restartBtn);
    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  it("supports keyboard navigation with Space and ArrowRight", () => {
    render(<SpringDockFlashcards flashcards={mockFlashcards} />);

    // Space key flips card
    fireEvent.keyDown(window, { code: "Space" });
    expect(screen.getByText(/Inversion of Control container|An object managed by Spring IoC/)).toBeInTheDocument();

    // ArrowRight advances to next card
    fireEvent.keyDown(window, { code: "ArrowRight" });
    expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument();
  });
});
