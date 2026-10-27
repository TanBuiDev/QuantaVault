import type { CasesData } from "@/lib/cases";
import type { CodeExecutionResponse } from "@/lib/piston";
import type { RunCodeResponse, SingleTestResult } from "./types";

/** This protocol detects incomplete output, not deliberate cheating by submitted code. */
export function parseExecution(execution: CodeExecutionResponse, data: CasesData): RunCodeResponse {
  const rawStdout = execution.run.stdout || "";
  const rawStderr = execution.run.stderr || "";
  const response: RunCodeResponse = {
    overallStatus: "WRONG_ANSWER", results: [], totalCases: data.cases.length,
    passedCases: 0, totalTimeMs: 0, rawStdout, rawStderr,
  };
  if (execution.compile && execution.compile.code !== 0) {
    return { ...response, overallStatus: execution.compile.signal === "SIGKILL" ? "TIMEOUT" : "COMPILE_ERROR", compileError: execution.compile.stderr || execution.compile.output };
  }
  const seen = new Set<number>();
  let malformed = false;
  const regex = /^__CASE_START__ (\d+)\r?\n([\s\S]*?)^__CASE_END__ \1\r?$/gm;
  for (const match of rawStdout.matchAll(regex)) {
    const id = Number(match[1]);
    if (!Number.isSafeInteger(id) || !data.cases[id] || seen.has(id)) { malformed = true; continue; }
    seen.add(id);
    const body = match[2];
    const statuses = [...body.matchAll(/^__STATUS__ (PASS|FAIL|ERROR)\r?$/gm)];
    if (statuses.length !== 1) malformed = true;
    const field = (name: string) => body.match(new RegExp(`^__${name}__ ([^\\r\\n]*)`, "m"))?.[1];
    const status = statuses.length === 1 ? statuses[0][1] as SingleTestResult["status"] : "ERROR";
    const duration = Number(field("TIME_MS"));
    response.results.push({ id, name: data.cases[id].name, status, actual: field("ACTUAL"), expected: field("EXPECTED"), error: field("ERROR"), timeMs: Number.isFinite(duration) && duration >= 0 ? duration : 0 });
  }
  // A truncated or extra marker is a protocol failure even if all expected results appeared.
  if ([...rawStdout.matchAll(/^__CASE_START__ /gm)].length !== seen.size || [...rawStdout.matchAll(/^__CASE_END__ /gm)].length !== seen.size) malformed = true;
  response.results.sort((a, b) => a.id - b.id);
  response.passedCases = response.results.filter(r => r.status === "PASS").length;
  response.totalTimeMs = Math.round(response.results.reduce((sum, r) => sum + (r.timeMs || 0), 0) * 100) / 100;
  if (execution.run.signal === "SIGKILL") return { ...response, overallStatus: "TIMEOUT", runtimeError: rawStderr || "Java execution timed out." };
  if (execution.run.code !== 0 || execution.run.signal) return { ...response, overallStatus: "RUNTIME_ERROR", runtimeError: rawStderr || "Java process exited unsuccessfully." };
  if (malformed || seen.size !== data.cases.length) return { ...response, overallStatus: "RUNTIME_ERROR", errorCode: "INVALID_RESULT", runtimeError: "Incomplete or invalid testcase results." };
  response.overallStatus = response.passedCases === data.cases.length ? "ACCEPTED" : response.results.some(r => r.status === "ERROR") ? "RUNTIME_ERROR" : "WRONG_ANSWER";
  return response;
}
