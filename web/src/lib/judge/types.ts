export interface RunCodeRequest {
  problemId: number;
  sourceCode: string;
  mode: "run" | "submit";
}

export interface SingleTestResult {
  id: number;
  name: string;
  status: "PASS" | "FAIL" | "ERROR";
  actual?: string;
  expected?: string;
  error?: string;
  timeMs?: number;
  stdout?: string;
}

export interface RunCodeResponse {
  overallStatus: "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIMEOUT" | "SERVER_ERROR";
  errorCode?: string;
  compileError?: string;
  runtimeError?: string;
  results: SingleTestResult[];
  totalCases: number;
  passedCases: number;
  totalTimeMs: number;
  rawStdout?: string;
  rawStderr?: string;
}
