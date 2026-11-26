import { INTERVIEW_CATEGORIES, type InterviewFilterState } from "@/lib/interview/types";
import { INTERVIEW_TOPIC_MAP } from "@/lib/interview/topics";
import { getUrlParams } from "@/lib/utils/urlParams";

/** Session-only view preference, separate from account progress and admin drafts. */
export const INTERVIEW_VIEW_STORAGE_KEY = "interview_view_state_v1";

export type InterviewViewState = {
  filter: InterviewFilterState;
  currentPage: number;
  pageSize: number | "all";
  recallMode: "summaries" | "answers";
  viewMode: "list" | "path";
};

export const DEFAULT_INTERVIEW_FILTER: InterviewFilterState = {
  search: "",
  category: "all",
  topic: "all",
  difficulty: "all",
  priority: "all",
  status: "all",
  company: "all",
};

const VIEW_PARAM_KEYS = ["search", "q", "category", "topic", "difficulty", "priority", "status", "company", "page", "size", "recall", "view"];
const DIFFICULTIES = ["all", "fresher", "junior", "middle", "senior"];
const PRIORITIES = ["all", "p1", "p2", "p3"];
const STATUSES = ["all", "not_started", "learned", "review", "bookmarked"];
const PAGE_SIZES = [15, 30, 50, 100];

export function parseInterviewViewParams(params: URLSearchParams): InterviewViewState {
  const category = params.get("category") || "all";
  const topic = params.get("topic") || "all";
  const difficulty = params.get("difficulty") || "all";
  const priority = params.get("priority") || "all";
  const status = params.get("status") || "all";
  const size = params.get("size");
  const parsedSize = size && /^\d+$/.test(size) ? Number(size) : 15;
  const rawPage = params.get("page");
  const parsedPage = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;

  return {
    filter: {
      search: params.get("search") || params.get("q") || "",
      category: category === "all" || Object.prototype.hasOwnProperty.call(INTERVIEW_CATEGORIES, category)
        ? category as InterviewFilterState["category"] : "all",
      topic: topic === "all" || Object.prototype.hasOwnProperty.call(INTERVIEW_TOPIC_MAP, topic)
        ? topic : "all",
      difficulty: DIFFICULTIES.includes(difficulty) ? difficulty as InterviewFilterState["difficulty"] : "all",
      priority: PRIORITIES.includes(priority) ? priority as NonNullable<InterviewFilterState["priority"]> : "all",
      status: STATUSES.includes(status) ? status as InterviewFilterState["status"] : "all",
      company: params.get("company") || "all",
    },
    currentPage: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    pageSize: size === "all" ? "all" : PAGE_SIZES.includes(parsedSize) ? parsedSize : 15,
    recallMode: params.get("recall") === "answers" ? "answers" : "summaries",
    viewMode: params.get("view") === "path" ? "path" : "list",
  };
}

/** Explicit URL view params take priority; edit/auth params alone don't override remembered filters. */
export function getInterviewViewState(): InterviewViewState {
  const url = getUrlParams();
  if (VIEW_PARAM_KEYS.some((key) => url.has(key))) return parseInterviewViewParams(url);
  if (typeof window !== "undefined") {
    try {
      const saved = window.sessionStorage.getItem(INTERVIEW_VIEW_STORAGE_KEY);
      if (saved) return parseInterviewViewParams(new URLSearchParams(saved));
    } catch {
      // Storage can be disabled; URL filtering remains functional.
    }
  }
  return parseInterviewViewParams(url);
}

/** Persist the same non-default state that is encoded in the view's URL. */
export function saveInterviewViewState(view: InterviewViewState): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  const { filter, currentPage, pageSize, recallMode, viewMode } = view;
  if (filter.search) params.set("search", filter.search);
  if (filter.category !== "all") params.set("category", filter.category);
  if (filter.topic && filter.topic !== "all") params.set("topic", filter.topic);
  if (filter.difficulty !== "all") params.set("difficulty", filter.difficulty);
  if (filter.priority && filter.priority !== "all") params.set("priority", filter.priority);
  if (filter.status !== "all") params.set("status", filter.status);
  if (filter.company !== "all") params.set("company", filter.company);
  if (currentPage > 1) params.set("page", String(currentPage));
  if (pageSize !== 15) params.set("size", String(pageSize));
  if (recallMode !== "summaries") params.set("recall", recallMode);
  if (viewMode !== "list") params.set("view", viewMode);
  try {
    const value = params.toString();
    if (value) window.sessionStorage.setItem(INTERVIEW_VIEW_STORAGE_KEY, value);
    else window.sessionStorage.removeItem(INTERVIEW_VIEW_STORAGE_KEY);
  } catch {
    // Browsers with blocked storage should still allow normal navigation.
  }
}

export function clearInterviewViewState(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(INTERVIEW_VIEW_STORAGE_KEY);
  } catch {
    // Ignore optional storage errors.
  }
}
