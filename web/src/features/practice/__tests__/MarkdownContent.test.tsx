import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownContent } from "../MarkdownContent";

describe("MarkdownContent math rendering", () => {
  it("renders inline math properly via KaTeX", () => {
    const markdown = "The limit is $10^5$ elements and $x^n$.";
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    // KaTeX outputs elements with class katex
    const katexElements = container.querySelectorAll(".katex");
    expect(katexElements.length).toBeGreaterThan(0);
  });

  it("renders complex expressions such as fractions and inequalities", () => {
    const markdown = "$-2^{31} \\le n \\le 2^{31} - 1$ and $\\frac{1}{2^2} = 0.25$";
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    const katexElements = container.querySelectorAll(".katex");
    expect(katexElements.length).toBeGreaterThan(0);
  });

  it("renders code blocks and inline code alongside math", () => {
    const markdown = "Array `prices` of length $n \\le 10^5$ with `prices[i]`.";
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    const codeElements = container.querySelectorAll("code");
    expect(codeElements.length).toBeGreaterThanOrEqual(2);
    
    const katexElements = container.querySelectorAll(".katex");
    expect(katexElements.length).toBe(1);
  });

  it("renders pre code block with a copy button", () => {
    const markdown = "```text\nInput: citations = [3,0,6,1,5]\nOutput: 3\n```";
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    
    const copyBtn = container.querySelector("button[aria-label='Copy code block']");
    expect(copyBtn).toBeInTheDocument();
  });
});

