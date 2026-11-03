import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InterviewSummaryMarkdown } from "../InterviewSummaryMarkdown";

describe("InterviewSummaryMarkdown", () => {
  it("renders bold, inline code and emphasis instead of showing Markdown delimiters", () => {
    const { container } = render(
      <InterviewSummaryMarkdown markdown={"**Bytecode** được tạo bởi `javac`, sau đó *JVM* chạy nó."} />
    );
    expect(screen.getByText("Bytecode").tagName).toBe("STRONG");
    expect(screen.getByText("javac").tagName).toBe("CODE");
    expect(screen.getByText("JVM").tagName).toBe("EM");
    expect(container.textContent).not.toContain("**");
    expect(container.textContent).not.toContain("`");
  });

  it("keeps Markdown lists, paragraphs and line breaks readable in a compact card", () => {
    const { container } = render(
      <InterviewSummaryMarkdown markdown={"Dòng đầu.\n\n- Bytecode\n- JVM\n\nĐoạn cuối.  \nXuống dòng."} />
    );
    expect(container.querySelectorAll("p")).toHaveLength(2);
    expect(container.querySelectorAll("ul > li")).toHaveLength(2);
    expect(container.querySelector("br")).toBeInTheDocument();
    expect(screen.getByText("Bytecode")).toBeInTheDocument();
  });

  it("retains text scaling and does not execute embedded HTML", () => {
    const { container } = render(
      <InterviewSummaryMarkdown
        markdown={'**JVM** <script>alert("bad")</script>'}
        textScale={125}
      />
    );
    expect(container.querySelector('[data-testid="interview-summary-markdown"]')).toHaveStyle({ fontSize: "17.5px" });
    expect(screen.getByText("JVM").tagName).toBe("STRONG");
    expect(container.querySelector("script")).toBeNull();
  });
});
