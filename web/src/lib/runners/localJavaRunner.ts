import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { CodeExecutionResponse } from "../piston";

const execFileAsync = promisify(execFile);

interface ExecFileFailure {
  stdout?: string;
  stderr?: string;
  message?: string;
  code?: number | string;
  signal?: string | null;
  killed?: boolean;
}

function asExecFileFailure(error: unknown): ExecFileFailure {
  return typeof error === "object" && error !== null ? (error as ExecFileFailure) : {};
}

export async function executeJavaLocally(javaSource: string): Promise<CodeExecutionResponse> {
  const runId = `oj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tempDir = path.join(os.tmpdir(), runId);

  await fs.mkdir(tempDir, { recursive: true });
  const mainPath = path.join(tempDir, "Main.java");
  await fs.writeFile(mainPath, javaSource, "utf-8");

  try {
    // 1. Compile
    try {
      await execFileAsync("javac", [mainPath], {
        timeout: 8000,
        cwd: tempDir,
      });
    } catch (compileErr: unknown) {
      const err = asExecFileFailure(compileErr);
      return {
        language: "java",
        version: "local",
        compile: {
          stdout: err.stdout || "",
          stderr: err.stderr || err.message || "Compilation failed",
          output: err.stderr || err.message || "Compilation failed",
          code: typeof err.code === "number" ? err.code : 1,
          signal: null,
        },
        run: {
          stdout: "",
          stderr: "",
          output: "",
          code: 1,
          signal: null,
        },
      };
    }

    // 2. Run
    try {
      const { stdout, stderr } = await execFileAsync("java", ["-cp", tempDir, "Main"], {
        timeout: 8000,
        cwd: tempDir,
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        language: "java",
        version: "local",
        run: {
          stdout: stdout || "",
          stderr: stderr || "",
          output: stdout || stderr || "",
          code: 0,
          signal: null,
        },
      };
    } catch (runErr: unknown) {
      const err = asExecFileFailure(runErr);
      const isTimeout = err.killed || err.signal === "SIGTERM" || err.code === "ETIMEDOUT";
      return {
        language: "java",
        version: "local",
        run: {
          stdout: err.stdout || "",
          stderr: err.stderr || err.message || "Runtime error",
          output: err.stdout || err.stderr || "",
          code: typeof err.code === "number" ? err.code : 1,
          signal: isTimeout ? "SIGKILL" : null,
        },
      };
    }
  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
