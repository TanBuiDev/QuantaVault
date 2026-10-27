import { NextResponse } from "next/server";
import { parse } from "yaml";
import { executeCode } from "@/lib/piston";
import { getProblemContent } from "@/lib/content";
import { ApiError, readLocalJson } from "@/lib/api/localGuard";
import { generateJavaSource } from "@/lib/wrappers/javaWrapper";
import { parseExecution } from "@/lib/judge/parseExecution";
import { UnsupportedCasesError, validateCases } from "@/lib/judge/validateCases";
import type { RunCodeResponse } from "@/lib/judge/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await readLocalJson(req, 2 * 1024 * 1024);
    if (Object.keys(body).some(key => !["problemId", "sourceCode", "mode"].includes(key)) ||
        !Number.isSafeInteger(body.problemId) || (body.problemId as number) <= 0 ||
        typeof body.sourceCode !== "string" || !body.sourceCode.trim() ||
        Buffer.byteLength(body.sourceCode, "utf8") > 256 * 1024 ||
        (body.mode !== "run" && body.mode !== "submit")) {
      throw new ApiError(400, "INVALID_REQUEST", "Expected problemId, sourceCode (up to 256 KiB), and mode: run or submit.");
    }
    const content = getProblemContent(body.problemId as number);
    if (!content) throw new ApiError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
    let canonical;
    try { canonical = validateCases(parse(content.casesYaml || ""), body.problemId as number); }
    catch (error) { throw new ApiError(422, "UNSUPPORTED_CASES", error instanceof UnsupportedCasesError ? error.message : "Invalid canonical testcase data."); }
    const selected = { ...canonical, cases: body.mode === "run" ? canonical.cases.slice(0, 3) : canonical.cases };
    const execution = await executeCode({
      language: "java", files: [{ name: "Main.java", content: generateJavaSource(body.sourceCode, selected) }], signal: req.signal,
    });
    return NextResponse.json(parseExecution(execution, selected));
  } catch (error) {
    const known = error instanceof Error && "status" in error && typeof error.status === "number";
    if (!known) console.error("API /api/run-code unexpected failure", error);
    const code = error instanceof ApiError ? error.code : error instanceof Error && "errorCode" in error && typeof error.errorCode === "string" ? error.errorCode : "INTERNAL_ERROR";
    let runtimeMsg = known ? error.message : "Unable to execute Java. Check the server logs.";
    if (code === "DOCKER_NOT_INSTALLED" || code === "DOCKER_UNAVAILABLE") {
      if (process.env.CF_PAGES || process.env.VERCEL) {
        runtimeMsg = "Phiên bản Cloudflare Pages hiện tại chạy ở chế độ Showcase/Học tập. Tính năng Chấm code trực tiếp qua Cloud Runner sẽ được kết nối trong giai đoạn tiếp theo!";
      }
    }
    return NextResponse.json<RunCodeResponse>({
      overallStatus: code === "TIMEOUT" ? "TIMEOUT" : code === "OUTPUT_LIMIT" ? "RUNTIME_ERROR" : "SERVER_ERROR",
      errorCode: code, runtimeError: runtimeMsg,
      results: [], totalCases: 0, passedCases: 0, totalTimeMs: 0,
    }, { status: known ? error.status as number : 500 });
  }
}
