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
import { INTERVIEW_TOPIC_MAP } from "./topics";

export * from "./types";
export * from "./topics";

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

const PRIORITY_RANK: Record<string, number> = { p1: 1, p2: 2, p3: 3 };

function compareCanonicalId(a: string, b: string): number {
  const ma = /^q-(\d+)$/i.exec(a);
  const mb = /^q-(\d+)$/i.exec(b);
  if (ma && mb) return Number(ma[1]) - Number(mb[1]);
  return a.localeCompare(b);
}

/** Deterministic pedagogical sort: topic roadmapOrder -> priority -> learningOrder -> canonical ID. */
export function sortInterviewQuestionsPedagogically(questions: InterviewQuestion[]): InterviewQuestion[] {
  return [...questions].sort((a, b) => {
    const topicA = a.topicId ? INTERVIEW_TOPIC_MAP[a.topicId]?.roadmapOrder ?? 999 : 999;
    const topicB = b.topicId ? INTERVIEW_TOPIC_MAP[b.topicId]?.roadmapOrder ?? 999 : 999;
    if (topicA !== topicB) return topicA - topicB;

    const prioA = a.priority ? PRIORITY_RANK[a.priority] ?? 9 : 9;
    const prioB = b.priority ? PRIORITY_RANK[b.priority] ?? 9 : 9;
    if (prioA !== prioB) return prioA - prioB;

    const orderA = a.learningOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.learningOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;

    return compareCanonicalId(a.id, b.id);
  });
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
  const targetTopic = filter.topic ?? "all";
  const targetPriority = filter.priority ?? "all";

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

    // 3. Topic
    if (targetTopic !== "all" && q.topicId !== targetTopic) {
      return false;
    }

    // 4. Priority
    if (targetPriority !== "all" && q.priority !== targetPriority) {
      return false;
    }

    // 5. Difficulty
    if (filter.difficulty !== "all" && q.difficulty !== filter.difficulty) {
      return false;
    }

    // 6. Company
    if (filter.company !== "all" && (!q.companies || !q.companies.includes(filter.company))) {
      return false;
    }

    // 7. Progress Status
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
