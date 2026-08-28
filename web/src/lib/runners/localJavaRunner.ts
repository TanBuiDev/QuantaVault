import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { CodeExecutionResponse } from "../piston";

const execFileAsync = promisify(execFile);

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
    } catch (compileErr: any) {
      return {
        language: "java",
        version: "local",
        compile: {
          stdout: compileErr.stdout || "",
          stderr: compileErr.stderr || compileErr.message || "Compilation failed",
          output: compileErr.stderr || compileErr.message || "Compilation failed",
          code: compileErr.code || 1,
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
    } catch (runErr: any) {
      const isTimeout = runErr.killed || runErr.signal === "SIGTERM" || runErr.code === "ETIMEDOUT";
      return {
        language: "java",
        version: "local",
        run: {
          stdout: runErr.stdout || "",
          stderr: runErr.stderr || runErr.message || "Runtime error",
          output: runErr.stdout || runErr.stderr || "",
          code: runErr.code || 1,
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
