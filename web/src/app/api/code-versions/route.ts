import { NextResponse } from "next/server";
import { saveCodeVersion, deleteCodeVersion } from "@/lib/content/codeVersionManager";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, id, name, source, isDefault } = body;

    if (!problemId) {
      return NextResponse.json({ error: "Problem ID is required." }, { status: 400 });
    }

    const result = await saveCodeVersion({
      problemId: Number(problemId),
      id,
      name,
      source: source || `class Solution {\n    // Implementation\n}`,
      isDefault: isDefault !== undefined ? Boolean(isDefault) : undefined,
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { problemId, id } = body;

    if (!problemId || !id) {
      return NextResponse.json({ error: "Problem ID and version ID are required." }, { status: 400 });
    }

    const result = await deleteCodeVersion({
      problemId: Number(problemId),
      id,
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
