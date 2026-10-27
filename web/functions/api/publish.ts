interface PagesFunctionEnv {
  ADMIN_PIN?: string;
  TOTP_SECRET?: string;
  GITHUB_PAT?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
}

const DEFAULT_TOTP_SECRET = "ACNDJOJFMRGAE3CKKU3UG3MZVSQXTBRJ";
const RFC4648_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function fromBase32(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/[\s-]/g, "");
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = RFC4648_ALPHABET.indexOf(clean[i]);
    if (idx === -1) {
      throw new Error(`Invalid Base32 character: ${clean[i]}`);
    }
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

async function verifyTOTP(token: string, secret: string, window = 1): Promise<boolean> {
  const cleanToken = token.replace(/\s+/g, "");
  if (!cleanToken || cleanToken.length !== 6) return false;

  const rawKey = fromBase32(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey as unknown as BufferSource,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"]
  );

  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const checkTime = now + w * 30 * 1000;
    const timeStep = Math.floor(checkTime / 1000 / 30);

    const timeBuffer = new ArrayBuffer(8);
    const view = new DataView(timeBuffer);
    view.setUint32(0, Math.floor(timeStep / 0x100000000));
    view.setUint32(4, timeStep >>> 0);

    const signature = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, timeBuffer));
    const offset = signature[signature.length - 1] & 0x0f;
    const binary =
      ((signature[offset] & 0x7f) << 24) |
      ((signature[offset + 1] & 0xff) << 16) |
      ((signature[offset + 2] & 0xff) << 8) |
      (signature[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString().padStart(6, "0");
    if (otp === cleanToken) {
      return true;
    }
  }

  return false;
}

interface QuestionItem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  tags: string[];
  companies?: string[];
  summary: string;
  answerMarkdown: string;
  keyTakeaways?: string[];
  relatedProblems?: number[];
  isDeleted?: boolean;
}

