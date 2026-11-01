import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MermaidRenderer } from "../MermaidRenderer";

const { initialize, renderDiagram } = vi.hoisted(() => ({
  initialize: vi.fn(),
  renderDiagram: vi.fn(),
}));

vi.mock("mermaid", () => ({ default: { initialize, render: renderDiagram } }));

describe("self-hosted Mermaid rendering", () => {
  beforeEach(() => {
    initialize.mockClear();
    renderDiagram.mockReset();
    renderDiagram.mockResolvedValue({ svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>Diagram</text></svg>' });
    document.documentElement.classList.remove("dark");
  });
  afterEach(cleanup);

  it("renders from the bundled dependency with strict security and SVG labels", async () => {
    const { container } = render(<MermaidRenderer chart="flowchart TD; A-->B" />);
    await waitFor(() => expect(container.querySelector("svg text")).toHaveTextContent("Diagram"));
    expect(initialize).toHaveBeenCalledWith(expect.objectContaining({ securityLevel: "strict", htmlLabels: false }));
    expect(renderDiagram).toHaveBeenCalledWith(expect.any(String), "flowchart TD; A-->B");
  });

  it("sanitizes rendered SVG before placing it in the page", async () => {
    renderDiagram.mockResolvedValue({ svg: '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)"><text>Untrusted label</text></a><foreignObject><div>unsafe HTML</div></foreignObject></svg>' });
    const { container } = render(<MermaidRenderer chart='flowchart TD; A[Untrusted label]' />);
    await waitFor(() => expect(container.querySelector("svg text")).toHaveTextContent("Untrusted label"));
    expect(container.querySelector("script, foreignObject, a[href], svg[onload]")).toBeNull();
  });

  it("re-renders when the page switches between light and dark themes", async () => {
    render(<MermaidRenderer chart="sequenceDiagram; Alice->>Bob: Hello" />);
    await waitFor(() => expect(initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: "neutral" })));
    await act(async () => { document.documentElement.classList.add("dark"); });
    await waitFor(() => expect(initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: "dark" })));
  });

  it("shows escaped diagram source when parsing fails", async () => {
    renderDiagram.mockRejectedValue(new Error("Invalid syntax"));
    render(<MermaidRenderer chart="not a diagram" />);
    await waitFor(() => expect(screen.queryByText("Đang dựng sơ đồ vector SVG...")).toBeNull());
    expect(screen.getByText("not a diagram")).toBeVisible();
  });
});
