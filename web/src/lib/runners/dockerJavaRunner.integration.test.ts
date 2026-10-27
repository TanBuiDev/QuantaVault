// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createDockerJavaRunner, dockerCommand } from "./dockerJavaRunner";
import { getProblemContent } from "@/lib/content";
import { parseCasesYaml } from "@/lib/cases";
import { validateCases } from "@/lib/judge/validateCases";
import { generateJavaSource } from "@/lib/wrappers/javaWrapper";
import { parseExecution } from "@/lib/judge/parseExecution";

describe.skipIf(process.env.JAVA_DOCKER_INTEGRATION !== "1")("real Docker Java isolation", () => {
  const runner = createDockerJavaRunner();
  it("rejects an incorrect answer through the complete harness", async () => {
    const content = getProblemContent(1)!;
    const cases = validateCases(parseCasesYaml(content.casesYaml), 1);
    const source = generateJavaSource("class Solution { public int[] twoSum(int[] nums, int target) { return new int[]{-1,-1}; } }", cases);
    const result = parseExecution(await runner.execute(source), cases);
    expect(result.overallStatus).toBe("WRONG_ANSWER");
    expect(result.passedCases).toBe(0);
  }, 45000);
  it.each([1, 27, 21, 104, 155, 173, 114, 48, 50, 208])("accepts canonical problem %i through the complete harness", async (problemId) => {
    const content = getProblemContent(problemId)!;
    const cases = validateCases(parseCasesYaml(content.casesYaml), problemId);
    const execution = await runner.execute(generateJavaSource(content.javaSource!, cases));
    const result = parseExecution(execution, cases);
    expect(result.overallStatus, JSON.stringify(result)).toBe("ACCEPTED");
    expect(result.passedCases).toBe(cases.cases.length);
  }, 45000);
  it("compiles and runs Java 25 as non-root with no network and read-only root", async () => {
    const result = await runner.execute(`import java.nio.file.*; import java.net.*;
      class Main { public static void main(String[] args) throws Exception {
        if (Runtime.version().feature() != 25) throw new Error("wrong Java");
        String status = Files.readString(Path.of("/proc/self/status"));
        if (!status.matches("(?s).*Uid:\\\\s+10001\\\\s+10001.*")) throw new Error("root");
        try { Files.writeString(Path.of("/etc/runner-test"), "x"); throw new Error("writable root"); } catch (java.io.IOException expected) {}
        for (var interfaces = NetworkInterface.getNetworkInterfaces(); interfaces.hasMoreElements();) {
          if (!interfaces.nextElement().isLoopback()) throw new Error("network available");
        }
        System.out.println("isolated");
      } }`);
    expect(result.compile?.code, result.compile?.stderr).toBe(0);
    expect(result.run.code, result.run.stderr).toBe(0);
    expect(result.run.stdout).toContain("isolated");
  }, 45000);
  it("returns compilation and runtime failures", async () => {
    expect((await runner.execute("class Main { invalid }")).compile?.code).not.toBe(0);
    expect((await runner.execute('class Main { public static void main(String[] args) { throw new RuntimeException("bad"); } }')).run.code).not.toBe(0);
  }, 45000);
  it("kills infinite loops and cleans the container", async () => {
    const result = await runner.execute('class Main { public static void main(String[] args) { System.out.println("partial"); while(true) {} } }');
    expect(result.run.signal).toBe("SIGKILL");
    expect(result.run.stdout).toContain("partial");
    expect((await dockerCommand(["ps", "-aq", "--filter", "label=leetcode.local-java-runner=true"])).stdout.trim()).toBe("");
  }, 45000);
  it("stops excessive output", async () => {
    await expect(runner.execute('class Main { public static void main(String[] args) { while(true) System.out.println("x".repeat(8192)); } }')).rejects.toMatchObject({ errorCode: "OUTPUT_LIMIT" });
  }, 45000);
  it("cancels a running request and cleans up", async () => {
    const controller = new AbortController();
    const pending = runner.execute('class Main { public static void main(String[] args) { while(true) {} } }', controller.signal);
    const timer = setTimeout(() => controller.abort(), 3000);
    try { await expect(pending).rejects.toMatchObject({ errorCode: "REQUEST_ABORTED" }); }
    finally { clearTimeout(timer); }
    expect((await dockerCommand(["ps", "-aq", "--filter", "label=leetcode.local-java-runner=true"])).stdout.trim()).toBe("");
  }, 45000);
});