export async function onRequestPost(context: {
  request: Request;
  env: PagesFunctionEnv;
}): Promise<Response> {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Pin",
    "Content-Type": "application/json",
  };

  try {
    const body = (await request.json()) as {
      pin: string;
      modifiedQuestions: QuestionItem[];
      commitMessage?: string;
    };

    const adminPin = (env.ADMIN_PIN || "lehoang@2672#1508").trim();
    const totpSecret = (env.TOTP_SECRET || DEFAULT_TOTP_SECRET).trim();
    const token = env.GITHUB_PAT;
    const owner = env.GITHUB_OWNER || "TanBuiDev";
    const repo = env.GITHUB_REPO || "leetcode";

    // 1. PIN / TOTP verification
    const entered = (body.pin || "").trim();
    let isAuthorized = false;

    if (entered === adminPin) {
      isAuthorized = true;
    } else if (/^\d{6}$/.test(entered)) {
      isAuthorized = await verifyTOTP(entered, totpSecret, 1);
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Mã Google Authenticator (6 số) hoặc mã PIN quản trị không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.",
        }),
        { status: 401, headers: corsHeaders }
      );
    }

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Hệ thống chưa cấu hình GITHUB_PAT trên Cloudflare Pages.",
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!body.modifiedQuestions || body.modifiedQuestions.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Không có câu hỏi nào trong danh sách cần xuất bản.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const githubHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "Cloudflare-Pages-Interview-CMS",
    };

    // 1. Get latest commit on main
    const refRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`,
      { headers: githubHeaders }
    );
    if (!refRes.ok) {
      const err = await refRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Lỗi đọc nhánh main: ${refRes.status} ${err}` }),
        { status: 502, headers: corsHeaders }
      );
    }
    const refData = (await refRes.json()) as { object: { sha: string } };
    const latestCommitSha = refData.object.sha;

    // 2. Get tree SHA from latest commit
    const commitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      { headers: githubHeaders }
    );
    if (!commitRes.ok) {
      const err = await commitRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Lỗi đọc commit gốc: ${commitRes.status} ${err}` }),
        { status: 502, headers: corsHeaders }
      );
    }
    const commitData = (await commitRes.json()) as { tree: { sha: string } };
    const baseTreeSha = commitData.tree.sha;

    // 3. Fetch current canonical questions
    let currentQuestions: QuestionItem[] = [];
    const rawRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/data/interview-questions.json`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );
    if (rawRes.ok) {
      try {
        currentQuestions = (await rawRes.json()) as QuestionItem[];
      } catch {
        currentQuestions = [];
      }
    }

    // 4. Merge questions and handle deletions
    const deletedIds = new Set(
      body.modifiedQuestions.filter((q) => q.isDeleted).map((q) => q.id)
    );
    const activeModified = body.modifiedQuestions.filter((q) => !q.isDeleted);

    const map = new Map<string, QuestionItem>();
    for (const q of currentQuestions) {
      if (!deletedIds.has(q.id)) {
        map.set(q.id, q);
      }
    }
    for (const q of activeModified) {
      map.set(q.id, q);
    }

    const finalQuestions: QuestionItem[] = [];
    for (const q of currentQuestions) {
      if (deletedIds.has(q.id)) continue;
      finalQuestions.push(map.get(q.id) || q);
    }

    const existingIds = new Set(currentQuestions.map((q) => q.id));
    for (const q of activeModified) {
      if (!existingIds.has(q.id)) {
        finalQuestions.unshift(q);
      }
    }

    // 5. Format with 2 spaces indent + newline (Git Hygiene)
    const formattedContent = JSON.stringify(finalQuestions, null, 2) + "\n";

    // 6. Create Git Tree with both files in single atomic transaction
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      headers: githubHeaders,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          {
            path: "data/interview-questions.json",
            mode: "100644",
            type: "blob",
            content: formattedContent,
          },
          {
            path: "web/src/data/interview-questions.json",
            mode: "100644",
            type: "blob",
            content: formattedContent,
          },
        ],
      }),
    });

    if (!treeRes.ok) {
      const err = await treeRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Lỗi tạo Git Tree: ${treeRes.status} ${err}` }),
        { status: 502, headers: corsHeaders }
      );
    }
    const treeData = (await treeRes.json()) as { sha: string };
    const newTreeSha = treeData.sha;

    // Check if there are no real changes
    if (newTreeSha === baseTreeSha) {
      return new Response(
        JSON.stringify({
          success: true,
          count: 0,
          message: "Dữ liệu hiện tại trên GitHub đã trùng khớp 100%, không cần tạo commit mới.",
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 7. Create Git Commit
    const idsSummary = body.modifiedQuestions
      .map((q) => q.id)
      .slice(0, 5)
      .join(", ");
    const extraCount =
      body.modifiedQuestions.length > 5
        ? ` và ${body.modifiedQuestions.length - 5} câu khác`
        : "";
    const finalMsg =
      body.commitMessage?.trim() ||
      `feat(interview): cập nhật ${body.modifiedQuestions.length} câu hỏi phỏng vấn (${idsSummary}${extraCount})`;

    const newCommitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: "POST",
        headers: githubHeaders,
        body: JSON.stringify({
          message: finalMsg,
          tree: newTreeSha,
          parents: [latestCommitSha],
        }),
      }
    );

    if (!newCommitRes.ok) {
      const err = await newCommitRes.text();
      return new Response(
        JSON.stringify({ success: false, error: `Lỗi tạo Commit: ${newCommitRes.status} ${err}` }),
        { status: 502, headers: corsHeaders }
      );
    }
    const newCommitData = (await newCommitRes.json()) as { sha: string };
    const newCommitSha = newCommitData.sha;

    // 8. Update main branch ref
    const updateRefRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
      {
        method: "PATCH",
        headers: githubHeaders,
        body: JSON.stringify({
          sha: newCommitSha,
        }),
      }
    );

    if (!updateRefRes.ok) {
      const err = await updateRefRes.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `Lỗi cập nhật nhánh main: ${updateRefRes.status} ${err}`,
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommitSha}`;

    return new Response(
      JSON.stringify({
        success: true,
        commitSha: newCommitSha,
        commitUrl,
        count: body.modifiedQuestions.length,
        message: `Đã xuất bản thành công ${body.modifiedQuestions.length} câu hỏi lên GitHub!`,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ success: false, error: `Lỗi máy chủ Pages Function: ${msg}` }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Pin",
    },
  });
}
