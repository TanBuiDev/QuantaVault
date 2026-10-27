// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseExecution } from "../parseExecution";
import { validateCases } from "../validateCases";
import type { CasesData } from "@/lib/cases";

const cases: CasesData = {
  schema_version: 1, problem_id: 1, contract_type: "method",
  language_contract: { class: "Solution", method: "solve", parameters: [{ name: "n", type: "int" }], return_type: "int" },
  cases: [{ name: "first", input: { n: 1 }, expected: 1 }, { name: "second", input: { n: 2 }, expected: 2 }],
};
const marker = (id: number) => `__CASE_START__ ${id}\n__STATUS__ PASS\n__ACTUAL__ 1\n__EXPECTED__ 1\n__TIME_MS__ 1\n__CASE_END__ ${id}\n`;
const execution = (stdout: string, code = 0, signal: string | null = null) => ({ language: "java", version: "docker", run: { stdout, stderr: "", output: stdout, code, signal } });

describe("judge result integrity", () => {
  it("accepts only a complete successful execution", () => {
    expect(parseExecution(execution(marker(0) + marker(1)), cases).overallStatus).toBe("ACCEPTED");
  });
  it.each([marker(0), marker(0) + marker(0), marker(0) + marker(2)])("rejects missing, duplicate and out-of-range records", (stdout) => {
    expect(parseExecution(execution(stdout), cases).overallStatus).not.toBe("ACCEPTED");
  });
  it("does not accept a process that exits with an error after printing all records", () => {
    expect(parseExecution(execution(marker(0) + marker(1), 1), cases).overallStatus).toBe("RUNTIME_ERROR");
  });
  it("preserves timeout classification with partial output", () => {
    expect(parseExecution(execution(marker(0), 1, "SIGKILL"), cases).overallStatus).toBe("TIMEOUT");
  });
});

describe("canonical case contracts", () => {
  it("accepts a valid method contract", () => expect(validateCases(cases, 1)).toEqual(cases));
  it.each([{ ...cases, cases: [] }, { ...cases, problem_id: 2 }, { ...cases, contract_type: "custom" }, { ...cases, language_contract: { ...cases.language_contract, parameters: [{ name: "n", type: "Node" }] } }])("rejects missing or unsupported contracts", (value) => {
    expect(() => validateCases(value, 1)).toThrow();
  });
  it("rejects missing parameter values", () => {
    expect(() => validateCases({ ...cases, cases: [{ name: "bad", input: {}, expected: 1 }] }, 1)).toThrow();
  });
  it.each(["float", "short", "byte", "float[]", "short[]", "byte[]"])("rejects unsupported Java type %s", (type) => {
    const value = { ...cases, language_contract: { ...cases.language_contract, parameters: [{ name: "n", type }] } };
    expect(() => validateCases(value, 1)).toThrow(/unsupported parameter/i);
  });
  it("rejects integers outside the Java int range", () => {
    const value = { ...cases, cases: [{ name: "overflow", input: { n: 2147483648 }, expected: 1 }] };
    expect(() => validateCases(value, 1)).toThrow(/invalid input/i);
  });
});
