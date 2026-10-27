import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
import type { CodeExecutionResponse } from "../piston";

export class RunnerError extends Error {
  constructor(public status: number, public errorCode: string, message: string) { super(message); }
}
type ProcessResult = CodeExecutionResponse["run"];
type CommandResult = Omit<ProcessResult, "output">;
export type DockerCommand = (args: string[], options?: { input?: string; signal?: AbortSignal; budget?: { remaining: number } }) => Promise<CommandResult>;
const LABEL = "leetcode.local-java-runner=true";
const IMAGE = "leetcode-java-runner:25";
const outputLimit = 1024 * 1024;

export const dockerCommand: DockerCommand = (args, options = {}) => new Promise((resolve, reject) => {
  const child = spawn("docker", args, { windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "", stderr = "";
  const decoders = { stdout: new StringDecoder("utf8"), stderr: new StringDecoder("utf8") };
  let failure: Error | undefined;
  const budget = options.budget ?? { remaining: outputLimit };
  const abort = () => { failure = new RunnerError(499, "REQUEST_ABORTED", "Lượt chạy đã bị hủy."); child.kill(); };
  const timeout = setTimeout(() => { failure = new RunnerError(503, "DOCKER_UNAVAILABLE", "Docker không phản hồi. Hãy khởi động Docker Desktop và thử lại."); child.kill(); }, 35000);
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  const read = (chunk: Buffer, stream: "stdout" | "stderr") => {
    budget.remaining -= chunk.length;
    if (budget.remaining < 0) { failure = new RunnerError(422, "OUTPUT_LIMIT", "Output vượt giới hạn 1 MiB."); child.kill(); return; }
    if (stream === "stdout") stdout += decoders.stdout.write(chunk); else stderr += decoders.stderr.write(chunk);
  };
  child.stdout.on("data", (chunk) => read(chunk, "stdout"));
  child.stderr.on("data", (chunk) => read(chunk, "stderr"));
  child.stdin.on("error", () => { /* Container may exit before consuming stdin. */ });
  child.on("error", (error: NodeJS.ErrnoException) => { failure = new RunnerError(503, error.code === "ENOENT" ? "DOCKER_NOT_INSTALLED" : "DOCKER_UNAVAILABLE", "Không thể gọi Docker. Hãy cài đặt và khởi động Docker Desktop."); });
  child.on("close", (code, signal) => {
    stdout += decoders.stdout.end(); stderr += decoders.stderr.end();
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abort);
    if (failure) reject(failure); else resolve({ stdout, stderr, code: code ?? 1, signal });
  });
  child.stdin.end(options.input);
});
function stage(result: CommandResult): ProcessResult {
  if (result.code === 125 || result.code === 126 || result.code === 127) throw new RunnerError(503, "DOCKER_EXEC_FAILED", "Docker không thể thực thi Java. Hãy tạo lại image bằng script setup.");
  return { ...result, output: result.stdout + result.stderr, signal: result.code === 124 || result.code === 137 ? "SIGKILL" : result.signal };
}
export function createDockerJavaRunner(command: DockerCommand = dockerCommand) {
  let busy = false;
  let cleanupFailed = false;
  return {
    async cleanupStale() {
      const result = await command(["ps", "-aq", "--filter", `label=${LABEL}`]);
      if (result.code !== 0) throw new RunnerError(503, "DOCKER_UNAVAILABLE", "Không thể kiểm tra container cũ.");
      const ids = result.stdout.trim().split(/\s+/).filter((id) => /^[a-f0-9]{12,64}$/.test(id));
      if (ids.length && (await command(["rm", "-f", ...ids])).code !== 0) throw new RunnerError(503, "DOCKER_CLEANUP_FAILED", "Không thể dọn container cũ. Hãy khởi động lại Docker và ứng dụng.");
      cleanupFailed = false;
    },
    async execute(source: string, signal?: AbortSignal): Promise<CodeExecutionResponse> {
      if (cleanupFailed) throw new RunnerError(503, "DOCKER_CLEANUP_FAILED", "Container trước chưa được dọn. Hãy khởi động lại Docker và ứng dụng.");
      // User source is capped at 256 KiB by the API; generated harness also embeds canonical cases.
      if (Buffer.byteLength(source) > 2 * 1024 * 1024) throw new RunnerError(400, "SOURCE_TOO_LARGE", "Source và harness vượt giới hạn 2 MiB.");
      if (busy) throw new RunnerError(429, "RUNNER_BUSY", "Một lượt chạy khác đang hoạt động. Hãy thử lại sau.");
      busy = true;
      const name = `leetcode-java-${randomUUID()}`;
      const controller = new AbortController();
      let timedOut = false;
      const abort = () => controller.abort();
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) abort();
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 35000);
      const budget = { remaining: outputLimit };
      let created = false;
      try {
        const image = await command(["image", "inspect", "--format", "{{.Id}}", IMAGE], { signal: controller.signal });
        if (image.code !== 0) throw new RunnerError(503, /No such image|No such object/i.test(image.stderr) ? "DOCKER_IMAGE_MISSING" : "DOCKER_UNAVAILABLE", "Docker hoặc image Java chưa sẵn sàng. Khởi động Docker Desktop rồi chạy node scripts/setup-java-runner.mjs.");
        const imageId = image.stdout.trim();
        if (!/^sha256:[a-f0-9]{64}$/.test(imageId)) throw new RunnerError(503, "DOCKER_IMAGE_INVALID", "Không xác định được image Java cố định.");
        created = true;
        const started = await command(["run", "-d", "--pull=never", "--name", name, "--label", LABEL, "--network=none", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user=10001:10001", "--cpus=1", "--memory=512m", "--memory-swap=512m", "--pids-limit=128", "--tmpfs", "/work:rw,nosuid,nodev,size=128m,uid=10001,gid=10001,mode=700", "--workdir=/work", imageId], { signal: controller.signal });
        if (started.code !== 0) throw new RunnerError(503, "DOCKER_UNAVAILABLE", "Không thể tạo môi trường Java trong Docker.");
        const write = await command(["exec", "-i", name, "sh", "-c", "cat > /work/Main.java"], { input: source, signal: controller.signal, budget });
        if (write.code !== 0) throw new RunnerError(503, "DOCKER_UNAVAILABLE", "Không thể gửi source vào Docker.");
        const compile = stage(await command(["exec", name, "timeout", "--signal=KILL", "15s", "javac", "-J-XX:ActiveProcessorCount=1", "-J-Xmx256m", "Main.java"], { signal: controller.signal, budget }));
        if (compile.code !== 0) return { language: "java", version: "25-docker", compile, run: { stdout: "", stderr: "", output: "", code: 1, signal: compile.signal } };
        const run = stage(await command(["exec", name, "timeout", "--signal=KILL", "10s", "java", "-XX:ActiveProcessorCount=1", "-Xmx256m", "-Djava.io.tmpdir=/work", "-cp", "/work", "Main"], { signal: controller.signal, budget }));
        return { language: "java", version: "25-docker", compile, run };
      } catch (error) {
        if (timedOut) return { language: "java", version: "25-docker", run: { stdout: "", stderr: "Hết thời gian chạy.", output: "", code: 1, signal: "SIGKILL" } };
        throw error;
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
        try {
          if (created) {
            cleanupFailed = true;
            const removed = await command(["rm", "-f", name]);
            if (removed.code !== 0) throw new RunnerError(503, "DOCKER_CLEANUP_FAILED", "Không thể dọn container. Hãy khởi động lại Docker và ứng dụng.");
            cleanupFailed = false;
          }
        } finally { busy = false; }
      }
    },
  };
}
const globalRunner = globalThis as typeof globalThis & { javaDockerRunner?: ReturnType<typeof createDockerJavaRunner> };
export const javaDockerRunner = globalRunner.javaDockerRunner ??= createDockerJavaRunner();
