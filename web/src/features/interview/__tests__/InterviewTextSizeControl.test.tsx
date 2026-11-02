import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InterviewTextSizeControl } from "../InterviewTextSizeControl";
import { useInterviewTextSize } from "../useInterviewTextSize";
import { MarkdownContent } from "@/features/practice/MarkdownContent";

function Demo() {
  const { textScale, changeTextScale } = useInterviewTextSize();
  return <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />;
}

describe("Interview text size", () => {
  beforeEach(() => localStorage.clear());

  it("adjusts and stores the preferred text scale", () => {
    const view = render(<Demo />);
    fireEvent.click(screen.getByRole("button", { name: "Tăng cỡ chữ" }));
    expect(screen.getByRole("button", { name: /Đặt lại cỡ chữ/ })).toHaveTextContent("110%");
    expect(localStorage.getItem("quantavault_interview_text_scale")).toBe("110");
    view.unmount();
    localStorage.setItem("quantavault_interview_text_scale", "130");
    render(<Demo />);
    expect(screen.getByRole("button", { name: /Đặt lại cỡ chữ/ })).toHaveTextContent("130%");
    fireEvent.click(screen.getByRole("button", { name: /Đặt lại cỡ chữ/ }));
    expect(localStorage.getItem("quantavault_interview_text_scale")).toBe("100");
  });

  it("stops at the minimum and maximum", () => {
    const { rerender } = render(<InterviewTextSizeControl value={80} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Giảm cỡ chữ" })).toBeDisabled();
    rerender(<InterviewTextSizeControl value={160} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Tăng cỡ chữ" })).toBeDisabled();
  });

  it("scales Markdown and code without affecting unrelated pages", () => {
    const { container, rerender } = render(<MarkdownContent markdown={"```sql\nSELECT 1;\n```"} textScale={140} />);
    expect((container.firstElementChild as HTMLElement).style.zoom).toBe("1.4");
    rerender(<MarkdownContent markdown="Hello" />);
    expect((container.firstElementChild as HTMLElement).style.zoom).toBe("");
  });
});
