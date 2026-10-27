import { NextResponse } from "next/server";
import { saveSolutionApproach } from "@/lib/content/approachManager";
import { apiErrorResponse, readLocalJson } from "@/lib/api/localGuard";
import { booleanField, contentId, problemIdField, textField } from "@/lib/content/validation";

export async function POST(request: Request) {
  try {
    const body = await readLocalJson(request);
    const result = await saveSolutionApproach({
      problemId: problemIdField(body.problemId), id: contentId(body.id),
      name: textField(body.name, "name", 200)!, tag: textField(body.tag, "tag", 100, true, true),
      timeComplexity: textField(body.timeComplexity, "timeComplexity", 200, true, true),
      spaceComplexity: textField(body.spaceComplexity, "spaceComplexity", 200, true, true),
      isDefault: booleanField(body.isDefault),
      solutionMarkdown: textField(body.solutionMarkdown, "solutionMarkdown", 262144, false, true)!,
      javaSource: textField(body.javaSource, "javaSource", 262144, false, true)!,
    });
    return NextResponse.json(result);
  } catch (error) { return apiErrorResponse(error); }
}
