/**
 * Universal Code Execution Runner
 * 1. Local Java Runner (Fastest, zero-latency)
 * 2. Judge0 CE Public API (Cloud fallback)
 * 3. Piston API (Self-hosted fallback)
 */

import { executeJavaLocally } from "./runners/localJavaRunner";

export interface CodeExecutionRequest {
  language: string;
  version?: string;
  files: {
    name?: string;
    content: string;
  }[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
}

export interface CodeExecutionResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  message?: string;
}

async function executeViaJudge0(sourceCode: string): Promise<CodeExecutionResponse> {
  const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";
  
  // 62 is Java (OpenJDK 13/15+) in Judge0
  const response = await fetch(JUDGE0_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language_id: 62,
      source_code: sourceCode,
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  const isCompileError = data.status?.id === 6 || Boolean(data.compile_output);
  const isTimeout = data.status?.id === 5; // Time Limit Exceeded

  return {
    language: "java",
    version: "judge0-ce",
    compile: isCompileError
      ? {
          stdout: "",
          stderr: data.compile_output || "Compile Error",
          output: data.compile_output || "Compile Error",
          code: 1,
          signal: null,
        }
      : undefined,
    run: {
      stdout: data.stdout || "",
      stderr: data.stderr || data.message || "",
      output: data.stdout || data.stderr || data.message || "",
      code: data.status?.id === 3 ? 0 : 1,
      signal: isTimeout ? "SIGKILL" : null,
    },
  };
}

export async function executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
  const javaFile = request.files.find((f) => f.name === "Main.java") || request.files[0];
  const sourceCode = javaFile?.content || "";

  // Strategy 1: Try Local Java Environment first
  try {
    const localResult = await executeJavaLocally(sourceCode);
    return localResult;
  } catch (localErr) {
    console.warn("Local Java execution failed or not available, falling back to Judge0 Cloud API...", localErr);
  }

  // Strategy 2: Fallback to Judge0 CE Cloud API
  try {
    return await executeViaJudge0(sourceCode);
  } catch (cloudErr) {
    console.error("Judge0 Cloud execution failed:", cloudErr);
    throw cloudErr;
  }
}
