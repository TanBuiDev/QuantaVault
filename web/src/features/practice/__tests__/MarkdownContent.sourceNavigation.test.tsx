import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownContent } from "../MarkdownContent";

vi.mock("@/components/ui/MermaidRenderer", () => ({
  MermaidRenderer: () => <div data-testid="mermaid-diagram">
    <button type="button">Copy Mermaid</button>
    <span>Rendered diagram</span>
  </div>,
}));

describe("MarkdownContent source location integration", () => {
  it("navigates to distinct original offsets for identical paragraphs and headings", () => {
    const source = "## Header\n\nSame text.\n\nSame text.\n";
    const navigate = vi.fn();
    render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);

    fireEvent.click(screen.getByRole("heading", { name: "Header" }));
    expect(navigate).toHaveBeenLastCalledWith({ offset: 0, line: 1, column: 1 }, source);

    const paragraphs = screen.getAllByText("Same text.");
    fireEvent.click(paragraphs[0]);
    expect(navigate).toHaveBeenLastCalledWith({
      offset: source.indexOf("Same text."), line: 3, column: 1,
    }, source);
    fireEvent.click(paragraphs[1]);
    expect(navigate).toHaveBeenLastCalledWith({
      offset: source.lastIndexOf("Same text."), line: 5, column: 1,
    }, source);
  });

  it("navigates from a code fence and Mermaid without changing the source", () => {
    const source = "Before\n\n```java\nreturn 42;\n```\n\n```mermaid\nflowchart TD\n A-->B\n```\n";
    const navigate = vi.fn();
    const { container } = render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);
    const code = container.querySelector("pre code");
    expect(code).not.toBeNull();
    fireEvent.click(code!);
    expect(navigate).toHaveBeenCalled();
    expect(navigate.mock.lastCall?.[1]).toBe(source);
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("```java"));

    fireEvent.click(screen.getByTestId("mermaid-diagram"));
    expect(navigate.mock.lastCall?.[1]).toBe(source);
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("```mermaid"));
  });

  it("does not hijack hyperlinks and disables navigation for transformed language views", () => {
    const source = "Click [Docs](https://example.com)\n\n**EN:** Hello\n**VI:** Xin chào";
    const navigate = vi.fn();
    render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);
    const anchor = screen.getByRole("link", { name: "Docs" });
    fireEvent.click(anchor, { button: 0 });
    expect(navigate).not.toHaveBeenCalled();

    const filteredNavigate = vi.fn();
    const { container } = render(
      <MarkdownContent markdown={source} languageMode="vi" onNavigateSource={filteredNavigate} />,
    );
    const paragraph = container.querySelector("p");
    if (paragraph) fireEvent.click(paragraph);
    expect(filteredNavigate).not.toHaveBeenCalled();
  });

  it("does not attach navigation behavior on ordinary read-only Markdown content", () => {
    const source = "Paragraph";
    const { container } = render(<MarkdownContent markdown={source} />);
    expect(container.querySelector("[data-md-source-offset]")).toBeNull();
  });
  it("supports Enter keyboard navigation while preserving heading semantics", () => {
    const source = "## Accessible heading\n\nParagraph";
    const navigate = vi.fn();
    render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);
    const heading = screen.getByRole("heading", { name: "Accessible heading" });
    expect(heading).toHaveAttribute("tabindex", "0");
    expect(heading).toHaveAttribute("aria-keyshortcuts", "Enter");
    heading.focus();
    fireEvent.keyDown(heading, { key: "Enter" });
    expect(navigate).toHaveBeenLastCalledWith({ offset: 0, line: 1, column: 1 }, source);
    fireEvent.keyDown(heading, { key: "Enter", ctrlKey: true });
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("maps table cells, list items, blockquotes and KaTeX to their source", () => {
    const source = [
      "- first", "- second", "", "> quoted text", "",
      "| Name | Count |", "| --- | --- |", "| Alpha | 2 |", "",
      "Value $x^2$.",
    ].join("\n");
    const navigate = vi.fn();
    render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);
    fireEvent.click(screen.getByText("second"));
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("- second"));
    fireEvent.click(screen.getByText("quoted text"));
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("quoted text"));
    fireEvent.click(screen.getByText("Alpha"));
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("| Alpha"));
    const math = document.querySelector(".md-source-navigation .katex");
    expect(math).not.toBeNull();
    fireEvent.click(math!);
    expect(navigate.mock.lastCall?.[0].offset).toBe(source.indexOf("Value"));
  });

  it("does not turn copy buttons or text selection into navigation", () => {
    const source = "Paragraph text\n\n```java\nreturn 1;\n```\n\n```mermaid\nflowchart TD\nA-->B\n```";
    const navigate = vi.fn();
    const clipboardWrite = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: clipboardWrite } });
    const { container } = render(<MarkdownContent markdown={source} onNavigateSource={navigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Copy code block" }));
    expect(clipboardWrite).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Copy Mermaid" }));
    expect(navigate).not.toHaveBeenCalled();
    const paragraph = container.querySelector("p")!;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    selection?.removeAllRanges();
    selection?.addRange(range);
    fireEvent.click(paragraph);
    expect(navigate).not.toHaveBeenCalled();
    selection?.removeAllRanges();
    fireEvent.click(paragraph);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("keeps navigable markup opt-in for read-only pages", () => {
    const { container } = render(<MarkdownContent markdown="# Title\n\nParagraph" />);
    expect(container.querySelector(".md-source-navigation")).toBeNull();
    expect(container.querySelector("[data-md-source-offset]")).toBeNull();
  });
});
