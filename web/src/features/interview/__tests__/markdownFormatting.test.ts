import { describe, expect, it } from "vitest";
import { toggleMarkdownInline, wrapMarkdown } from "../markdownFormatting";

describe("Markdown inline formatting toggle", () => {
  it("Ctrl+B twice restores the original selected text and selection", () => {
    const original = "Mẫu trả lời";
    const first = toggleMarkdownInline(original, 0, original.length, "bold", "in đậm");
    expect(first).toEqual({
      value: "**Mẫu trả lời**",
      selectionStart: 2,
      selectionEnd: original.length + 2
    });
    const second = toggleMarkdownInline(first.value, first.selectionStart, first.selectionEnd, "bold", "in đậm");
    expect(second).toEqual({ value: original, selectionStart: 0, selectionEnd: original.length });
  });

  it("Ctrl+I twice restores the original selected text", () => {
    const first = toggleMarkdownInline("Java", 0, 4, "italic", "in nghiêng");
    expect(first.value).toBe("*Java*");
    const second = toggleMarkdownInline(first.value, first.selectionStart, first.selectionEnd, "italic", "in nghiêng");
    expect(second.value).toBe("Java");
  });

  it("unwraps selection including both delimiters", () => {
    expect(toggleMarkdownInline("**Java**", 0, 8, "bold", "in đậm"))
      .toEqual({ value: "Java", selectionStart: 0, selectionEnd: 4 });
    expect(toggleMarkdownInline("*Java*", 0, 6, "italic", "in nghiêng").value).toBe("Java");
  });

  it("unwraps formatted text when the caret is inside (not selected)", () => {
    const result = toggleMarkdownInline("## **Mẫu trả lời**", 8, 8, "bold", "in đậm");
    expect(result.value).toBe("## Mẫu trả lời");
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(6);
  });

  it("preserves the other style in triple asterisk spans", () => {
    const src = "***Java***";
    expect(toggleMarkdownInline(src, 3, 7, "bold", "in đậm").value).toBe("*Java*");
    expect(toggleMarkdownInline(src, 3, 7, "italic", "in nghiêng").value).toBe("**Java**");
    expect(toggleMarkdownInline(src, 5, 5, "bold", "in đậm").value).toBe("*Java*");
    expect(toggleMarkdownInline(src, 5, 5, "italic", "in nghiêng").value).toBe("**Java**");
  });

  it("wraps italic selection inside bold without breaking the outer style", () => {
    const src = "**Java**";
    const edited = toggleMarkdownInline(src, 2, 6, "italic", "in nghiêng");
    expect(edited.value).toBe("***Java***");
    expect(toggleMarkdownInline(edited.value, edited.selectionStart, edited.selectionEnd, "italic", "in nghiêng").value).toBe(src);
  });

  it("does not modify other parts of a Markdown document", () => {
    const doc = "### 3. Vì sao lựa chọn REST API?\n(Mẫu trả lời)\n\n> Ghi chú";
    const start = doc.indexOf("(Mẫu trả lời)");
    const first = toggleMarkdownInline(doc, start, start + "(Mẫu trả lời)".length, "bold", "in đậm");
    expect(first.value).toBe("### 3. Vì sao lựa chọn REST API?\n**(Mẫu trả lời)**\n\n> Ghi chú");
    expect(toggleMarkdownInline(first.value, first.selectionStart, first.selectionEnd, "bold", "in đậm").value).toBe(doc);
  });

  it("allows empty caret toggles: placeholder, then unformat", () => {
    const first = toggleMarkdownInline("", 0, 0, "bold", "in đậm");
    expect(first).toEqual({ value: "**in đậm**", selectionStart: 2, selectionEnd: 8 });
    const second = toggleMarkdownInline(first.value, first.selectionStart, first.selectionEnd, "bold", "in đậm");
    expect(second).toEqual({ value: "in đậm", selectionStart: 0, selectionEnd: 6 });
    const emptyPair = toggleMarkdownInline("****", 2, 2, "bold", "in đậm");
    expect(emptyPair.value).toBe("");
  });

  it("leaves fenced Java snippets untouched when inline toggle is invoked inside", () => {
    const md = "~~~"; // A Markdown triple-backtick fence is assembled to avoid codegen metadata.
    const fence = String.fromCharCode(96).repeat(3);
    const doc = fence + "java\nString name = \"Java\";\n" + fence + "\nParagraph";
    const caret = doc.indexOf("name") + 2;
    expect(toggleMarkdownInline(doc, caret, caret, "bold", "in đậm").value).toBe(doc);
    expect(toggleMarkdownInline(doc, 0, doc.length, "bold", "in đậm").value).toBe(doc);
    expect(md).toBe("~~~");
  });

  it("preserves basic insertion behavior for non-inline formatting", () => {
    const insert = wrapMarkdown("foo", 0, 3, "### ", "\n", "Heading");
    expect(insert).toEqual({ value: "### foo\n", selectionStart: 4, selectionEnd: 7 });
  });
});
