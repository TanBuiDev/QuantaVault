export type LearningStatus = "in-progress" | "solved" | "review";

export interface ProblemProgress {
  problemId: number;
  status: LearningStatus;
  bookmarked: boolean;
  confidence: 1 | 2 | 3 | 4 | 5 | null;
  revealedHints: number;
  solutionViewed: boolean;
  interviewViewed: boolean;
  notes: string;
  updatedAt: string;
}

export interface ProgressStateV1 {
  version: 1;
  problems: Record<string, ProblemProgress>;
}

export const PROGRESS_STORAGE_KEY = "leetcode-top150-progress:v1";

const EMPTY_STATE: ProgressStateV1 = { version: 1, problems: {} };
const VALID_STATUSES = new Set<LearningStatus>(["in-progress", "solved", "review"]);

function emptyState(): ProgressStateV1 {
  return { version: 1, problems: {} };
}

function normalizeConfidence(value: unknown): ProblemProgress["confidence"] {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5
    ? value
    : null;
}

function normalizeHints(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function normalizeProgress(value: unknown, expectedId?: number): ProblemProgress | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<ProblemProgress>;
  if (!Number.isInteger(record.problemId) || (record.problemId as number) <= 0) return null;
  if (expectedId !== undefined && record.problemId !== expectedId) return null;
  if (!VALID_STATUSES.has(record.status as LearningStatus)) return null;
  if (typeof record.bookmarked !== "boolean") return null;
  if (typeof record.solutionViewed !== "boolean") return null;
  if (typeof record.interviewViewed !== "boolean") return null;
  if (typeof record.notes !== "string") return null;
  if (typeof record.updatedAt !== "string" || Number.isNaN(Date.parse(record.updatedAt))) return null;

  return {
    problemId: record.problemId as number,
    status: record.status as LearningStatus,
    bookmarked: record.bookmarked,
    confidence: normalizeConfidence(record.confidence),
    revealedHints: normalizeHints(record.revealedHints),
    solutionViewed: record.solutionViewed,
    interviewViewed: record.interviewViewed,
    notes: record.notes,
    updatedAt: record.updatedAt,
  };
}

function normalizeState(value: unknown): ProgressStateV1 {
  if (!value || typeof value !== "object") return emptyState();
  const state = value as Partial<ProgressStateV1>;
  if (state.version !== 1 || !state.problems || typeof state.problems !== "object") {
    return emptyState();
  }

  const problems: Record<string, ProblemProgress> = {};
  for (const [key, candidate] of Object.entries(state.problems)) {
    const id = Number(key);
    if (!Number.isInteger(id) || id <= 0) continue;
    const normalized = normalizeProgress(candidate, id);
    if (normalized) problems[String(id)] = normalized;
  }
  return { version: 1, problems };
}

export function readProgress(): ProgressStateV1 {
  if (typeof window === "undefined" || !window.localStorage) return emptyState();
  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return emptyState();

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

export function writeProgress(state: ProgressStateV1): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  const normalized = normalizeState(state);
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(normalized));
}

export function getProblemProgress(
  state: ProgressStateV1,
  problemId: number,
): ProblemProgress | null {
  return state.problems[String(problemId)] ?? null;
}

export function upsertProblemProgress(
  state: ProgressStateV1,
  problemId: number,
  patch: Partial<Omit<ProblemProgress, "problemId" | "updatedAt">>,
): ProgressStateV1 {
  if (!Number.isInteger(problemId) || problemId <= 0) return state;

  const existing = getProblemProgress(state, problemId);
  const status = VALID_STATUSES.has(patch.status as LearningStatus)
    ? (patch.status as LearningStatus)
    : existing?.status ?? "in-progress";

  const next: ProblemProgress = {
    problemId,
    status,
    bookmarked:
      typeof patch.bookmarked === "boolean" ? patch.bookmarked : existing?.bookmarked ?? false,
    confidence:
      patch.confidence !== undefined
        ? normalizeConfidence(patch.confidence)
        : existing?.confidence ?? null,
    revealedHints:
      patch.revealedHints !== undefined
        ? normalizeHints(patch.revealedHints)
        : existing?.revealedHints ?? 0,
    solutionViewed:
      typeof patch.solutionViewed === "boolean"
        ? patch.solutionViewed
        : existing?.solutionViewed ?? false,
    interviewViewed:
      typeof patch.interviewViewed === "boolean"
        ? patch.interviewViewed
        : existing?.interviewViewed ?? false,
    notes: typeof patch.notes === "string" ? patch.notes : existing?.notes ?? "",
    updatedAt: new Date().toISOString(),
  };

  return {
    version: 1,
    problems: {
      ...state.problems,
      [String(problemId)]: next,
    },
  };
}

export function removeProblemProgress(
  state: ProgressStateV1,
  problemId: number,
): ProgressStateV1 {
  const key = String(problemId);
  if (!(key in state.problems)) return state;
  const { [key]: _removed, ...problems } = state.problems;
  void _removed;
  return { version: 1, problems };
}

export function createEmptyProgressState(): ProgressStateV1 {
  return { ...EMPTY_STATE, problems: {} };
}
