import { javaDockerRunner } from "./runners/dockerJavaRunner";
export { RunnerError } from "./runners/dockerJavaRunner";
export interface CodeExecutionRequest {
  language: string;
  files: { name?: string; content: string }[];
  signal?: AbortSignal;
}
export interface CodeExecutionResponse {
  language: string;
  version: string;
  run: { stdout: string; stderr: string; output: string; code: number; signal: string | null };
  compile?: CodeExecutionResponse["run"];
  message?: string;
}
export async function executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
  return javaDockerRunner.execute((request.files.find((file) => file.name === "Main.java") ?? request.files[0])?.content ?? "", request.signal);
}
