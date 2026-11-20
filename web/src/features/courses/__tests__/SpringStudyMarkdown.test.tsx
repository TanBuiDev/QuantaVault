import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  SpringStudyMarkdown,
  getSpringStudySections,
  parseSpringStudyMarkdown,
  transformBilingualMarkdown
} from "../SpringStudyMarkdown";

const example = [
  "## 3. Four Main Concepts / Bốn khái niệm chính",
  "",
  "**EN:** Spring Boot provides sensible defaults.",
  "",
  "**VI:** Spring Boot cung cấp những thiết lập mặc định hợp lý.",
  "",
  "### 3.1. Auto-configuration / Tự động cấu hình",
  "",
  "- **EN:** Auto-configuration depends on project libraries.",
  "  **VI:** Tự động cấu hình dựa trên thư viện của dự án.",
  "",
  "- **EN:** Embedded servers simplify deployment.",
  "  **VI:** Máy chủ nhúng đơn giản hóa việc triển khai."
].join("\n");

describe("SpringStudyMarkdown", () => {
  it("keeps heading numbering in Vietnamese-only mode and stable table-of-contents anchors", () => {
    const { container, rerender } = render(<SpringStudyMarkdown markdown={example} mode="vi" />);
    expect(container.querySelector("#spring-study-section-0 h2")).toHaveTextContent("3. Bốn khái niệm chính");
    expect(container.querySelector("h3")).toHaveTextContent("3.1. Tự động cấu hình");
    expect(getSpringStudySections(example, "vi")[0]).toEqual({
      id: "spring-study-section-0",
      title: "3. Bốn khái niệm chính"
    });
    rerender(<SpringStudyMarkdown markdown={example} mode="en" />);
    expect(container.querySelector("#spring-study-section-0 h2")).toHaveTextContent("3. Four Main Concepts");
    expect(container.querySelector("h3")).toHaveTextContent("3.1. Auto-configuration");
  });

  it("displays exactly one bullet per bilingual idea without labels or translation blockquotes", () => {
    const { container } = render(<SpringStudyMarkdown markdown={example} mode="bilingual" />);
    const bullets = container.querySelectorAll("[data-study-bullets] > li");
    expect(bullets).toHaveLength(2);
    expect(container.querySelectorAll('[data-study-language="vi"]').length).toBeGreaterThan(1);
    expect(container.querySelectorAll("[data-study-pair] blockquote")).toHaveLength(0);
    expect(container.querySelector("[data-spring-study-content]")).toHaveClass("max-w-[880px]");
    expect(container.querySelector('[data-study-language="vi"]')).toHaveClass("dark:text-[#7DD3E8]");
    expect(screen.getByText(/Tự động cấu hình dựa trên thư viện của dự án/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/EN:|VI:|🇻🇳|Bản dịch:|Dịch:/);
  });

  it("uses the normal foreground color for Vietnamese-only reading", () => {
    const { container } = render(<SpringStudyMarkdown markdown={example} mode="vi" />);
    expect(container.querySelector('[data-study-language="vi"]')).not.toBeNull();
    expect(container.querySelector('[data-study-language="vi"]')).not.toHaveClass("dark:text-[#7DD3E8]");
    expect(container.querySelector('[data-study-language="en"]')).toBeNull();
    expect(container.textContent).not.toContain("Spring Boot provides sensible defaults.");
    expect(container.textContent).toContain("Spring Boot cung cấp những thiết lập mặc định hợp lý.");
    expect(container.querySelectorAll("[data-study-bullets] > li")).toHaveLength(2);
  });

  it("keeps real Markdown quotes and code fences intact", () => {
    const fence = String.fromCharCode(96).repeat(3);
    const markdown = [
      "## 1. Overview / Tổng quan",
      "",
      "> This is a real quotation, not a translation.",
      "",
      fence + "java",
      "// **EN:** comment must remain unchanged",
      "String path = " + JSON.stringify("spring / api") + ";",
      fence,
      "",
      "**EN:** An explanation.",
      "",
      "**VI:** Một lời giải thích."
    ].join("\n");
    const blocks = parseSpringStudyMarkdown(markdown);
    expect(blocks.some((b) => b.type === "raw" && b.markdown.includes("String path"))).toBe(true);
    const { container } = render(<SpringStudyMarkdown markdown={markdown} mode="bilingual" />);
    expect(container.querySelector("[data-study-raw] blockquote")).toBeInTheDocument();
    expect(container.querySelector("pre")).toBeInTheDocument();
    expect(container.querySelector("pre")?.textContent).toContain("// **EN:** comment must remain unchanged");
    expect(container.querySelector("[data-study-pair] blockquote")).toBeNull();
  });

  it("filters whole language pairs rather than leaving orphan translations", () => {
    const { container } = render(
      <SpringStudyMarkdown markdown={example} mode="bilingual" query="sensible defaults" />
    );
    expect(container.textContent).toContain("Spring Boot provides sensible defaults.");
    expect(container.textContent).toContain("Spring Boot cung cấp những thiết lập mặc định hợp lý.");
    expect(container.querySelectorAll("[data-study-bullets] > li")).toHaveLength(0);
  });

  it("projects source into clean Markdown in all three modes", () => {
    const vi = transformBilingualMarkdown(example, "vi");
    const en = transformBilingualMarkdown(example, "en");
    const bi = transformBilingualMarkdown(example, "bilingual");
    expect(vi).toContain("## 3. Bốn khái niệm chính");
    expect(vi).toContain("### 3.1. Tự động cấu hình");
    expect(en).toContain("## 3. Four Main Concepts");
    expect(en).not.toContain("Máy chủ nhúng");
    for (const projection of [vi, en, bi]) {
      expect(projection).not.toContain("**EN:**");
      expect(projection).not.toContain("**VI:**");
      expect(projection).not.toContain("🇻🇳");
    }
  });
});
