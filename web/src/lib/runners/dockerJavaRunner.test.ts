// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createDockerJavaRunner, type DockerCommand } from "./dockerJavaRunner";

const ok = { stdout: "", stderr: "", code: 0, signal: null };
function fakeDocker() {
  return vi.fn<DockerCommand>(async (args) => {
    if (args[0] === "image") return { ...ok, stdout: `sha256:${"a".repeat(64)}` };
    if (args.includes("java")) return { ...ok, stdout: "result" };
    return ok;
  });
}
describe("Docker Java runner", () => {
  it("fails closed when container cleanup fails until stale cleanup succeeds", async () => {
    const command = fakeDocker();
    command.mockImplementation(async (args) => {
      if (args[0] === "image") return { ...ok, stdout: `sha256:${"a".repeat(64)}` };
      if (args[0] === "rm") return { ...ok, code: 1, stderr: "daemon failure" };
      return ok;
    });
    const runner = createDockerJavaRunner(command);
    await expect(runner.execute("class Main {}")).rejects.toMatchObject({ errorCode: "DOCKER_CLEANUP_FAILED" });
    await expect(runner.execute("class Main {}")).rejects.toMatchObject({ errorCode: "DOCKER_CLEANUP_FAILED" });
    command.mockImplementation(fakeDocker());
    await runner.cleanupStale();
    await expect(runner.execute("class Main {}")).resolves.toMatchObject({ language: "java" });
  });
  it("uses an immutable image and isolated resources, then cleans up", async () => {
    const command = fakeDocker();
    const result = await createDockerJavaRunner(command).execute("class Main {}");
    expect(result.run.stdout).toBe("result");
    const args = command.mock.calls.find(([args]) => args[0] === "run")![0];
    for (const arg of ["--pull=never", "--network=none", "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--user=10001:10001", "--memory=512m", "--pids-limit=128", "--cpus=1"]) expect(args).toContain(arg);
    expect(args).toContain(`sha256:${"a".repeat(64)}`);
    expect(args.some((arg) => arg.includes("mount") || arg === "-v")).toBe(false);
    expect(command.mock.calls.at(-1)?.[0].slice(0, 2)).toEqual(["rm", "-f"]);
  });
  it("rejects a concurrent run instead of queueing", async () => {
    const command = fakeDocker();
    let release!: () => void;
    command.mockImplementationOnce(() => new Promise((resolve) => { release = () => resolve({ ...ok, stdout: `sha256:${"a".repeat(64)}` }); }));
    const runner = createDockerJavaRunner(command);
    const running = runner.execute("class Main {}");
    await expect(runner.execute("class Main {}")).rejects.toMatchObject({ status: 429, errorCode: "RUNNER_BUSY" });
    release();
    await running;
  });
  it("reports unavailable image without fallback", async () => {
    const command = fakeDocker().mockResolvedValueOnce({ ...ok, code: 1, stderr: "No such image" });
    await expect(createDockerJavaRunner(command).execute("class Main {}")).rejects.toMatchObject({ status: 503, errorCode: "DOCKER_IMAGE_MISSING" });
    expect(command.mock.calls.some(([args]) => args[0] === "run")).toBe(false);
  });
  it("preserves timeout even when stdout is partial", async () => {
    const command = fakeDocker();
    command.mockImplementation(async (args) => args[0] === "image" ? { ...ok, stdout: `sha256:${"a".repeat(64)}` } : args.includes("java") ? { ...ok, code: 124, stdout: "partial" } : ok);
    const result = await createDockerJavaRunner(command).execute("class Main {}");
    expect(result.run).toMatchObject({ signal: "SIGKILL", stdout: "partial" });
  });
  it("rejects oversized input before Docker", async () => {
    const command = fakeDocker();
    await expect(createDockerJavaRunner(command).execute("x".repeat(2 * 1024 * 1024 + 1))).rejects.toMatchObject({ status: 400 });
    expect(command).not.toHaveBeenCalled();
  });
  it("does not execute Java after compilation fails", async () => {
    const command = fakeDocker();
    command.mockImplementation(async (args) => args[0] === "image" ? { ...ok, stdout: `sha256:${"a".repeat(64)}` } : args.includes("javac") ? { ...ok, code: 1, stderr: "bad source" } : ok);
    expect((await createDockerJavaRunner(command).execute("bad")).compile?.code).toBe(1);
    expect(command.mock.calls.some(([args]) => args.includes("java"))).toBe(false);
    expect(command.mock.calls.at(-1)?.[0][0]).toBe("rm");
  });
  it("cleans up after output limit and allows the next run", async () => {
    const command = fakeDocker();
    command.mockImplementation(async (args) => {
      if (args[0] === "image") return { ...ok, stdout: `sha256:${"a".repeat(64)}` };
      if (args.includes("java")) throw Object.assign(new Error("output limit"), { errorCode: "OUTPUT_LIMIT" });
      return ok;
    });
    const runner = createDockerJavaRunner(command);
    await expect(runner.execute("class Main {}")).rejects.toMatchObject({ errorCode: "OUTPUT_LIMIT" });
    expect(command.mock.calls.at(-1)?.[0][0]).toBe("rm");
    await expect(runner.execute("class Main {}")).rejects.toMatchObject({ errorCode: "OUTPUT_LIMIT" });
  });
  it("cleans only labelled container IDs", async () => {
    const command = fakeDocker().mockResolvedValueOnce({ ...ok, stdout: "abcdef123456\n--all" });
    await createDockerJavaRunner(command).cleanupStale();
    expect(command.mock.calls[0][0]).toEqual(["ps", "-aq", "--filter", "label=leetcode.local-java-runner=true"]);
    expect(command.mock.calls[1][0]).toEqual(["rm", "-f", "abcdef123456"]);
  });
});
