// @vitest-environment node
import { describe, expect, it } from "vitest";
import { generateJavaSource } from "@/lib/wrappers/javaWrapper";
import { parseCasesYaml } from "@/lib/cases";
import { getProblemContent } from "@/lib/content";
import type { CasesData } from "@/lib/cases";

describe("Java harness regressions", () => {
  it("compares floating point results with absolute and relative tolerance", () => {
    const content = getProblemContent(50)!;
    const source = generateJavaSource(content.javaSource!, parseCasesYaml(content.casesYaml));
    expect(source).toContain("Math.abs(actual - expected) <= 1e-9");
  });
  it("escapes control characters in Java char literals", () => {
    const data: CasesData = {
      schema_version: 1,
      problem_id: 999,
      contract_type: "method",
      language_contract: { class: "Solution", method: "echo", parameters: [{ name: "value", type: "char" }], return_type: "char" },
      cases: [{ name: "newline", input: { value: "\n" }, expected: "\n" }],
    };
    const source = generateJavaSource("class Solution { public char echo(char value) { return value; } }", data);
    expect(source.match(/'\\n'/g)).toHaveLength(2);
  });
  it("places submitted Java imports before helper classes", () => {
    const content = getProblemContent(1)!;
    const source = generateJavaSource("import java.util.HashMap;\nclass Solution {}", parseCasesYaml(content.casesYaml));
    expect(source.indexOf("import java.util.HashMap;")).toBeLessThan(source.indexOf("class ListNode"));
  });
  it("handles void operations through reflection", () => {
    const content = getProblemContent(155)!;
    const source = generateJavaSource(content.javaSource!, parseCasesYaml(content.casesYaml));
    expect(source).not.toContain("actualList.add(obj.push(");
    expect(source).toContain("getDeclaredMethods()");
  });
  it("checks mutation return values and prefixes using real variables", () => {
    const content = getProblemContent(27)!;
    const source = generateJavaSource(content.javaSource!, parseCasesYaml(content.casesYaml));
    expect(source).not.toContain("case0_return");
    expect(source).not.toContain("case0_nums_prefix");
    expect(source).toContain("actual == 2");
    expect(source).toContain("Arrays.copyOf(case0_nums, actual)");
  });
  it("starts each method testcase with a fresh solution", () => {
    const content = getProblemContent(1)!;
    const cases = parseCasesYaml(content.casesYaml)!;
    const source = generateJavaSource(content.javaSource!, cases);
    expect(source.match(/Solution sol = new Solution\(\)/g)).toHaveLength(cases.cases.length);
  });
});
