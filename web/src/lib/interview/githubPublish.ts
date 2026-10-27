import type { InterviewQuestion } from "./types";
import { verifyTOTP, DEFAULT_TOTP_SECRET } from "./totp";

export interface PublishEnv {
  GITHUB_PAT?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  ADMIN_PIN?: string;
  TOTP_SECRET?: string;
}

export type PublishQuestionItem = InterviewQuestion & { isDeleted?: boolean };

export interface PublishPayload {
  pin: string;
  modifiedQuestions: PublishQuestionItem[];
  commitMessage?: string;
}

export interface PublishResult {
  success: boolean;
  commitSha?: string;
  commitUrl?: string;
  message?: string;
  count?: number;
  error?: string;
}

export async function executePublishToGithub(
  payload: PublishPayload,
  env: PublishEnv
): Promise<PublishResult> {
  const { pin, modifiedQuestions, commitMessage } = payload;

  const adminPin = (env.ADMIN_PIN || "lehoang@2672#1508").trim();
  const totpSecret = (env.TOTP_SECRET || DEFAULT_TOTP_SECRET).trim();
  const token = env.GITHUB_PAT;
  const owner = env.GITHUB_OWNER || "TanBuiDev";
  const repo = env.GITHUB_REPO || "QuantaVault";

  // 1. PIN / TOTP verification
  const entered = (pin || "").trim();
  let isAuthorized = false;

  if (entered === adminPin) {
    isAuthorized = true;
  } else if (/^\d{6}$/.test(entered)) {
    isAuthorized = await verifyTOTP(entered, totpSecret, { window: 1 });
  }

  if (!isAuthorized) {
    return {
      success: false,
      error:
        "Mã Google Authenticator (6 số) hoặc Mã PIN quản trị không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.",
    };
  }

  if (!token) {
    return {
      success: false,
      error: "Hệ thống chưa cấu hình GITHUB_PAT. Vui lòng kiểm tra biến môi trường.",
    };
  }

  if (!modifiedQuestions || modifiedQuestions.length === 0) {
    return {
      success: false,
      error: "Không có câu hỏi nào trong danh sách cần xuất bản.",
    };
  }

  const githubHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "Cloudflare-Pages-Interview-CMS",
  };

  try {
    // 2. Lấy commit SHA mới nhất trên nhánh main
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
      headers: githubHeaders,
    });
    if (!refRes.ok) {
      const err = await refRes.text();
      return { success: false, error: `Không thể đọc nhánh main: ${refRes.status} ${err}` };
    }
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    // 3. Lấy base_tree SHA từ commit đó
    const commitRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      { headers: githubHeaders }
    );
    if (!commitRes.ok) {
      const err = await commitRes.text();
      return { success: false, error: `Không thể đọc commit: ${commitRes.status} ${err}` };
    }
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    // 4. Lấy nội dung hiện tại của data/interview-questions.json
    let currentQuestions: InterviewQuestion[] = [];
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
        currentQuestions = await rawRes.json();
      } catch {
        currentQuestions = [];
      }
    }

    // 5. Hợp nhất (merge) các câu hỏi đã sửa vào mảng JSON gốc và loại bỏ câu bị xóa
    const deletedIds = new Set(
      modifiedQuestions.filter((q) => q.isDeleted).map((q) => q.id)
    );
    const activeModified = modifiedQuestions.filter((q) => !q.isDeleted);

    const map = new Map<string, InterviewQuestion>();
    for (const q of currentQuestions) {
      if (!deletedIds.has(q.id)) {
        map.set(q.id, q);
      }
    }
    for (const q of activeModified) {
      map.set(q.id, q);
    }

    // Giữ nguyên thứ tự câu hỏi gốc, cập nhật câu hỏi sửa, bỏ câu bị xóa
    const finalQuestions: InterviewQuestion[] = [];
    for (const q of currentQuestions) {
      if (deletedIds.has(q.id)) continue;
      finalQuestions.push(map.get(q.id) || q);
    }

    // Bổ sung các câu hỏi mới tạo (chưa có trong mảng gốc) lên đầu
    const existingIds = new Set(currentQuestions.map((q) => q.id));
    for (const q of activeModified) {
      if (!existingIds.has(q.id)) {
        finalQuestions.unshift(q);
      }
    }

    // 6. Định dạng JSON chuẩn mực với thụt lề 2 spaces + xuống dòng cuối file (Git Hygiene)
    const formattedContent = JSON.stringify(finalQuestions, null, 2) + "\n";

    // 7. Tạo Git Tree mới chứa CẢ 2 FILE trong 1 request duy nhất (Atomic Multi-file)
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
      return { success: false, error: `Lỗi tạo Git Tree: ${treeRes.status} ${err}` };
    }
    const treeData = await treeRes.json();
    const newTreeSha = treeData.sha;

    // 8. Chống tạo commit rỗng: Nếu Tree SHA không đổi, không cần tạo commit
    if (newTreeSha === baseTreeSha) {
      return {
        success: true,
        count: 0,
        message: "Dữ liệu hiện tại trên GitHub đã trùng khớp 100%, không cần tạo commit mới.",
      };
    }

    // 9. Tạo Git Commit mới
    const idsSummary = modifiedQuestions
      .map((q) => q.id)
      .slice(0, 5)
      .join(", ");
    const extraCount = modifiedQuestions.length > 5 ? ` and ${modifiedQuestions.length - 5} more` : "";
    const finalMsg =
      commitMessage?.trim() ||
      `feat(interview): update ${modifiedQuestions.length} interview questions (${idsSummary}${extraCount})`;

    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      headers: githubHeaders,
      body: JSON.stringify({
        message: finalMsg,
        tree: newTreeSha,
        parents: [latestCommitSha],
      }),
    });

    if (!newCommitRes.ok) {
      const err = await newCommitRes.text();
      return { success: false, error: `Lỗi tạo Commit: ${newCommitRes.status} ${err}` };
    }
    const newCommitData = await newCommitRes.json();
    const newCommitSha = newCommitData.sha;

    // 10. Cập nhật nhánh main trỏ tới commit mới
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
      return { success: false, error: `Lỗi cập nhật nhánh main: ${updateRefRes.status} ${err}` };
    }

    const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommitSha}`;

    return {
      success: true,
      commitSha: newCommitSha,
      commitUrl,
      count: modifiedQuestions.length,
      message: `Đã xuất bản thành công ${modifiedQuestions.length} câu hỏi lên GitHub!`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Lỗi ngoại lệ khi giao tiếp với GitHub: ${msg}` };
  }
}
