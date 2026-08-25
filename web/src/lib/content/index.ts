import "server-only";

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ContentAvailability = "none" | "partial" | "complete";

export interface ProblemMedia {
  id: string;
  path: string;
  scope: "problem" | "solution";
  role: string;
  altEn: string;
  altVi: string;
}

export interface ProblemSummary {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  primarySection: string;
  topics: string[];
  patterns: string[];
  leetcodeUrl: string;
  contentStatus: {
    source: "full-source" | "list-only" | "source-missing";
    translation: ContentAvailability;
    hints: ContentAvailability;
    solution: ContentAvailability;
    interview: ContentAvailability;
    cases: ContentAvailability;
    problemMedia: "none" | "available" | "media-missing";
    solutionMedia: "none" | "available" | "media-missing";
  };
}

export interface StudyPlanSection {
  name: string;
  slug: string;
  problemIds: number[];
}

export interface StudyPlan {
  id: string;
  title: string;
  sections: StudyPlanSection[];
}

export interface SolutionApproach {
  id: string;
  name: string;
  tag?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  isDefault?: boolean;
  solutionMarkdown: string | null;
  javaSource: string | null;
}

export interface CodeVersionItem {
  id: string;
  name: string;
  source: string;
  isCanonical?: boolean;
  isDefault?: boolean;
}


export interface ProblemContent extends ProblemSummary {
  problemMarkdown: string | null;
  hintsMarkdown: string | null;
  solutionMarkdown: string | null;
  interviewMarkdown: string | null;
  javaSource: string | null;
  casesYaml: string | null;
  media?: ProblemMedia[];
  approaches?: SolutionApproach[];
  codeVersions?: CodeVersionItem[];
}



interface RawMeta {
  schema_version?: unknown;
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  difficulty?: unknown;
  primary_section?: unknown;
  topics?: unknown;
  patterns?: unknown;
  leetcode_url?: unknown;
  content_status?: Record<string, unknown>;
  media?: unknown;
}

interface RawStudyPlan {
  id?: unknown;
  title?: unknown;
  sections?: Array<{
    name?: unknown;
    slug?: unknown;
    problems?: unknown;
  }>;
}

interface ProblemRecord {
  summary: ProblemSummary;
  directory: string;
  media: ProblemMedia[];
}

let repositoryRootCache: string | null = null;
let recordsCache: ProblemRecord[] | null = null;
let studyPlanCache: StudyPlan | null = null;

