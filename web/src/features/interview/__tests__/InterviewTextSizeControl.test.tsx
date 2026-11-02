import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InterviewTextSizeControl } from "../InterviewTextSizeControl";
import { useInterviewTextSize } from "../useInterviewTextSize";
import { MarkdownContent } from "@/features/practice/MarkdownContent";

function Demo() {
  const { textScale, changeTextScale } = useInterviewTextSize();
  return <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />;
}

describe("Interview text size", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.useRealTimers());

  it("saves changes and shows percentage only after clicking a zoom button", () => {
    const view = render(<Demo />);
    expect(screen.queryByRole("button", { name: /Đặt lại cỡ chữ/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tăng cỡ chữ" }));
    expect(screen.getByRole("status")).toHaveTextContent("110%");
    expect(localStorage.getItem("quantavault_interview_text_scale")).toBe("110");
    fireEvent.click(screen.getByRole("button", { name: "Giảm cỡ chữ" }));
    expect(screen.getByRole("status")).toHaveTextContent("100%");
    view.unmount();
    localStorage.setItem("quantavault_interview_text_scale", "130");
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Tăng cỡ chữ" }));
    expect(screen.getByRole("status")).toHaveTextContent("140%");
  });

  it("shows one non-blocking centered toast and auto-hides it", () => {
    vi.useFakeTimers();
    render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Tăng cỡ chữ" }));
    fireEvent.click(screen.getByRole("button", { name: "Tăng cỡ chữ" }));
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("120%");
    expect(screen.getByRole("status").parentElement).toHaveClass("pointer-events-none", "fixed", "inset-0");
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByRole("status")).toHaveClass("opacity-0");
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("disables zoom buttons at bounds", () => {
    const { rerender } = render(<InterviewTextSizeControl value={80} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Giảm cỡ chữ" })).toBeDisabled();
    rerender(<InterviewTextSizeControl value={160} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Tăng cỡ chữ" })).toBeDisabled();
  });

  it("scales Markdown and SQL code without affecting other documents", () => {
    const { container, rerender } = render(<MarkdownContent markdown={"```sql\nSELECT 1;\n```"} textScale={140} />);
    expect((container.firstElementChild as HTMLElement).style.zoom).toBe("1.4");
    rerender(<MarkdownContent markdown="Hello" />);
    expect((container.firstElementChild as HTMLElement).style.zoom).toBe("");
  });
});
