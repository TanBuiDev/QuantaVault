import type { ProblemContent } from "@/lib/content";
export interface AdjacentProblemLink {
  id: number;
  title: string;
}

export interface PracticeViewProps {
  content: ProblemContent;
  hints: string[];
  previous: AdjacentProblemLink | null;
  next: AdjacentProblemLink | null;
  sectionName: string;
}

export type PracticeTab = "problem" | "hints" | "solution" | "interview" | "notes";

