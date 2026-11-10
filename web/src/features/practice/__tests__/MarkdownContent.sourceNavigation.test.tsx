import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarkdownContent } from "../MarkdownContent";

vi.mock("@/components/ui/MermaidRenderer", () => ({
  MermaidRenderer: () => <div data-testid="mermaid-diagram">Rendered diagram</div>,
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
});
