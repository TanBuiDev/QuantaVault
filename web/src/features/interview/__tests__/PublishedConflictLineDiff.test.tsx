import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublishedConflictLineDiff } from "../PublishedConflictLineDiff";
import type { InterviewQuestion } from "@/lib/interview/types";

const original: InterviewQuestion = {
  id: "q-diff", title: "Java concurrency",
  category: "java-core", difficulty: "junior",
  tags: ["Java"], summary: "Common summary",
  answerMarkdown: [
    "Intro", "same 1", "same 2", "same 3", "same 4",
    "old explanation", "same 6", "same 7", "same 8", "same 9", "Outro",
  ].join("\n"),
};
const changed: InterviewQuestion = {
  ...original,
  title: "Java concurrency updated",
  answerMarkdown: original.answerMarkdown.replace("old explanation", "new explanation"),
};

describe("PublishedConflictLineDiff", () => {
  it("shows only changed fields, highlights exact old/new lines and uses compact context by default", () => {
    render(<PublishedConflictLineDiff local={original} website={changed} />);
    expect(screen.getByRole("region", { name: "Thay đổi trường Tiêu đề" })).toBeInTheDocument();
    const region = screen.getByRole("region", { name: "Thay đổi trường Nội dung trả lời" });
    expect(region).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Thay đổi trường Trọng tâm cốt lõi" })).toBeNull();

    const oldLine = region.querySelector('[data-diff-side="left"][data-diff-kind="removed"]');
    const newLine = region.querySelector('[data-diff-side="right"][data-diff-kind="added"]');
    expect(oldLine).toHaveTextContent("old explanation");
    expect(newLine).toHaveTextContent("new explanation");
    expect(oldLine?.querySelector("mark")).toBeInTheDocument();
    expect(newLine?.querySelector("mark")).toBeInTheDocument();
    expect(region.textContent).toContain("dòng không đổi được thu gọn");
    expect(within(region).getByRole("columnheader", { name: /Bản cục bộ/ })).toBeInTheDocument();
    expect(within(region).getByRole("columnheader", { name: /Dữ liệu website hiện tại/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: "Hiển thị cả dòng không đổi" }));
    expect(region.textContent).not.toContain("dòng không đổi được thu gọn");
  });

  it("supports deleted website records without inventing a replacement or mutating content", () => {
    render(<PublishedConflictLineDiff local={original} website={null} />);
    expect(screen.getByRole("region", { name: "Thay đổi trường Tiêu đề" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Thay đổi trường Nội dung trả lời" })).toBeInTheDocument();
    expect(screen.getAllByText(/\+0/).length).toBeGreaterThan(0);
    expect(original.answerMarkdown).toContain("old explanation");
  });

  it("explains deletion marker even when field contents are unchanged", () => {
    render(<PublishedConflictLineDiff local={original} website={original} localDeleted />);
    expect(screen.getByText(/đã đánh dấu xóa câu hỏi/)).toBeInTheDocument();
  });
});
