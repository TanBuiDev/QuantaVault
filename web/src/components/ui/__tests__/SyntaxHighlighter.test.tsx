import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SyntaxHighlighter } from "../SyntaxHighlighter";
import { MarkdownContent } from "@/features/practice/MarkdownContent";

function tokensWithClass(container: HTMLElement, className: string): string[] {
  return Array.from(container.querySelectorAll(`code > span.${className}`)).map(
    (token) => token.textContent ?? "",
  );
}

describe("SyntaxHighlighter language-aware comments", () => {
  it("highlights PostgreSQL -- and /* */ comments consistently", () => {
    const code = [
      "-- Bắt đầu transaction",
      "BEGIN;",
      "/* Khóa dòng tồn kho */",
      "SELECT stock_on_hand FROM inventory_balances; -- Ghi chú cuối dòng",
    ].join("\n");

    const { container } = render(<SyntaxHighlighter code={code} language="sql" />);
    const comments = tokensWithClass(container, "italic");

    expect(comments).toEqual([
      "-- Bắt đầu transaction",
      "/* Khóa dòng tồn kho */",
      "-- Ghi chú cuối dòng",
    ]);
    expect(container.textContent).toBe(code);
  });

  it("does not turn SQL string values containing -- into comments", () => {
    const code = "SELECT '-- is literal text' AS label; -- real comment";
    const { container } = render(<SyntaxHighlighter code={code} language="postgresql" />);

    expect(tokensWithClass(container, "italic")).toEqual(["-- real comment"]);
    const stringToken = Array.from(container.querySelectorAll("code > span")).find(
      (token) => token.textContent === "'-- is literal text'",
    );
    expect(stringToken?.className).toContain("text-emerald-400");
  });

  it("keeps Java -- as decrement and // as a comment", () => {
    const code = "int i = 2;\ni--; // decrement";
    const { container } = render(<SyntaxHighlighter code={code} language="java" />);

    expect(tokensWithClass(container, "italic")).toEqual(["// decrement"]);
    expect(container.textContent).toBe(code);
  });

  it("also renders SQL line comments correctly through MarkdownContent", () => {
    const markdown = "```sql\n-- Chú thích SQL\nSELECT 1;\n```";
    const { container } = render(<MarkdownContent markdown={markdown} />);
    expect(tokensWithClass(container, "italic")).toEqual(["-- Chú thích SQL"]);
  });
});
