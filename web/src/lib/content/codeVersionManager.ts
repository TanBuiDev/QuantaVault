import "server-only";

import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "yaml";

function findRepositoryRoot(): string {
  let current = path.resolve(/* turbopackIgnore: true */ process.cwd());
  for (;;) {
    const studyPlanPath = path.join(current, "study-plans", "top-interview-150", "index.yaml");
    const problemsPath = path.join(current, "problems");
    if (fs.existsSync(studyPlanPath) && fs.existsSync(problemsPath)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error("Unable to locate repository root.");
}

function findProblemDirectory(problemId: number): string | null {
  const root = findRepositoryRoot();
  const problemsDir = path.join(root, "problems");
  const sections = fs.readdirSync(problemsDir);

  for (const sec of sections) {
    const secPath = path.join(problemsDir, sec);
    if (!fs.statSync(secPath).isDirectory()) continue;
    const problems = fs.readdirSync(secPath);
    for (const prob of problems) {
      const probPath = path.join(secPath, prob);
      const metaPath = path.join(probPath, "meta.yaml");
      if (fs.existsSync(metaPath)) {
        try {
          const raw = parse(fs.readFileSync(metaPath, "utf8")) as { id?: number };
          if (raw.id === problemId) {
            return probPath;
          }
        } catch {
          // ignore
        }
      }
    }
  }
  return null;
}

export interface CodeVersionItem {
  id: string;
  name?: string;
  source: string;
  isCanonical?: boolean;
}

export interface SaveCodeVersionInput {
  problemId: number;
  id?: string;
  name?: string;
  source: string;
  isDefault?: boolean;
}

export interface DeleteCodeVersionInput {
  problemId: number;
  id: string;
}

export async function saveCodeVersion(input: SaveCodeVersionInput): Promise<{ success: boolean; message: string }> {
  const probDir = findProblemDirectory(input.problemId);
  if (!probDir) {
    return { success: false, message: `Problem ${input.problemId} not found` };
  }

  const metaPath = path.join(probDir, "meta.yaml");
  if (!fs.existsSync(metaPath)) {
    return { success: false, message: "meta.yaml does not exist." };
  }

  const rawMeta = parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
  const codeVersions = Array.isArray(rawMeta.code_versions) ? [...rawMeta.code_versions] : [];

  // Nếu chưa có code_versions nào, lưu canonical Solution.java làm version đầu tiên
  if (codeVersions.length === 0) {
    codeVersions.push({
      id: "v1",
      name: "Version 1",
      file: "Solution.java",
      is_canonical: true,
      is_default: true,
    });
  }

  // Nếu đặt là mặc định, reset các version khác
  if (input.isDefault) {
    for (const v of codeVersions) {
      if (typeof v === "object" && v !== null) {
        (v as Record<string, unknown>).is_default = false;
      }
    }
  }

  // Nếu input.id trùng với 1 version đã có -> Cập nhật (Edit)
  if (input.id) {
    const existing = codeVersions.find((v) => (v as Record<string, unknown>).id === input.id) as Record<string, unknown> | undefined;
    if (existing) {
      if (input.name) existing.name = input.name;
      if (input.isDefault !== undefined) existing.is_default = input.isDefault;
      const fileName = String(existing.file || "Solution.java");
      const filePath = path.join(probDir, fileName);
      fs.writeFileSync(filePath, input.source, "utf8");
      rawMeta.code_versions = codeVersions;
      fs.writeFileSync(metaPath, stringify(rawMeta), "utf8");
      return { success: true, message: `Updated code version ${input.id}` };
    }
  }

  // Thêm mới (Create)
  const uniqueSuffix = (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36));
  const newId = `v-${uniqueSuffix}`;
  const fileName = `Solution_${newId}.java`;
  const filePath = path.join(probDir, fileName);

  fs.writeFileSync(filePath, input.source, "utf8");

  codeVersions.push({
    id: newId,
    name: input.name || `Version ${codeVersions.length + 1}`,
    file: fileName,
    is_default: Boolean(input.isDefault),
  });

  rawMeta.code_versions = codeVersions;
  fs.writeFileSync(metaPath, stringify(rawMeta), "utf8");

  return { success: true, message: `Saved new code version ${newId}` };
}

export async function deleteCodeVersion(input: DeleteCodeVersionInput): Promise<{ success: boolean; message: string }> {
  const probDir = findProblemDirectory(input.problemId);
  if (!probDir) {
    return { success: false, message: `Problem ${input.problemId} not found` };
  }

  const metaPath = path.join(probDir, "meta.yaml");
  if (!fs.existsSync(metaPath)) {
    return { success: false, message: "meta.yaml does not exist." };
  }

  const rawMeta = parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
  const codeVersions = Array.isArray(rawMeta.code_versions) ? [...rawMeta.code_versions] : [];

  const targetIdx = codeVersions.findIndex((v) => (v as Record<string, unknown>).id === input.id);
  if (targetIdx === -1) {
    return { success: false, message: "Version not found." };
  }

  const target = codeVersions[targetIdx] as Record<string, unknown>;
  const wasDefault = Boolean(target.is_default);

  // Xóa file vật lý
  if (typeof target.file === "string") {
    const filePath = path.join(probDir, target.file);
    if (fs.existsSync(filePath)) {
      if (target.file === "Solution.java") {
        // Nếu xóa Solution.java, reset nội dung rỗng hoặc chuyển file khác sang
        fs.writeFileSync(filePath, "// Code cleared\n", "utf8");
      } else {
        fs.unlinkSync(filePath);
      }
    }
  }

  codeVersions.splice(targetIdx, 1);

  // Nếu vừa xóa version mặc định và vẫn còn version khác, đặt version đầu tiên làm mặc định
  if (wasDefault && codeVersions.length > 0) {
    (codeVersions[0] as Record<string, unknown>).is_default = true;
  }

  rawMeta.code_versions = codeVersions;
  fs.writeFileSync(metaPath, stringify(rawMeta), "utf8");

  return { success: true, message: `Deleted code version ${input.id}` };
}

