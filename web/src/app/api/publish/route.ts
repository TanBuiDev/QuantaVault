import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { executePublishToGithub, type PublishPayload } from "@/lib/interview/githubPublish";
import { verifyTOTP, DEFAULT_TOTP_SECRET } from "@/lib/interview/totp";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublishPayload;

    const env = {
      ADMIN_PIN: process.env.ADMIN_PIN || "lehoang@2672#1508",
      TOTP_SECRET: process.env.TOTP_SECRET || DEFAULT_TOTP_SECRET,
      GITHUB_PAT: process.env.GITHUB_PAT,
      GITHUB_OWNER: process.env.GITHUB_OWNER || "TanBuiDev",
      GITHUB_REPO: process.env.GITHUB_REPO || "leetcode",
    };

    // 1. PIN / TOTP verification
    const entered = (body.pin || "").trim();
    let isAuthorized = false;

    if (entered === env.ADMIN_PIN.trim()) {
      isAuthorized = true;
    } else if (/^\d{6}$/.test(entered)) {
      isAuthorized = await verifyTOTP(entered, env.TOTP_SECRET.trim(), { window: 1 });
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Mã Google Authenticator (6 số) hoặc mã PIN quản trị không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.",
        },
        { status: 401 }
      );
    }

    // In local development, also immediately save to local disk files for convenience
    try {
      const rootDir = path.resolve(process.cwd(), "..");
      const dataFilePath = path.join(rootDir, "data", "interview-questions.json");
      const webDataFilePath = path.join(process.cwd(), "src", "data", "interview-questions.json");

      let currentQuestions = [];
      if (fs.existsSync(dataFilePath)) {
        currentQuestions = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
      } else if (fs.existsSync(webDataFilePath)) {
        currentQuestions = JSON.parse(fs.readFileSync(webDataFilePath, "utf8"));
      }

      const map = new Map();
      for (const q of currentQuestions) map.set(q.id, q);
      for (const q of body.modifiedQuestions) map.set(q.id, q);

      const finalQuestions = currentQuestions.map((q: { id: string }) => map.get(q.id) || q);
      const existingIds = new Set(currentQuestions.map((q: { id: string }) => q.id));
      for (const q of body.modifiedQuestions) {
        if (!existingIds.has(q.id)) finalQuestions.unshift(q);
      }

      const formatted = JSON.stringify(finalQuestions, null, 2) + "\n";
      if (fs.existsSync(path.dirname(dataFilePath))) fs.writeFileSync(dataFilePath, formatted, "utf8");
      if (fs.existsSync(path.dirname(webDataFilePath))) fs.writeFileSync(webDataFilePath, formatted, "utf8");
    } catch (localWriteError) {
      console.warn("Local disk write warning:", localWriteError);
    }

    // 2. Perform GitHub Git Database API atomic publish
    const result = await executePublishToGithub(body, env);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
