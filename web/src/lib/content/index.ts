import "server-only";

import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ContentAvailability = "none" | "partial" | "complete";

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

export interface ProblemContent extends ProblemSummary {
  problemMarkdown: string | null;
  hintsMarkdown: string | null;
  solutionMarkdown: string | null;
  interviewMarkdown: string | null;
  javaSource: string | null;
  casesYaml: string | null;
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

function readTextIfExists(filePath: string): string | null {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function parseProblemMeta(metaPath: string): ProblemSummary {
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

  return {
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

      const record = { summary: parseProblemMeta(metaPath), directory };
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
  return {
    ...summary,
    topics: [...summary.topics],
    patterns: [...summary.patterns],
    problemMarkdown: readTextIfExists(path.join(directory, "problem.md")),
    hintsMarkdown: readTextIfExists(path.join(directory, "hints.md")),
    solutionMarkdown: readTextIfExists(path.join(directory, "solution.md")),
    interviewMarkdown: readTextIfExists(path.join(directory, "interview.md")),
    javaSource: readTextIfExists(path.join(directory, "Solution.java")),
    casesYaml: readTextIfExists(path.join(directory, "cases.yaml")),
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
