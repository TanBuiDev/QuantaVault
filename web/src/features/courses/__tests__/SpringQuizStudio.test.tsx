import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpringQuizStudio } from "../SpringQuizStudio";
import type { CourseQuizQuestion } from "@/lib/courses";

const mockQuestions: CourseQuizQuestion[] = [
  {
    id: "q-1",
    number: 1,
    title: "Mục đích chính của Spring Boot",
    questionEn: "What is the primary purpose of Spring Boot?",
    questionVi: "Mục đích chính của Spring Boot là gì?",
    options: [
      {
        id: "A",
        textEn: "To provide a new programming language",
        textVi: "Cung cấp ngôn ngữ mới",
        isCorrect: false
      },
      {
        id: "B",
        textEn: "To simplify Java application development by automating configuration",
        textVi: "Đơn giản hóa việc phát triển ứng dụng Java bằng cách tự động hóa cấu hình",
        isCorrect: true
      }
    ],
    feedbackEn: "Nice work",
    feedbackVi: "Làm tốt lắm!",
    explanationEn: "Spring Boot simplifies Java development.",
    explanationVi: "Spring Boot giúp đơn giản hóa phát triển ứng dụng Java."
  },
  {
    id: "q-2",
    number: 2,
    title: "Công cụ khởi tạo",
    questionEn: "Which tool is commonly used to generate a Spring Boot project?",
    questionVi: "Công cụ nào thường được dùng để tạo một dự án Spring Boot?",
    options: [
      {
        id: "A",
        textEn: "Maven Central",
        textVi: "Maven Central",
        isCorrect: false
      },
      {
        id: "B",
        textEn: "Spring Initializr",
        textVi: "Spring Initializr",
        isCorrect: true
      }
    ],
    feedbackEn: "Nice work",
    feedbackVi: "Làm tốt lắm!",
    explanationEn: "Spring Initializr is used to generate projects.",
    explanationVi: "Spring Initializr được dùng để tạo dự án."
  }
];

describe("SpringQuizStudio", () => {
  it("renders quiz title, question count, and 3 language tabs", () => {
    render(
      <SpringQuizStudio
        questions={mockQuestions}
        lessonTitle="Bài 21: Bài tập trắc nghiệm Spring Boot"
      />
    );

    expect(screen.getByText("Bài 21: Bài tập trắc nghiệm Spring Boot")).toBeInTheDocument();
    expect(screen.getByText("2 câu hỏi")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Song ngữ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tiếng Việt" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tiếng Anh" })).toBeInTheDocument();

    // Default mode is bilingual: both English and Vietnamese are present
    expect(screen.getByText("What is the primary purpose of Spring Boot?")).toBeInTheDocument();
    expect(screen.getByText("Mục đích chính của Spring Boot là gì?")).toBeInTheDocument();
  });

  it("toggles between Song ngữ, Tiếng Việt, and Tiếng Anh modes", () => {
    render(
      <SpringQuizStudio
        questions={mockQuestions}
        lessonTitle="Bài 21: Bài tập trắc nghiệm Spring Boot"
      />
    );

    // Switch to Tiếng Việt only
    fireEvent.click(screen.getByRole("button", { name: "Tiếng Việt" }));
    expect(screen.getAllByText("Mục đích chính của Spring Boot là gì?").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("What is the primary purpose of Spring Boot?")).not.toBeInTheDocument();

    // Switch to Tiếng Anh only
    fireEvent.click(screen.getByRole("button", { name: "Tiếng Anh" }));
    expect(screen.getAllByText("What is the primary purpose of Spring Boot?").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Mục đích chính của Spring Boot là gì?")).not.toBeInTheDocument();
  });

  it("evaluates answers instantly and shows explanation and feedback", () => {
    render(
      <SpringQuizStudio
        questions={mockQuestions}
        lessonTitle="Bài 21: Bài tập trắc nghiệm Spring Boot"
      />
    );

    // Explanation should not be visible before answering
    expect(screen.queryByText(/Phản hồi Coursera:/i)).not.toBeInTheDocument();

    // Click correct option B on Question 1
    const correctOptionBtn = screen.getByText(/To simplify Java application development/i).closest("button")!;
    fireEvent.click(correctOptionBtn);

    // Shows correct badge and reveals explanation
    expect(screen.getByText("Chính xác (+1)")).toBeInTheDocument();
    expect(screen.getByText(/Phản hồi Coursera:/i)).toBeInTheDocument();
    expect(screen.getByText(/Nice work — Làm tốt lắm!/i)).toBeInTheDocument();
    expect(screen.getByText(/Spring Boot simplifies Java development./i)).toBeInTheDocument();
  });

  it("handles wrong answer, highlights correct answer and reveals explanation", () => {
    render(
      <SpringQuizStudio
        questions={mockQuestions}
        lessonTitle="Bài 21: Bài tập trắc nghiệm Spring Boot"
      />
    );

    // Click wrong option A on Question 1
    const wrongOptionBtn = screen.getByText(/To provide a new programming language/i).closest("button")!;
    fireEvent.click(wrongOptionBtn);

    // Shows incorrect badge
    expect(screen.getByText("Chưa chính xác")).toBeInTheDocument();
    // Highlights the correct option
    expect(screen.getByText("Đáp án đúng")).toBeInTheDocument();
    // Reveals explanation
    expect(screen.getByText(/Spring Boot simplifies Java development./i)).toBeInTheDocument();
  });

  it("shows completion banner when all questions are answered and supports reset", () => {
    render(
      <SpringQuizStudio
        questions={mockQuestions}
        lessonTitle="Bài 21: Bài tập trắc nghiệm Spring Boot"
      />
    );

    // Answer Q1 correctly
    fireEvent.click(screen.getByText(/To simplify Java application development/i).closest("button")!);
    // Answer Q2 correctly
    fireEvent.click(screen.getAllByText(/Spring Initializr/i)[0].closest("button")!);

    // Completion banner appears
    expect(screen.getByText(/Chúc mừng bạn đã hoàn thành bài kiểm tra!/i)).toBeInTheDocument();
    expect(screen.getByText(/Kết quả của bạn: 2 \/ 2 câu đúng \(100%\)/i)).toBeInTheDocument();

    // Click Retake / Làm lại bài thi
    const resetBtns = screen.getAllByRole("button", { name: /Làm lại/i });
    fireEvent.click(resetBtns[0]);

    // Questions are reset to unanswered
    expect(screen.queryByText(/Chúc mừng bạn đã hoàn thành bài kiểm tra!/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Chính xác (+1)")).not.toBeInTheDocument();
  });
});