function assertString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid canonical content: ${field} must be a non-empty string.`);
  }
  return value;
}

function assertStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) {
    throw new Error(`Invalid canonical content: ${field} must be a string array.`);
  }
  return [...value];
}

function assertEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(
      `Invalid canonical content: ${field} must be one of ${allowed.join(", ")}.`,
    );
  }
  return value as T;
}

function findRepositoryRoot(): string {
  if (repositoryRootCache) return repositoryRootCache;

  let current = path.resolve(/* turbopackIgnore: true */ process.cwd());
  for (;;) {
    const studyPlanPath = path.join(
      current,
      "study-plans",
      "top-interview-150",
      "index.yaml",
    );
    const problemsPath = path.join(current, "problems");

    if (fs.existsSync(studyPlanPath) && fs.existsSync(problemsPath)) {
      repositoryRootCache = current;
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new Error(
    `Unable to locate repository root from ${process.cwd()}; expected study-plans/top-interview-150/index.yaml and problems/.`,
  );
}

function parseMedia(value: unknown, metaPath: string): ProblemMedia[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`Invalid canonical content: ${metaPath}: media must be an array.`);
  return value.map((entry, index) => {
    if (!entry || typeof entry !== "object") throw new Error(`Invalid canonical content: ${metaPath}: media[${index}] must be an object.`);
    const item = entry as Record<string, unknown>;
    return {
      id: assertString(item.id, `${metaPath}: media[${index}].id`),
      path: assertString(item.path, `${metaPath}: media[${index}].path`),
      scope: assertEnum(item.scope, ["problem", "solution"] as const, `${metaPath}: media[${index}].scope`),
      role: assertString(item.role, `${metaPath}: media[${index}].role`),
      altEn: assertString(item.alt_en, `${metaPath}: media[${index}].alt_en`),
      altVi: assertString(item.alt_vi, `${metaPath}: media[${index}].alt_vi`),
    };
  });
}

function readTextIfExists(filePath: string): string | null {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function parseProblemMeta(metaPath: string): { summary: ProblemSummary; media: ProblemMedia[] } {
  const raw = parse(fs.readFileSync(metaPath, "utf8")) as RawMeta;

  if (raw.schema_version !== 2) {
    throw new Error(`Invalid canonical content: ${metaPath} must use schema_version: 2.`);
  }
  if (!Number.isInteger(raw.id) || (raw.id as number) <= 0) {
    throw new Error(`Invalid canonical content: ${metaPath} id must be a positive integer.`);
  }

  const status = raw.content_status;
  if (!status || typeof status !== "object") {
    throw new Error(`Invalid canonical content: ${metaPath} is missing content_status.`);
  }

  const summary = {
    id: raw.id as number,
    slug: assertString(raw.slug, `${metaPath}: slug`),
    title: assertString(raw.title, `${metaPath}: title`),
    difficulty: assertEnum(raw.difficulty, ["Easy", "Medium", "Hard"] as const, `${metaPath}: difficulty`),
    primarySection: assertString(raw.primary_section, `${metaPath}: primary_section`),
    topics: assertStringArray(raw.topics, `${metaPath}: topics`),
    patterns: assertStringArray(raw.patterns, `${metaPath}: patterns`),
    leetcodeUrl: assertString(raw.leetcode_url, `${metaPath}: leetcode_url`),
    contentStatus: {
      source: assertEnum(
        status.source,
        ["full-source", "list-only", "source-missing"] as const,
        `${metaPath}: content_status.source`,
      ),
      translation: assertEnum(
        status.translation,
        ["none", "partial", "complete"] as const,
        `${metaPath}: content_status.translation`,
      ),
      hints: assertEnum(
        status.hints,
        ["none", "partial", "complete"] as const,
        `${metaPath}: content_status.hints`,
      ),
      solution: assertEnum(
        status.solution,
        ["none", "partial", "complete"] as const,
        `${metaPath}: content_status.solution`,
      ),
      interview: assertEnum(
        status.interview,
        ["none", "partial", "complete"] as const,
        `${metaPath}: content_status.interview`,
      ),
      cases: assertEnum(
        status.cases,
        ["none", "partial", "complete"] as const,
        `${metaPath}: content_status.cases`,
      ),
      problemMedia: assertEnum(
        status.problem_media,
        ["none", "available", "media-missing"] as const,
        `${metaPath}: content_status.problem_media`,
      ),
      solutionMedia: assertEnum(
        status.solution_media,
        ["none", "available", "media-missing"] as const,
        `${metaPath}: content_status.solution_media`,
      ),
    },
  };
  return { summary, media: parseMedia(raw.media, metaPath) };
}

function validateRequiredFiles(record: ProblemRecord): void {
  const { summary, directory } = record;
  const requireFile = (status: ContentAvailability, filename: string) => {
    if (status === "complete" && !fs.existsSync(path.join(directory, filename))) {
      throw new Error(
        `Canonical content mismatch for problem ${summary.id}: content_status marks ${filename} complete but the file is missing.`,
      );
    }
  };

  if (
    summary.contentStatus.source === "full-source" &&
    summary.contentStatus.translation === "complete" &&
    !fs.existsSync(path.join(directory, "problem.md"))
  ) {
    throw new Error(
      `Canonical content mismatch for problem ${summary.id}: translation is complete but problem.md is missing.`,
    );
  }

  requireFile(summary.contentStatus.hints, "hints.md");
  requireFile(summary.contentStatus.solution, "solution.md");
  requireFile(summary.contentStatus.interview, "interview.md");
  requireFile(summary.contentStatus.cases, "cases.yaml");

  if (
    summary.contentStatus.solution === "complete" &&
    !fs.existsSync(path.join(directory, "Solution.java"))
  ) {
    throw new Error(
      `Canonical content mismatch for problem ${summary.id}: solution is complete but Solution.java is missing.`,
    );
  }
}

function loadProblemRecords(): ProblemRecord[] {
  if (recordsCache) return recordsCache;

  const problemsRoot = path.join(findRepositoryRoot(), "problems");
  const records: ProblemRecord[] = [];

  for (const sectionEntry of fs.readdirSync(problemsRoot, { withFileTypes: true })) {
    if (!sectionEntry.isDirectory()) continue;
    const sectionPath = path.join(problemsRoot, sectionEntry.name);

    for (const problemEntry of fs.readdirSync(sectionPath, { withFileTypes: true })) {
      if (!problemEntry.isDirectory()) continue;
      const directory = path.join(sectionPath, problemEntry.name);
      const metaPath = path.join(directory, "meta.yaml");
      if (!fs.existsSync(metaPath)) continue;

      const parsed = parseProblemMeta(metaPath);
      const record = { ...parsed, directory };
      validateRequiredFiles(record);
      records.push(record);
    }
  }

  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();
  for (const { summary } of records) {
    if (seenIds.has(summary.id)) {
      throw new Error(`Duplicate canonical problem id ${summary.id}.`);
    }
    if (seenSlugs.has(summary.slug)) {
      throw new Error(`Duplicate canonical problem slug ${summary.slug}.`);
    }
    seenIds.add(summary.id);
    seenSlugs.add(summary.slug);
  }

  recordsCache = records;
  return records;
}

function recordById(id: number): ProblemRecord | null {
  return loadProblemRecords().find((record) => record.summary.id === id) ?? null;
}

export function getTopInterview150(): StudyPlan {
  if (studyPlanCache) return studyPlanCache;

  const studyPlanPath = path.join(
    findRepositoryRoot(),
    "study-plans",
    "top-interview-150",
    "index.yaml",
  );
  const raw = parse(fs.readFileSync(studyPlanPath, "utf8")) as RawStudyPlan;
  if (!Array.isArray(raw.sections)) {
    throw new Error(`Invalid canonical study plan: ${studyPlanPath} is missing sections.`);
  }

  const plan: StudyPlan = {
    id: assertString(raw.id, `${studyPlanPath}: id`),
    title: assertString(raw.title, `${studyPlanPath}: title`),
    sections: raw.sections.map((section, index) => {
      if (
        !Array.isArray(section.problems) ||
        !section.problems.every((id) => Number.isInteger(id) && (id as number) > 0)
      ) {
        throw new Error(
          `Invalid canonical study plan: section ${index + 1} problems must be positive integer IDs.`,
        );
      }
      return {
        name: assertString(section.name, `${studyPlanPath}: section ${index + 1} name`),
        slug: assertString(section.slug, `${studyPlanPath}: section ${index + 1} slug`),
        problemIds: [...(section.problems as number[])],
      };
    }),
  };

  const ids = plan.sections.flatMap((section) => section.problemIds);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Invalid canonical study plan: duplicate problem IDs detected.");
  }
  for (const id of ids) {
    if (!recordById(id)) {
      throw new Error(`Invalid canonical study plan: problem ${id} has no canonical package.`);
    }
  }

  studyPlanCache = plan;
  return plan;
}

export function getAllProblemSummaries(): ProblemSummary[] {
  const orderedIds = getOrderedProblemIds();
  return orderedIds.map((id) => {
    const summary = getProblemSummary(id);
    if (!summary) {
      throw new Error(`Canonical study plan problem ${id} could not be resolved.`);
    }
    return summary;
  });
}

export function getProblemSummary(id: number): ProblemSummary | null {
  const record = recordById(id);
  return record ? { ...record.summary, topics: [...record.summary.topics], patterns: [...record.summary.patterns] } : null;
}

export function getProblemContent(id: number): ProblemContent | null {
  const record = recordById(id);
  if (!record) return null;

  const { summary, directory } = record;
  const metaPath = path.join(directory, "meta.yaml");
  let approaches: SolutionApproach[] | undefined;
  let codeVersions: CodeVersionItem[] | undefined;

  try {
    const raw = parse(fs.readFileSync(metaPath, "utf8")) as Record<string, unknown>;
    
    // Load code_versions
    if (Array.isArray(raw.code_versions) && raw.code_versions.length > 0) {
      const versionsList = raw.code_versions as Array<Record<string, unknown>>;
      const hasAnyDefault = versionsList.some((x) => Boolean(x?.is_default || x?.default));

      codeVersions = versionsList.map((v, idx) => {
        const vId = assertString(v.id || `v${idx + 1}`, `${metaPath}: code_versions[${idx}].id`);
        const vFile = String(v.file || "Solution.java");
        const isDef = Boolean(v.is_default || v.default || (idx === 0 && !hasAnyDefault));
        return {
          id: vId,
          name: typeof v.name === "string" ? v.name : `Version ${idx + 1}`,
          source: readTextIfExists(path.join(directory, vFile)) || "",
          isCanonical: Boolean(v.is_canonical || vFile === "Solution.java"),
          isDefault: isDef,
        };
      });
    }



    if (Array.isArray(raw.solutions)) {
      approaches = raw.solutions.map((item, idx) => {
        const sol = item as Record<string, unknown>;
        const approachId = assertString(sol.id || `approach-${idx + 1}`, `${metaPath}: solutions[${idx}].id`);
        const subDir = sol.dir ? path.join(directory, String(sol.dir)) : null;

        return {
          id: approachId,
          name: assertString(sol.name, `${metaPath}: solutions[${idx}].name`),
          tag: typeof sol.tag === "string" ? sol.tag : undefined,
          timeComplexity: typeof sol.time === "string" ? sol.time : undefined,
          spaceComplexity: typeof sol.space === "string" ? sol.space : undefined,
          isDefault: Boolean(sol.default || sol.canonical),
          solutionMarkdown: subDir
            ? readTextIfExists(path.join(subDir, "solution.md"))
            : readTextIfExists(path.join(directory, "solution.md")),
          javaSource: subDir
            ? readTextIfExists(path.join(subDir, "Solution.java"))
            : readTextIfExists(path.join(directory, "Solution.java")),
        };
      });
    }
  } catch {
    // Fallback if parsing custom solutions fails
  }

  const defaultJava = readTextIfExists(path.join(directory, "Solution.java"));

  // Nếu chưa có codeVersions trong meta.yaml nhưng có Solution.java -> Khởi tạo version 1 mặc định
  if (!codeVersions && defaultJava) {
    codeVersions = [
      {
        id: "v1",
        name: "Version 1",
        source: defaultJava,
        isCanonical: true,
      },
    ];
  }

  return {
    ...summary,
    topics: [...summary.topics],
    patterns: [...summary.patterns],
    problemMarkdown: readTextIfExists(path.join(directory, "problem.md")),
    hintsMarkdown: readTextIfExists(path.join(directory, "hints.md")),
    solutionMarkdown: readTextIfExists(path.join(directory, "solution.md")),
    interviewMarkdown: readTextIfExists(path.join(directory, "interview.md")),
    javaSource: defaultJava,
    casesYaml: readTextIfExists(path.join(directory, "cases.yaml")),
    media: record.media.map((item) => ({ ...item })),
    approaches,
    codeVersions,
  };
}



export function getOrderedProblemIds(): number[] {
  return getTopInterview150().sections.flatMap((section) => section.problemIds);
}

export function getAdjacentProblemIds(id: number): {
  previous: number | null;
  next: number | null;
} {
  const ids = getOrderedProblemIds();
  const index = ids.indexOf(id);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? ids[index - 1] : null,
    next: index < ids.length - 1 ? ids[index + 1] : null,
  };
}

export function splitHints(markdown: string | null): string[] {
  if (!markdown) return [];
  const matches = [...markdown.matchAll(/^## Hint\s+\d+[^\n]*$/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? markdown.length;
    return markdown.slice(start, end).trim().replace(/\n---\s*$/, "").trim();
  });
}
