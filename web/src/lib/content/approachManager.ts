import "server-only";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api/localGuard";
import { atomicWrite, containedPath, findProblemDirectory, metadataEntries, readMetadata, withProblemLock, writeMetadata } from "./repository";
import { booleanField, contentId, problemIdField, textField } from "./validation";

export interface CreateApproachInput {
  problemId: number; id?: string; name: string; tag?: string;
  timeComplexity?: string; spaceComplexity?: string; isDefault?: boolean;
  solutionMarkdown: string; javaSource: string;
}

export async function saveSolutionApproach(input: CreateApproachInput) {
  problemIdField(input.problemId);
  contentId(input.id);
  textField(input.name, "name", 200);
  textField(input.tag, "tag", 100, true, true);
  textField(input.timeComplexity, "timeComplexity", 200, true, true);
  textField(input.spaceComplexity, "spaceComplexity", 200, true, true);
  textField(input.solutionMarkdown, "solutionMarkdown", 262144, false, true);
  textField(input.javaSource, "javaSource", 262144, false, true);
  booleanField(input.isDefault);
  const directory = findProblemDirectory(input.problemId);
  return withProblemLock(directory, () => {
    const meta = readMetadata(directory);
    const entries = metadataEntries(meta.solutions);
    if (!entries.length) entries.push({ id: "canonical", name: "Lời giải chuẩn (Canonical)", tag: "Optimal", time: meta.time_complexity, space: meta.space_complexity, default: true });
    const existing = input.id ? entries.find(entry => entry.id === input.id) : undefined;
    if (input.id && !existing) throw new ApiError(404, "APPROACH_NOT_FOUND", "Approach not found.");
    if (existing?.dir) containedPath(directory, String(existing.dir));
    const createdCopy = Boolean(existing && (!existing.dir || existing.canonical || existing.id === "canonical"));
    const id = existing && !createdCopy ? String(existing.id) : `approach-${randomUUID()}`;
    const relative = `solutions/approach-${randomUUID()}`;
    const destination = containedPath(directory, relative);
    fs.mkdirSync(destination, { recursive: true });
    const updated = { id, name: input.name, tag: input.tag || "Alternative", time: input.timeComplexity || "O(n)", space: input.spaceComplexity || "O(1)", default: input.isDefault ?? (createdCopy ? false : Boolean(existing?.default)), dir: relative };
    if (updated.default) for (const entry of entries) entry.default = false;
    if (existing && !createdCopy) entries[entries.indexOf(existing)] = updated;
    else entries.push(updated);
    meta.solutions = entries;
    try {
      atomicWrite(directory, `${relative}/solution.md`, input.solutionMarkdown);
      atomicWrite(directory, `${relative}/Solution.java`, input.javaSource);
      writeMetadata(directory, meta);
    } catch (error) {
      for (const filename of ["solution.md", "Solution.java"]) {
        const file = containedPath(directory, `${relative}/${filename}`);
        if (fs.existsSync(file)) fs.unlinkSync(file);
      }
      fs.rmdirSync(destination);
      throw error;
    }
    // Leave pre-existing approach directories intact; metadata selects the committed snapshot.
    return { success: true, message: createdCopy ? "Saved a copy of the canonical approach." : "Approach saved.", id, createdCopy };
  });
}
