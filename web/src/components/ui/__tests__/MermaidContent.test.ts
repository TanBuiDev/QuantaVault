import { describe, expect, it } from "vitest";
import mermaid from "mermaid";
import questions from "@/data/interview-questions.json";

describe("canonical Mermaid diagram compatibility", () => {
  const diagrams = questions.flatMap((question) =>
    [...question.answerMarkdown.matchAll(/```mermaid\s*([\s\S]*?)```/g)]
      .map((match, index) => ({ name: `${question.id} diagram ${index + 1}`, chart: match[1] })),
  );

  it("has canonical diagrams to verify", () => {
    expect(diagrams.length).toBeGreaterThan(0);
  });

  it.each(diagrams)("parses $name using strict SVG-label configuration", async ({ chart }) => {
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict", htmlLabels: false });
    await expect(mermaid.parse(chart)).resolves.toBeTruthy();
  });
});
