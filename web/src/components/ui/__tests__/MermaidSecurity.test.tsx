import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { MermaidRenderer } from "../MermaidRenderer";

// jsdom has no SVG layout engine; these measurements let real Mermaid lay out
// nodes while keeping its actual parser, strict mode and sanitizer in the test.
beforeAll(() => {
  Object.defineProperty(SVGElement.prototype, "getBBox", {
    configurable: true,
    value: () => ({ x: 0, y: 0, width: 100, height: 20 }),
  });
  Object.defineProperty(SVGElement.prototype, "getComputedTextLength", {
    configurable: true,
    value: () => 100,
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("real Mermaid strict rendering", () => {
  it("does not activate malicious links or HTML handlers from diagram source", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const chart = '%%{init: {"securityLevel": "loose", "htmlLabels": true}}%%\nflowchart TD\nA["<img src=x onerror=alert(1)>"] --> B["safe"]\nclick B "javascript:alert(1)"';
    const { container } = render(<MermaidRenderer chart={chart} />);
    await waitFor(() => expect(container.querySelector("svg.flowchart")).not.toBeNull(), { timeout: 15000 });
    expect(container.querySelector("script, img, foreignObject, [onerror], [onload], a[href], a[xlink\\:href]")).toBeNull();
    expect(alertSpy).not.toHaveBeenCalled();
  }, 20000);
});
