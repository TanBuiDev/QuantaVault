import type { CasesData } from "@/lib/cases";

const identifier = /^[A-Za-z_$][\w$]*$/;
// Keep this list aligned with javaWrapper's literal and comparison support.
const primitives = new Set(["int", "long", "double", "boolean", "char", "String", "Integer", "Double", "Boolean"]);
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
function supportedType(type: unknown): type is string {
  if (typeof type !== "string") return false;
  if (primitives.has(type) || type === "ListNode" || type === "TreeNode") return true;
  if (type.endsWith("[]")) return supportedType(type.slice(0, -2));
  if (type.startsWith("List<") && type.endsWith(">")) return supportedType(type.slice(5, -1));
  return false;
}
function validValue(value: unknown, type: string): boolean {
  if (value === null) return !["int", "long", "double", "float", "short", "byte", "boolean", "char"].includes(type);
  if (type === "TreeNode" || type === "ListNode") return Array.isArray(value) && value.every(v => (type === "TreeNode" && v === null) || (typeof v === "number" && Number.isInteger(v)));
  if (type.endsWith("[]")) return Array.isArray(value) && value.every(v => validValue(v, type.slice(0, -2)));
  if (type.startsWith("List<")) return Array.isArray(value) && value.every(v => validValue(v, type.slice(5, -1)));
  if (type === "String") return typeof value === "string";
  if (type === "char") return typeof value === "string" && value.length === 1;
  if (type === "boolean" || type === "Boolean") return typeof value === "boolean";
  if (type === "double" || type === "Double") return typeof value === "number" && Number.isFinite(value);
  if (type === "int" || type === "Integer") {
    return typeof value === "number" && Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
  }
  if (type === "long") return typeof value === "number" && Number.isSafeInteger(value);
  return false;
}

export class UnsupportedCasesError extends Error {
  constructor(message: string) { super(message); this.name = "UnsupportedCasesError"; }
}

/** Validate trusted repository data before generating a Java harness. Never guess unsupported contracts. */
export function validateCases(value: unknown, problemId: number): CasesData {
  const fail = (message: string): never => { throw new UnsupportedCasesError(`Testcase contract: ${message}`); };
  if (!record(value) || value.schema_version !== 1 || value.problem_id !== problemId) fail("invalid schema or problem ID.");
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.cases) || data.cases.length === 0) fail("no cases available.");
  const contract = data.language_contract;
  if (!record(contract) || typeof contract.class !== "string" || !identifier.test(contract.class)) fail("invalid class.");
  const lc = contract as Record<string, unknown>;
  if (data.contract_type !== "method" && data.contract_type !== "operation-sequence") fail("unsupported contract type.");
  if (data.contract_type === "method") {
    if (typeof lc.method !== "string" || !identifier.test(lc.method) || !Array.isArray(lc.parameters)) fail("invalid method.");
    if (lc.return_type !== "void" && !supportedType(lc.return_type)) fail("unsupported return type.");
    const parameters = lc.parameters as unknown[];
    const names = new Set<string>();
    for (const p of parameters) {
      if (!record(p) || typeof p.name !== "string" || !identifier.test(p.name) || !supportedType(p.type)) fail("unsupported parameter.");
      const param = p as { name: string; type: string };
      if (names.has(param.name)) fail("duplicate parameter.");
      names.add(param.name);
    }
    for (const raw of data.cases as unknown[]) {
      if (!record(raw) || typeof raw.name !== "string" || !record(raw.input)) fail("invalid case.");
      const tc = raw as Record<string, unknown>;
      const input = tc.input as Record<string, unknown>;
      for (const p of parameters as { name: string; type: string }[]) if (!validValue(input[p.name], p.type)) fail(`invalid input ${p.name}.`);
      if (tc.expected_mutation !== undefined) {
        if (!record(tc.expected_mutation) || Object.keys(tc.expected_mutation).length === 0) fail("empty mutation.");
        for (const [key, expected] of Object.entries(tc.expected_mutation as Record<string, unknown>)) {
          const parameter = (parameters as { name: string; type: string }[]).find(p => p.name === key || `${p.name}_prefix` === key);
          const type = key === "return" ? lc.return_type : parameter?.type;
          if (!supportedType(type) || !validValue(expected, type)) fail(`unsupported mutation ${key}.`);
          if (key.endsWith("_prefix") && (!parameter?.type.endsWith("[]") || lc.return_type !== "int" || !Object.hasOwn(tc.expected_mutation as object, "return"))) fail("unsupported prefix comparison.");
        }
      } else if (lc.return_type === "void" || !validValue(tc.expected, lc.return_type as string)) fail("missing or unsupported expected result.");
    }
  } else {
    for (const raw of data.cases as unknown[]) {
      if (!record(raw) || typeof raw.name !== "string" || !Array.isArray(raw.operations) || !Array.isArray(raw.arguments) || !Array.isArray(raw.expected)) fail("invalid operation sequence.");
      const tc = raw as { operations: unknown[]; arguments: unknown[]; expected: unknown[] };
      if (!tc.operations.length || tc.operations[0] !== lc.class || tc.operations.length !== tc.arguments.length || tc.operations.length !== tc.expected.length) fail("inconsistent operation sequence.");
      if (tc.operations.some((op, i) => typeof op !== "string" || !identifier.test(op) || !Array.isArray(tc.arguments[i]))) fail("invalid operation arguments.");
    }
  }
  return data as unknown as CasesData;
}
