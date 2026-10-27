import rawQuestions from "@/data/interview-questions.json";
import { matchesSearch } from "@/lib/utils/stringUtils";
import type {
  InterviewFilterState,
  InterviewProgressState,
  InterviewQuestion,
} from "./types";
import { INTERVIEW_CATEGORIES, formatQuestionBadge } from "./types";

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
  const filtered = questions.filter((q) => {
    // 1. Search Query (Number, Badge, ID, Title, Summary, Tags, Companies with accent-insensitive support)
    if (filter.search.trim()) {
      const term = filter.search.trim();
      const badge = formatQuestionBadge(q.id); // e.g. "#087"
      const numOnly = q.id.replace(/\D/g, ""); // e.g. "087"
      const unpaddedNum = String(parseInt(numOnly || "0", 10)); // e.g. "87"

      const cleanTerm = term.toLowerCase();
      const matchBadge =
        badge.toLowerCase().includes(cleanTerm) ||
        `#${unpaddedNum}`.includes(cleanTerm) ||
        (cleanTerm.startsWith("#") && cleanTerm.slice(1) === unpaddedNum);
      const matchNumberExact = cleanTerm === numOnly || cleanTerm === unpaddedNum;
      const matchId = matchesSearch(q.id, term) || matchBadge || matchNumberExact;
      const matchTitle = matchesSearch(q.title, term);
      const matchSummary = matchesSearch(q.summary, term);
      const matchTags = q.tags.some((t) => matchesSearch(t, term));
      const matchCompanies = q.companies?.some((c) => matchesSearch(c, term)) ?? false;
      if (!matchId && !matchTitle && !matchSummary && !matchTags && !matchCompanies) {
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

  // Prioritize exact question number or badge matches to the very top
  if (filter.search.trim()) {
    const rawTerm = filter.search.trim().toLowerCase();
    const cleanNum = rawTerm.replace(/^[#q\-0]+/, ""); // e.g. "#087" -> "87", "q-087" -> "87", "87" -> "87"
    if (cleanNum && /^\d+$/.test(cleanNum)) {
      filtered.sort((a, b) => {
        const aNum = a.id.replace(/\D/g, "").replace(/^0+/, "");
        const bNum = b.id.replace(/\D/g, "").replace(/^0+/, "");
        if (aNum === cleanNum && bNum !== cleanNum) return -1;
        if (bNum === cleanNum && aNum !== cleanNum) return 1;
        return 0;
      });
    }
  }

  return filtered;
}
