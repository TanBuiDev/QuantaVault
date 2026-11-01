import type { InterviewQuestion } from "./types";

/** Public content only. Deliberately excludes draft flags and storage metadata. */
export function canonicalQuestion(question: InterviewQuestion): InterviewQuestion {
  return {
    id: question.id, title: question.title, category: question.category,
    difficulty: question.difficulty, tags: [...question.tags],
    companies: question.companies ? [...question.companies] : undefined, summary: question.summary,
    answerMarkdown: question.answerMarkdown,
    keyTakeaways: question.keyTakeaways ? [...question.keyTakeaways] : undefined,
    relatedProblems: question.relatedProblems ? [...question.relatedProblems] : undefined,
  };
}

/** Exact, synchronous content version: no hash collisions or async hydration. */
export function questionVersion(question: InterviewQuestion | null): string {
  if (question === null) return "qv1:null";
  const clean = canonicalQuestion(question);
  return `qv1:${JSON.stringify({ ...clean, companies: clean.companies ?? [], keyTakeaways: clean.keyTakeaways ?? [], relatedProblems: clean.relatedProblems ?? [] })}`;
}
