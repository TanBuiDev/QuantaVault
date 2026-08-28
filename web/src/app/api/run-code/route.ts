import { NextResponse } from "next/server";
import { executeCode } from "@/lib/piston";
import { generateJavaSource } from "@/lib/wrappers/javaWrapper";
import type { CasesData } from "@/lib/cases";

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
  compileError?: string;
  runtimeError?: string;
  results: SingleTestResult[];
  totalCases: number;
  passedCases: number;
  totalTimeMs: number;
  rawStdout?: string;
  rawStderr?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceCode, language = "java", casesData, runAll = false } = body;

    if (!sourceCode) {
      return NextResponse.json({ error: "Source code is required" }, { status: 400 });
    }

    const filteredCasesData: CasesData | null = casesData
      ? {
          ...casesData,
          cases: runAll
            ? casesData.cases
            : (casesData.cases || []).slice(0, 3), // Run first 3 cases for "Run", all for "Submit"
        }
      : null;

    // Generate Java file
    const mainJavaSource = generateJavaSource(sourceCode, filteredCasesData);

    // Call Piston API
    const execution = await executeCode({
      language: "java",
      version: "15.0.2",
      files: [
        {
          name: "Main.java",
          content: mainJavaSource,
        },
      ],
      run_timeout: 10000,
      compile_timeout: 10000,
    });

    // Check compilation errors
    if (execution.compile && execution.compile.code !== 0) {
      const compileErr = execution.compile.stderr || execution.compile.output || "Compilation failed";
      // Filter out internal class helpers from error line numbers if needed
      return NextResponse.json<RunCodeResponse>({
        overallStatus: "COMPILE_ERROR",
        compileError: compileErr,
        results: [],
        totalCases: filteredCasesData?.cases?.length || 0,
        passedCases: 0,
        totalTimeMs: 0,
        rawStderr: execution.compile.stderr,
      });
    }

    // Check runtime errors if code != 0
    const rawStdout = execution.run.stdout || "";
    const rawStderr = execution.run.stderr || "";

    if (execution.run.code !== 0 && !rawStdout.includes("__CASE_START__")) {
      return NextResponse.json<RunCodeResponse>({
        overallStatus: execution.run.signal === "SIGKILL" ? "TIMEOUT" : "RUNTIME_ERROR",
        runtimeError: rawStderr || execution.run.output || "Runtime execution failed",
        results: [],
        totalCases: filteredCasesData?.cases?.length || 0,
        passedCases: 0,
        totalTimeMs: 0,
        rawStdout,
        rawStderr,
      });
    }

    // Parse structured stdout
    const results: SingleTestResult[] = [];
    const cases = filteredCasesData?.cases || [];
    let passedCount = 0;
    let totalTime = 0;

    const caseRegex = /__CASE_START__\s+(\d+)[\r\n]+([\s\S]*?)__CASE_END__\s+\1/g;
    let match;

    while ((match = caseRegex.exec(rawStdout)) !== null) {
      const caseIdx = parseInt(match[1], 10);
      const caseBody = match[2];
      const caseDef = cases[caseIdx] || { name: `Case ${caseIdx + 1}` };

      const statusMatch = caseBody.match(/__STATUS__\s+(PASS|FAIL|ERROR)/);
      const actualMatch = caseBody.match(/__ACTUAL__\s+([\s\S]*?)(?=(?:__EXPECTED__|__TIME_MS__|__ERROR__|$))/);
      const expectedMatch = caseBody.match(/__EXPECTED__\s+([\s\S]*?)(?=(?:__TIME_MS__|__ERROR__|$))/);
      const timeMatch = caseBody.match(/__TIME_MS__\s+([\d.]+)/);
      const errorMatch = caseBody.match(/__ERROR__\s+([^\r\n]*)/);

      const status = (statusMatch ? statusMatch[1] : "ERROR") as "PASS" | "FAIL" | "ERROR";
      const actual = actualMatch ? actualMatch[1].trim() : undefined;
      const expected = expectedMatch ? expectedMatch[1].trim() : undefined;
      const timeMs = timeMatch ? parseFloat(timeMatch[1]) : 0;
      const error = errorMatch ? errorMatch[1].trim() : undefined;

      if (status === "PASS") {
        passedCount++;
      }
      totalTime += timeMs;

      results.push({
        id: caseIdx,
        name: caseDef.name || `Case ${caseIdx + 1}`,
        status,
        actual,
        expected,
        error,
        timeMs,
      });
    }

    // If parsing found no markers but code ran, fallback
    if (results.length === 0 && cases.length > 0) {
      return NextResponse.json<RunCodeResponse>({
        overallStatus: rawStderr ? "RUNTIME_ERROR" : "WRONG_ANSWER",
        runtimeError: rawStderr || rawStdout,
        results: [],
        totalCases: cases.length,
        passedCases: 0,
        totalTimeMs: 0,
        rawStdout,
        rawStderr,
      });
    }

    const isAllPass = passedCount === cases.length && cases.length > 0;
    const hasError = results.some((r) => r.status === "ERROR");

    let overallStatus: RunCodeResponse["overallStatus"] = "ACCEPTED";
    if (!isAllPass) {
      overallStatus = hasError ? "RUNTIME_ERROR" : "WRONG_ANSWER";
    }

    return NextResponse.json<RunCodeResponse>({
      overallStatus,
      results,
      totalCases: cases.length,
      passedCases: passedCount,
      totalTimeMs: Math.round(totalTime * 100) / 100,
      rawStdout,
      rawStderr,
    });
  } catch (error: any) {
    console.error("API /api/run-code error:", error);
    return NextResponse.json<RunCodeResponse>(
      {
        overallStatus: "SERVER_ERROR",
        runtimeError: error?.message || "Internal server error",
        results: [],
        totalCases: 0,
        passedCases: 0,
        totalTimeMs: 0,
      },
      { status: 500 }
    );
  }
}
