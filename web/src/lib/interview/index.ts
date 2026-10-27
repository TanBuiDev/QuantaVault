import rawQuestions from "@/data/interview-questions.json";
import type {
  InterviewFilterState,
  InterviewProgressState,
  InterviewQuestion,
} from "./types";
import { INTERVIEW_CATEGORIES } from "./types";

export * from "./types";

export function getAllInterviewQuestions(): InterviewQuestion[] {
  return rawQuestions as InterviewQuestion[];
}

export function getInterviewQuestionById(id: string): InterviewQuestion | undefined {
  return getAllInterviewQuestions().find((q) => q.id === id);
}

export function getAllCategories() {
  return Object.values(INTERVIEW_CATEGORIES);
}

export function getAllCompanies(questions = getAllInterviewQuestions()): string[] {
  const companies = new Set<string>();
  for (const q of questions) {
    if (q.companies) {
      for (const c of q.companies) {
        companies.add(c);
      }
    }
  }
  return Array.from(companies).sort();
}

export function filterInterviewQuestions(
  questions: InterviewQuestion[],
  filter: InterviewFilterState,
  progress?: InterviewProgressState
): InterviewQuestion[] {
  return questions.filter((q) => {
    // 1. Search Query (Title, Summary, Tags, Answer)
    if (filter.search.trim()) {
      const term = filter.search.toLowerCase().trim();
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchSummary = q.summary.toLowerCase().includes(term);
      const matchTags = q.tags.some((t) => t.toLowerCase().includes(term));
      const matchCompanies = q.companies?.some((c) => c.toLowerCase().includes(term)) ?? false;
      if (!matchTitle && !matchSummary && !matchTags && !matchCompanies) {
        return false;
      }
    }

    // 2. Category
    if (filter.category !== "all" && q.category !== filter.category) {
      return false;
    }

    // 3. Difficulty
    if (filter.difficulty !== "all" && q.difficulty !== filter.difficulty) {
      return false;
    }

    // 4. Company
    if (filter.company !== "all" && (!q.companies || !q.companies.includes(filter.company))) {
      return false;
    }

    // 5. Progress Status
    if (filter.status !== "all" && progress) {
      const isLearned = Boolean(progress.learned[q.id]);
      const isReview = Boolean(progress.review[q.id]);
      const isBookmarked = Boolean(progress.bookmarks[q.id]);

      if (filter.status === "learned" && !isLearned) return false;
      if (filter.status === "review" && !isReview) return false;
      if (filter.status === "bookmarked" && !isBookmarked) return false;
      if (filter.status === "not_started" && (isLearned || isReview)) return false;
    }

    return true;
  });
}
