import "server-only";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { parse, stringify } from "yaml";
import { ApiError } from "@/lib/api/localGuard";

export function findRepositoryRoot(): string {
  const configured = process.env.CONTENT_ROOT;
  if (configured !== undefined) {
    if (!path.isAbsolute(configured) || !fs.existsSync(/* turbopackIgnore: true */ path.join(configured, "study-plans/top-interview-150/index.yaml")) || !fs.existsSync(/* turbopackIgnore: true */ path.join(configured, "problems"))) {
      throw new Error("CONTENT_ROOT must be an absolute content root containing problems and study-plans/top-interview-150/index.yaml.");
    }
    return fs.realpathSync(/* turbopackIgnore: true */ configured);
  }
  let current = path.resolve(/* turbopackIgnore: true */ process.cwd());
  for (;;) {
    if (fs.existsSync(/* turbopackIgnore: true */ path.join(current, "study-plans/top-interview-150/index.yaml")) && fs.existsSync(/* turbopackIgnore: true */ path.join(current, "problems"))) return fs.realpathSync(/* turbopackIgnore: true */ current);
    const parent = path.dirname(current);
    if (parent === current) throw new Error("Unable to locate repository root.");
    current = parent;
  }
}

// Reject links as well as lexical traversal, including existing ancestors of new files.
export function containedPath(root: string, relative: string): string {
  if (!relative || path.isAbsolute(relative) || path.win32.isAbsolute(relative) || relative.includes("\\") || relative.includes(":")) throw new ApiError(400, "UNSAFE_CONTENT_PATH", "Invalid content path.");
  const parts = relative.split("/");
  if (parts.some(part => part === ".." || part === "." || part === "")) throw new ApiError(400, "UNSAFE_CONTENT_PATH", "Invalid content path.");
  let candidate = root;
  for (const part of parts) {
    candidate = path.join(candidate, part);
    try {
      if (fs.lstatSync(candidate).isSymbolicLink()) throw new ApiError(400, "UNSAFE_CONTENT_PATH", "Linked content paths are not allowed.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return candidate;
}

export function problemDirectories(): string[] {
  const root = containedPath(findRepositoryRoot(), "problems");
  const directories: string[] = [];
  // Content is supplied from the local runtime repository, not bundled into Next.js.
  for (const section of fs.readdirSync(/* turbopackIgnore: true */ root, { withFileTypes: true })) {
    if (!section.isDirectory() || section.isSymbolicLink()) continue;
    const sectionPath = containedPath(root, section.name);
    for (const entry of fs.readdirSync(/* turbopackIgnore: true */ sectionPath, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const directory = containedPath(sectionPath, entry.name);
      if (fs.existsSync(/* turbopackIgnore: true */ containedPath(directory, "meta.yaml"))) directories.push(directory);
    }
  }
  return directories;
}

export function findProblemDirectory(problemId: number): string {
  if (!Number.isSafeInteger(problemId) || problemId <= 0) throw new ApiError(400, "INVALID_INPUT", "problemId must be a positive integer.");
  const matches = problemDirectories().filter(directory => readMetadata(directory).id === problemId);
  if (matches.length === 0) throw new ApiError(404, "PROBLEM_NOT_FOUND", "Problem not found.");
  if (matches.length !== 1) throw new Error("Duplicate problem ID.");
  return matches[0];
}

export function readMetadata(directory: string): Record<string, unknown> {
  const value: unknown = parse(fs.readFileSync(/* turbopackIgnore: true */ containedPath(directory, "meta.yaml"), "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid problem metadata.");
  return value as Record<string, unknown>;
}

export function atomicWrite(directory: string, relative: string, content: string): void {
  const destination = containedPath(directory, relative);
  const temp = containedPath(directory, `${relative}.${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temp, content, { encoding: "utf8", flag: "wx" });
    fs.renameSync(temp, destination);
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

export function writeMetadata(directory: string, metadata: Record<string, unknown>): void {
  atomicWrite(directory, "meta.yaml", stringify(metadata));
}

const locks = new Map<string, Promise<void>>();
export async function withProblemLock<T>(directory: string, work: () => T | Promise<T>): Promise<T> {
  const previous = locks.get(directory) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>(resolve => { release = resolve; });
  locks.set(directory, current);
  await previous;
  try { return await work(); } finally {
    release();
    if (locks.get(directory) === current) locks.delete(directory);
  }
}

export function metadataEntries(value: unknown): Record<string, unknown>[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(item => !item || typeof item !== "object" || Array.isArray(item))) throw new Error("Invalid content entries.");
  return value.map(item => ({ ...item }));
}
