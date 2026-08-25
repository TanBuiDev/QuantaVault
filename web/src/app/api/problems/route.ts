import { NextResponse } from "next/server";
import { getAllProblemSummaries } from "@/lib/content";

export async function GET() {
  try {
    const problems = getAllProblemSummaries();

    const minimal = problems.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      primarySection: p.primarySection,
      topics: p.topics,
    }));
    return NextResponse.json(minimal);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Error loading problems";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
