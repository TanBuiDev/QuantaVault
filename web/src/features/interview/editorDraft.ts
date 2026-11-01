import type { InterviewQuestion } from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES } from "@/lib/interview/types";

export type EditorDraftValues = Pick<InterviewQuestion, "title" | "category" | "difficulty" | "summary" | "answerMarkdown" | "tags"> & {
  companies: string[];
  relatedProblems: string;
};
export interface EditorDraft {
  version?: 1;
  updatedAt?: number;
  baseVersion?: string;
  values: EditorDraftValues | null;
  raw: string;
}
export const editorDraftKey = (id: string) => `interview_draft_${id}`;

/** Legacy drafts are retained and require consent, never silently removed. */
export function readEditorDraft(question: InterviewQuestion): EditorDraft | null {
  try {
    const raw = sessionStorage.getItem(editorDraftKey(question.id));
    if (!raw) return null;
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw); } catch { return { values: null, raw }; }
    if (!data || typeof data !== "object") return { values: null, raw };
    const values = data.version === 1 ? data.values : data;
    if (!values || typeof values !== "object") return { values: null, raw };
    const candidate = values as Record<string, unknown>;
    if (typeof candidate.answerMarkdown !== "string") return { values: null, raw };
    const strings = (value: unknown, fallback: string[]) => Array.isArray(value) && value.every(v => typeof v === "string") ? value as string[] : fallback;
    const categories = Object.keys(INTERVIEW_CATEGORIES);
    return {
      raw,
      version: data.version === 1 ? 1 : undefined,
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
      baseVersion: typeof data.baseVersion === "string" ? data.baseVersion : undefined,
      values: {
        title: typeof candidate.title === "string" ? candidate.title : question.title,
        summary: typeof candidate.summary === "string" ? candidate.summary : question.summary,
        answerMarkdown: candidate.answerMarkdown,
        category: categories.includes(String(candidate.category)) ? candidate.category as InterviewQuestion["category"] : question.category,
        difficulty: ["junior", "middle", "senior"].includes(String(candidate.difficulty)) ? candidate.difficulty as InterviewQuestion["difficulty"] : question.difficulty,
        companies: strings(candidate.companies, question.companies ?? []),
        tags: strings(candidate.tags, question.tags),
        relatedProblems: typeof candidate.relatedProblems === "string" ? candidate.relatedProblems : Array.isArray(candidate.relatedProblems) ? candidate.relatedProblems.join(", ") : (question.relatedProblems ?? []).join(", "),
      },
    };
  } catch { return null; }
}

export function writeEditorDraft(id: string, baseVersion: string, values: EditorDraftValues): void {
  sessionStorage.setItem(editorDraftKey(id), JSON.stringify({ version: 1, updatedAt: Date.now(), baseVersion, values }));
}
