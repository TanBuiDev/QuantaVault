import { NextResponse } from "next/server";
import { getTopInterview150, getProblemSummary } from "@/lib/content";

export interface NavProblemItem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  slug: string;
}

export interface NavSectionItem {
  name: string;
  slug: string;
  problems: NavProblemItem[];
}

export interface StudyPlanNavResponse {
  id: string;
  title: string;
  sections: NavSectionItem[];
}

export async function GET() {
  try {
    const studyPlan = getTopInterview150();

    const sections: NavSectionItem[] = studyPlan.sections.map((section) => {
      const problems: NavProblemItem[] = section.problemIds.map((id) => {
        const summary = getProblemSummary(id);
        return {
          id,
          title: summary?.title || `Problem ${id}`,
          difficulty: summary?.difficulty || "Medium",
          slug: summary?.slug || "",
        };
      });

      return {
        name: section.name,
        slug: section.slug,
        problems,
      };
    });

    const response: StudyPlanNavResponse = {
      id: studyPlan.id,
      title: studyPlan.title,
      sections,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API /api/study-plan error:", error);
    return NextResponse.json({ error: "Failed to load study plan" }, { status: 500 });
  }
}
