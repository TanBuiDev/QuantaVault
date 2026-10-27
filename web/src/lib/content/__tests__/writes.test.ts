// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parse, stringify } from "yaml";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveCodeVersion, deleteCodeVersion } from "../codeVersionManager";
import { saveSolutionApproach } from "../approachManager";
import { getProblemSummary, getProblemContent, getTopInterview150 } from "../index";
import { findRepositoryRoot } from "../repository";

let root: string;
let problem: string;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "leetcode-content-test-"));
  fs.mkdirSync(path.join(root, "study-plans/top-interview-150"), { recursive: true });
  fs.writeFileSync(path.join(root, "study-plans/top-interview-150/index.yaml"), "id: test");
  problem = path.join(root, "problems/array/1-test");
  fs.mkdirSync(problem, { recursive: true });
  fs.writeFileSync(path.join(problem, "meta.yaml"), "id: 1\n");
  fs.writeFileSync(path.join(problem, "Solution.java"), "canonical java");
  fs.writeFileSync(path.join(problem, "solution.md"), "canonical markdown");
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.stubEnv("CONTENT_ROOT", root);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  fs.rmSync(root, { recursive: true, force: true });
});
const meta = () => parse(fs.readFileSync(path.join(problem, "meta.yaml"), "utf8"));

describe("content writes", () => {
  it("fails closed when CONTENT_ROOT is invalid", () => {
    vi.stubEnv("CONTENT_ROOT", path.join(root, "missing"));
    expect(() => findRepositoryRoot()).toThrow("CONTENT_ROOT");
  });
  it("requires an absolute configured content root", () => {
    vi.stubEnv("CONTENT_ROOT", "problems");
    expect(() => findRepositoryRoot()).toThrow("CONTENT_ROOT");
  });
  it("reads changed summaries without retaining mutable metadata", () => {
    const metadata = { schema_version: 2, id: 1, slug: "test", title: "Before", difficulty: "Easy", primary_section: "array", topics: [], patterns: [], leetcode_url: "https://leetcode.com/problems/test/", content_status: { source: "list-only", translation: "none", hints: "none", solution: "none", interview: "none", cases: "none", problem_media: "none", solution_media: "none" } };
    fs.writeFileSync(path.join(problem, "meta.yaml"), stringify(metadata));
    expect(getProblemSummary(1)?.title).toBe("Before");
    fs.writeFileSync(path.join(problem, "meta.yaml"), stringify({ ...metadata, title: "After" }));
    expect(getProblemSummary(1)?.title).toBe("After");
    expect(getProblemContent(1)?.javaSource).toBe("canonical java");
  });
  it("keeps immutable study plans isolated by content root", () => {
    // Empty plans isolate the cache contract from mutable problem metadata.
    fs.unlinkSync(path.join(problem, "meta.yaml"));
    fs.writeFileSync(path.join(root, "study-plans/top-interview-150/index.yaml"), stringify({ id: "first", title: "First", sections: [] }));
    expect(getTopInterview150().id).toBe("first");
    fs.writeFileSync(path.join(root, "study-plans/top-interview-150/index.yaml"), "invalid");
    expect(getTopInterview150().id).toBe("first");
    const alternate = path.join(root, "alternate");
    fs.mkdirSync(path.join(alternate, "study-plans/top-interview-150"), { recursive: true });
    fs.mkdirSync(path.join(alternate, "problems"));
    fs.writeFileSync(path.join(alternate, "study-plans/top-interview-150/index.yaml"), stringify({ id: "second", title: "Second", sections: [] }));
    vi.stubEnv("CONTENT_ROOT", alternate);
    expect(getTopInterview150().id).toBe("second");
    const plan = getTopInterview150();
    plan.title = "Caller mutation";
    expect(getTopInterview150().title).toBe("Second");
  });
  it("keeps the previous version and metadata if the metadata commit fails", async () => {
    await saveCodeVersion({ problemId: 1, source: "old" });
    const previous = meta();
    const target = previous.code_versions[1];
    const rename = fs.renameSync;
    vi.spyOn(fs, "renameSync").mockImplementation((from, to) => {
      if (String(to).endsWith("meta.yaml")) throw new Error("disk failure");
      return rename(from, to);
    });
    await expect(saveCodeVersion({ problemId: 1, id: target.id, source: "new" })).rejects.toThrow("disk failure");
    expect(meta()).toEqual(previous);
    expect(fs.readFileSync(path.join(problem, target.file), "utf8")).toBe("old");
    expect(fs.readdirSync(problem).filter(file => file.endsWith(".tmp"))).toEqual([]);
  });
  it("copies canonical code on edit without replacing the original", async () => {
    const result = await saveCodeVersion({ problemId: 1, id: "v1", source: "edited" });
    expect(fs.readFileSync(path.join(problem, "Solution.java"), "utf8")).toBe("canonical java");
    expect(result).toMatchObject({ success: true, createdCopy: true });
    expect(meta().code_versions).toHaveLength(2);
  });
  it("rejects canonical deletion even before versions were persisted", async () => {
    await expect(deleteCodeVersion({ problemId: 1, id: "v1" })).rejects.toMatchObject({ status: 409 });
    expect(fs.readFileSync(path.join(problem, "Solution.java"), "utf8")).toBe("canonical java");
  });
  it("rejects unrecognized edit IDs instead of silently creating content", async () => {
    await expect(saveCodeVersion({ problemId: 1, id: "unknown", source: "edited" })).rejects.toMatchObject({ status: 404 });
  });
  it("blocks a metadata file path escaping the problem", async () => {
    fs.writeFileSync(path.join(root, "outside.java"), "keep");
    fs.writeFileSync(path.join(problem, "meta.yaml"), stringify({ id: 1, code_versions: [{ id: "bad", file: "../../../outside.java" }] }));
    await expect(saveCodeVersion({ problemId: 1, id: "bad", source: "overwrite" })).rejects.toMatchObject({ status: 400 });
    expect(fs.readFileSync(path.join(root, "outside.java"), "utf8")).toBe("keep");
  });
  it("blocks a symlink directory escaping the problem", async () => {
    const outside = path.join(root, "outside");
    fs.mkdirSync(outside);
    fs.symlinkSync(outside, path.join(problem, "solutions"), "junction");
    await expect(saveSolutionApproach({ problemId: 1, name: "New", solutionMarkdown: "md", javaSource: "java" })).rejects.toMatchObject({ status: 400 });
    expect(fs.readdirSync(outside)).toEqual([]);
  });
  it("keeps all versions during concurrent writes", async () => {
    await Promise.all(Array.from({ length: 8 }, (_, n) => saveCodeVersion({ problemId: 1, name: String(n), source: String(n) })));
    expect(meta().code_versions).toHaveLength(9);
  });
  it("copies the canonical approach without changing canonical files", async () => {
    const result = await saveSolutionApproach({ problemId: 1, id: "canonical", name: "New", solutionMarkdown: "md", javaSource: "java" });
    expect(result).toMatchObject({ createdCopy: true });
    expect(meta().solutions).toHaveLength(2);
    expect(fs.readFileSync(path.join(problem, "solution.md"), "utf8")).toBe("canonical markdown");
  });
});
