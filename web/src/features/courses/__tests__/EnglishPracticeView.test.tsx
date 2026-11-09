import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { EnglishPracticeView } from "../EnglishPracticeView";

const lessons = [
  { id: "lesson-01", number: 1, title: "Bài 01: Bản thân, điểm mạnh và điểm yếu", titleEn: "About Yourself, Strengths and Weaknesses" },
  { id: "lesson-16", number: 16, title: "Bài 16: Vị trí và yêu cầu công việc", titleEn: "Job Roles and Requirements" }
];

describe("EnglishPracticeView", () => {
  beforeEach(() => localStorage.clear());

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
    fireEvent.click(screen.getByRole("button", { name: /Thẻ tiếp/ }));
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
});
