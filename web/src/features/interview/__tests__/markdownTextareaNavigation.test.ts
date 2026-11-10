import { describe, expect, it, vi, afterEach } from "vitest";
import { focusMarkdownTextareaAtOffset } from "../markdownTextareaNavigation";

describe("Markdown textarea source navigation", () => {
  afterEach(() => { vi.restoreAllMocks(); document.body.innerHTML = ""; });

  it("only updates caret/focus and preserves the value and saved scrollX", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "## Heading\n\nText";
    document.body.append(textarea);
    textarea.scrollLeft = 12;
    expect(focusMarkdownTextareaAtOffset(textarea, 3)).toBe(true);
    expect(document.activeElement).toBe(textarea);
    expect(textarea.selectionStart).toBe(3);
    expect(textarea.selectionEnd).toBe(3);
    expect(textarea.value).toBe("## Heading\n\nText");
    expect(textarea.scrollLeft).toBe(12);
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("uses measured visual wrapping when the caret is below the viewport", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "a very long line ".repeat(100) + "\n## Target";
    document.body.append(textarea);
    vi.spyOn(textarea, "clientWidth", "get").mockReturnValue(200);
    vi.spyOn(textarea, "clientHeight", "get").mockReturnValue(160);
    vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function(this: HTMLElement) {
      return this.textContent === "\u200b" ? 740 : 0;
    });
    const position = textarea.value.indexOf("## Target");
    expect(focusMarkdownTextareaAtOffset(textarea, position)).toBe(true);
    expect(textarea.scrollTop).toBeGreaterThan(500);
    expect(textarea.value.endsWith("## Target")).toBe(true);
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it("rejects invalid offsets and skips mirrors for extremely large documents", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "a".repeat(200_001);
    document.body.append(textarea);
    vi.spyOn(textarea, "clientWidth", "get").mockReturnValue(200);
    expect(focusMarkdownTextareaAtOffset(textarea, -1)).toBe(false);
    expect(focusMarkdownTextareaAtOffset(textarea, textarea.value.length + 1)).toBe(false);
    expect(focusMarkdownTextareaAtOffset(textarea, 200_001)).toBe(true);
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
