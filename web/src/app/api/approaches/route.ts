import { NextResponse } from "next/server";
import { saveSolutionApproach } from "@/lib/content/approachManager";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, id, name, tag, timeComplexity, spaceComplexity, isDefault, solutionMarkdown, javaSource } = body;

    if (!problemId || !name || !javaSource) {
      return NextResponse.json(
        { error: "Problem ID, Approach Name, and Java Source are required." },
        { status: 400 }
      );
    }

    const result = await saveSolutionApproach({
      problemId: Number(problemId),
      id,
      name,
      tag,
      timeComplexity,
      spaceComplexity,
      isDefault: Boolean(isDefault),
      solutionMarkdown: solutionMarkdown || `# ${name}\n\n## Core idea\n\nExplain your approach here.`,
      javaSource,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
