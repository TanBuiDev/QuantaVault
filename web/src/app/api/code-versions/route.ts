import { NextResponse } from "next/server";
import { saveCodeVersion, deleteCodeVersion } from "@/lib/content/codeVersionManager";
import { apiErrorResponse, readLocalJson } from "@/lib/api/localGuard";
import { booleanField, contentId, problemIdField, textField } from "@/lib/content/validation";

export async function POST(request: Request) {
  try {
    const body = await readLocalJson(request);
    const result = await saveCodeVersion({
      problemId: problemIdField(body.problemId), id: contentId(body.id),
      name: textField(body.name, "name", 200, true),
      source: textField(body.source, "source", 262144, false, true)!,
      isDefault: booleanField(body.isDefault),
    });
    return NextResponse.json(result);
  } catch (error) { return apiErrorResponse(error); }
}

export async function DELETE(request: Request) {
  try {
    const body = await readLocalJson(request);
    return NextResponse.json(await deleteCodeVersion({ problemId: problemIdField(body.problemId), id: contentId(body.id, false)! }));
  } catch (error) { return apiErrorResponse(error); }
}
