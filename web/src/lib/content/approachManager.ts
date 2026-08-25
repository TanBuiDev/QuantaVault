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

export interface CreateApproachInput {
  problemId: number;
  id?: string;
  name: string;
  tag?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  isDefault?: boolean;
  solutionMarkdown: string;
  javaSource: string;
}

export async function saveSolutionApproach(input: CreateApproachInput): Promise<{ success: boolean; message: string }> {
  const probDir = findProblemDirectory(input.problemId);
  if (!probDir) {
    return { success: false, message: `Cannot find problem directory for problem ID ${input.problemId}` };
  }

  const metaPath = path.join(probDir, "meta.yaml");
  if (!fs.existsSync(metaPath)) {
    return { success: false, message: "meta.yaml does not exist." };
  }

  const rawMeta = parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
  const solutionsList = Array.isArray(rawMeta.solutions) ? [...rawMeta.solutions] : [];

  // Nếu bài toán chưa từng khai báo `solutions:` trong meta.yaml,
  // tự động đưa cách giải gốc (canonical solution trong Solution.java / solution.md) vào làm Approach 1
  if (solutionsList.length === 0) {
    solutionsList.push({
      id: "canonical",
      name: "Cách 1: Lời giải chuẩn (Canonical)",
      tag: "Optimal",
      time: typeof rawMeta.time_complexity === "string" ? rawMeta.time_complexity : "O(n)",
      space: typeof rawMeta.space_complexity === "string" ? rawMeta.space_complexity : "O(1)",
      default: !input.isDefault,
    });
  }

  // Generate unique approach ID using crypto randomUUID
  const uniqueId = input.id && input.id.trim() !== ""
    ? input.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")
    : (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36));

  const approachId = `approach-${uniqueId.replace(/^approach-/, "")}`;
  const approachDirName = approachId;
  const subDirPath = path.join(probDir, "solutions", approachDirName);

  // 1. Create sub directory if needed
  if (!fs.existsSync(subDirPath)) {
    fs.mkdirSync(subDirPath, { recursive: true });
  }

  // 2. Write solution.md & Solution.java
  fs.writeFileSync(path.join(subDirPath, "solution.md"), input.solutionMarkdown, "utf8");
  fs.writeFileSync(path.join(subDirPath, "Solution.java"), input.javaSource, "utf8");

  // 3. Update meta.yaml
  // If isDefault is true, set others default to false
  if (input.isDefault) {
    for (const sol of solutionsList) {
      if (typeof sol === "object" && sol !== null) {
        (sol as Record<string, unknown>).default = false;
      }
    }
  }


  const newEntry: Record<string, unknown> = {
    id: approachId,
    name: input.name,
    tag: input.tag || "Alternative",
    time: input.timeComplexity || "O(n)",
    space: input.spaceComplexity || "O(1)",
    default: Boolean(input.isDefault),
    dir: `solutions/${approachDirName}`,
  };

  // Check if exists
  const existingIdx = solutionsList.findIndex((s) => (s as Record<string, unknown>)?.id === approachId);
  if (existingIdx >= 0) {
    solutionsList[existingIdx] = newEntry;
  } else {
    solutionsList.push(newEntry);
  }

  rawMeta.solutions = solutionsList;
  fs.writeFileSync(metaPath, stringify(rawMeta), "utf8");

  return { success: true, message: `Successfully saved approach "${input.name}".` };
}
