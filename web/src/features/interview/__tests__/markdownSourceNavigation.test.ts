import { describe, expect, it } from "vitest";
import { markdownLocationAtOffset, resolveMarkdownSourceLocation } from "@/lib/markdownSourceNavigation";

describe("Markdown preview source navigation", () => {
  it("uses original offsets, even when two blocks contain exactly the same text", () => {
    const source = "Same paragraph.\n\nSame paragraph.\n";
    const second = source.lastIndexOf("Same paragraph.");
    expect(resolveMarkdownSourceLocation(source, { offset: 0, line: 1 })).toEqual({ offset: 0, line: 1, column: 1 });
    expect(resolveMarkdownSourceLocation(source, { offset: second, line: 3 })).toEqual({
      offset: second, line: 3, column: 1,
    });
  });

  it("maps CRLF without changing the saved source", () => {
    const source = "## Title\r\n\r\nText\r\n";
    const offset = source.indexOf("Text");
    expect(resolveMarkdownSourceLocation(source, { offset, line: 3 })).toEqual({
      offset, line: 3, column: 1,
    });
    expect(resolveMarkdownSourceLocation(source, { line: 3, column: 1 })?.offset).toBe(offset);
  });

  it("uses JavaScript UTF-16 source offsets after supplementary Unicode characters", () => {
    const source = "😊 intro\n\n```java\nreturn true;\n```";
    const offset = source.indexOf("return true");
    expect(resolveMarkdownSourceLocation(source, { offset, line: 4 })?.offset).toBe(offset);
    expect(markdownLocationAtOffset(source, offset)?.line).toBe(4);
  });

  it("rejects invalid source locations and mismatched lines without guessing", () => {
    const source = "# Title\nbody";
    expect(resolveMarkdownSourceLocation(source)).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { offset: 100 })).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { offset: -1 })).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { offset: 8, line: 1 })).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { line: 8, column: 1 })).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { line: 2, column: 100 })).toBeNull();
    expect(resolveMarkdownSourceLocation(source, { line: 2, column: 1 })?.offset).toBe(8);
  });

  it("supports empty input and the end-of-document insertion location", () => {
    expect(resolveMarkdownSourceLocation("", { offset: 0 })).toEqual({ offset: 0, line: 1, column: 1 });
    expect(resolveMarkdownSourceLocation("a\n", { offset: 2, line: 2 })).toEqual({
      offset: 2, line: 2, column: 1,
    });
  });
});
