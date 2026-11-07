import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InterviewEditModal } from "../InterviewEditModal";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import type { InterviewQuestion } from "@/lib/interview/types";

vi.mock("@/features/practice/MarkdownContent", () => ({ MarkdownContent: () => null }));

const placeholder = "Nhập nội dung câu trả lời chi tiết bằng cú pháp Markdown...";
let pendingFrames: FrameRequestCallback[] = [];

function mount(initial: string) {
  const question: InterviewQuestion = {
    id: "q-inline-toggle-integration",
    title: "Markdown shortcut test",
    category: "java-core",
    difficulty: "junior",
    tags: ["Java"],
    summary: "",
    answerMarkdown: initial
  };
  render(
    <ToastProvider>
      <ConfirmProvider>
        <InterviewEditModal
          isOpen
          question={question}
          canonicalQuestion={question}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      </ConfirmProvider>
    </ToastProvider>
  );
  return screen.getByPlaceholderText(placeholder) as HTMLTextAreaElement;
}

function flushSelectionFrame() {
  act(() => {
    const frames = pendingFrames.splice(0);
    frames.forEach((frame) => frame(0));
  });
}

describe("Interview edit Markdown shortcuts and toolbar", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    pendingFrames = [];
    vi.stubGlobal("requestAnimationFrame", (frame: FrameRequestCallback) => {
      pendingFrames.push(frame);
      return pendingFrames.length;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("Ctrl+B then toolbar B returns the selected content to plain text", () => {
    const textarea = mount("(Mẫu trả lời)");
    textarea.focus();
    textarea.setSelectionRange(0, textarea.value.length);

    fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
    flushSelectionFrame();
    expect(textarea.value).toBe("**(Mẫu trả lời)**");
    expect(textarea.selectionStart).toBe(2);
    expect(textarea.selectionEnd).toBe(15);

    fireEvent.click(screen.getByTitle("In đậm (Ctrl+B)"));
    flushSelectionFrame();
    expect(textarea.value).toBe("(Mẫu trả lời)");
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(13);
    expect(document.activeElement).toBe(textarea);
  });

  it("Ctrl+B twice restores original text, scroll position and focus", () => {
    const textarea = mount("Java");
    textarea.focus();
    textarea.scrollTop = 120;
    textarea.scrollLeft = 8;
    textarea.setSelectionRange(0, 4);

    fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
    flushSelectionFrame();
    fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
    flushSelectionFrame();

    expect(textarea.value).toBe("Java");
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(4);
    expect(textarea.scrollTop).toBe(120);
    expect(textarea.scrollLeft).toBe(8);
    expect(document.activeElement).toBe(textarea);
  });

  it("Ctrl+I toggles italic without breaking existing bold Markdown", () => {
    const textarea = mount("Java");
    textarea.setSelectionRange(0, 4);
    fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
    flushSelectionFrame();

    fireEvent.keyDown(textarea, { key: "i", ctrlKey: true });
    flushSelectionFrame();
    expect(textarea.value).toBe("***Java***");

    fireEvent.click(screen.getByTitle("In nghiêng (Ctrl+I)"));
    flushSelectionFrame();
    expect(textarea.value).toBe("**Java**");
  });

  it("unformats a bold span with a caret inside the text", () => {
    const textarea = mount("**Java**");
    textarea.setSelectionRange(4, 4);
    fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
    flushSelectionFrame();
    expect(textarea.value).toBe("Java");
    expect(textarea.selectionStart).toBe(2);
    expect(textarea.selectionEnd).toBe(2);
  });
});
