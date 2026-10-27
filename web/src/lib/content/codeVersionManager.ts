import "server-only";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api/localGuard";
import { atomicWrite, containedPath, findProblemDirectory, metadataEntries, readMetadata, withProblemLock, writeMetadata } from "./repository";
import { booleanField, contentId, problemIdField, textField } from "./validation";

export interface CodeVersionItem { id: string; name?: string; source: string; isCanonical?: boolean }
export interface SaveCodeVersionInput { problemId: number; id?: string; name?: string; source: string; isDefault?: boolean }
export interface DeleteCodeVersionInput { problemId: number; id: string }

function versionsFrom(meta: Record<string, unknown>) {
  const versions = metadataEntries(meta.code_versions);
  return versions.length ? versions : [{ id: "v1", name: "Version 1", file: "Solution.java", is_canonical: true, is_default: true }];
}
function canonical(version: Record<string, unknown>) {
  return Boolean(version.is_canonical) || !version.file || version.file === "Solution.java";
}
function versionFile(directory: string, version: Record<string, unknown>): string {
  const file = String(version.file || "Solution.java");
  containedPath(directory, file);
  if (file !== "Solution.java" && !/^Solution_[a-zA-Z0-9_-]+\.java$/.test(file)) throw new ApiError(400, "UNSAFE_CONTENT_PATH", "Invalid code version filename.");
  return file;
}

export async function saveCodeVersion(input: SaveCodeVersionInput) {
  problemIdField(input.problemId);
  contentId(input.id);
  textField(input.name, "name", 200, true);
  textField(input.source, "source", 262144, false, true);
  booleanField(input.isDefault);
  const directory = findProblemDirectory(input.problemId);
  return withProblemLock(directory, () => {
    const meta = readMetadata(directory);
    const versions = versionsFrom(meta);
    const existing = input.id ? versions.find(version => version.id === input.id) : undefined;
    if (input.id && !existing) throw new ApiError(404, "VERSION_NOT_FOUND", "Version not found.");
    if (existing) versionFile(directory, existing);
    const createdCopy = Boolean(existing && canonical(existing));
    const id = existing && !createdCopy ? String(existing.id) : `v-${randomUUID()}`;
    const file = `Solution_v-${randomUUID()}.java`;
    const updated = {
      id, name: input.name ?? (existing?.name ? `${existing.name}${createdCopy ? " (copy)" : ""}` : `Version ${versions.length + 1}`),
      file, is_default: input.isDefault ?? (createdCopy ? false : Boolean(existing?.is_default || existing?.default)),
    };
    if (updated.is_default) for (const version of versions) { version.is_default = false; version.default = false; }
    if (existing && !createdCopy) versions[versions.indexOf(existing)] = updated;
    else versions.push(updated);
    meta.code_versions = versions;
    atomicWrite(directory, file, input.source);
    try { writeMetadata(directory, meta); } catch (error) {
      fs.unlinkSync(containedPath(directory, file));
      throw error;
    }
    // Metadata is the commit point. Old files may remain after interrupted cleanup.
    if (existing && !createdCopy && !versions.some(version => version.file === existing.file)) {
      try { fs.unlinkSync(containedPath(directory, versionFile(directory, existing))); } catch { /* Unreferenced file is safe to retain. */ }
    }
    return { success: true, message: createdCopy ? "Saved a copy of the canonical code." : "Code version saved.", id, createdCopy };
  });
}

export async function deleteCodeVersion(input: DeleteCodeVersionInput) {
  problemIdField(input.problemId);
  contentId(input.id, false);
  const directory = findProblemDirectory(input.problemId);
  return withProblemLock(directory, () => {
    const meta = readMetadata(directory);
    const versions = versionsFrom(meta);
    const target = versions.find(version => version.id === input.id);
    if (!target) throw new ApiError(404, "VERSION_NOT_FOUND", "Version not found.");
    if (canonical(target)) throw new ApiError(409, "CANONICAL_IMMUTABLE", "The canonical code cannot be deleted.");
    const file = versionFile(directory, target);
    const remaining = versions.filter(version => version !== target);
    if ((target.is_default || target.default) && remaining.length) remaining[0].is_default = true;
    meta.code_versions = remaining;
    writeMetadata(directory, meta);
    if (!remaining.some(version => version.file === file)) {
      try { fs.unlinkSync(containedPath(directory, file)); } catch { /* Metadata no longer exposes the version. */ }
    }
    return { success: true, message: "Code version deleted." };
  });
}
