import rawQuestions from "@/data/interview-questions.json";
import mergedCategoryAliases from "./mergedCategoryAliases.json";
import { matchesSearch } from "@/lib/utils/stringUtils";
import type {
  InterviewCategory,
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
  // Historical aliases may collide with real canonical IDs.
  return getAllInterviewQuestions().find((q) => q.id === id);
}

/** Retain the original category entry points for cross-category merges. */
export function interviewMatchesCategory(question: InterviewQuestion, category: InterviewCategory): boolean {
  if (question.category === category) return true;
  const aliases = mergedCategoryAliases as Record<string, string[]>;
  return (aliases[question.id] ?? []).includes(category);
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
  const term = filter.search.trim();
  // Numeric queries are exact IDs, never substring or ambiguous merged-ID matches.
  const numericQuery = /^(?:#|q-)?(\d+)$/i.exec(term);
  const requestedId = numericQuery ? `q-${numericQuery[1].padStart(3, "0")}`.toLowerCase() : null;

  return questions.filter((q) => {
    if (requestedId) {
      if (q.id.toLowerCase() !== requestedId) return false;
    } else if (term) {
      const matchesText =
        matchesSearch(q.id, term) ||
        matchesSearch(q.title, term) ||
        matchesSearch(q.summary, term) ||
        q.tags.some((tag) => matchesSearch(tag, term)) ||
        (q.companies?.some((company) => matchesSearch(company, term)) ?? false);
      if (!matchesText) return false;
    }

    // 2. Category
    if (filter.category !== "all" && !interviewMatchesCategory(q, filter.category)) {
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
