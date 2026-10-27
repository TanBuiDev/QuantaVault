import { describe, it, expect, vi, beforeEach } from "vitest";
import { executePublishToGithub } from "../githubPublish";
import { generateTOTP } from "../totp";
import type { InterviewQuestion } from "../types";

const mockQuestion: InterviewQuestion = {
  id: "q-1",
  title: "Câu hỏi 1",
  category: "java-core",
  difficulty: "junior",
  tags: ["Java"],
  summary: "Tóm tắt",
  answerMarkdown: "Trả lời",
};

describe("executePublishToGithub", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("từ chối khi mã PIN quản trị không khớp", async () => {
    const result = await executePublishToGithub(
      {
        pin: "sai-ma-pin",
        modifiedQuestions: [mockQuestion],
      },
      {
        ADMIN_PIN: "2672",
        GITHUB_PAT: "ghp_mock",
      }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Mã PIN");
  });

  it("chấp nhận mã xác thực hợp lệ từ Google Authenticator (TOTP)", async () => {
    const totpSecret = "ACNDJOJFMRGAE3CKKU3UG3MZVSQXTBRJ";
    const validOtp = await generateTOTP(totpSecret);

    const result = await executePublishToGithub(
      {
        pin: validOtp,
        modifiedQuestions: [],
      },
      {
        ADMIN_PIN: "lehoang@2672#1508",
        TOTP_SECRET: totpSecret,
        GITHUB_PAT: "ghp_mock",
      }
    );

    // Vượt qua bước PIN / TOTP, đến bước kiểm tra modifiedQuestions
    expect(result.success).toBe(false);
    expect(result.error).toContain("Không có câu hỏi");
  });

  it("từ chối khi thiếu GITHUB_PAT", async () => {
    const result = await executePublishToGithub(
      {
        pin: "2672",
        modifiedQuestions: [mockQuestion],
      },
      {
        ADMIN_PIN: "2672",
        GITHUB_PAT: undefined,
      }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("GITHUB_PAT");
  });

  it("từ chối khi danh sách câu hỏi rỗng", async () => {
    const result = await executePublishToGithub(
      {
        pin: "2672",
        modifiedQuestions: [],
      },
      {
        ADMIN_PIN: "2672",
        GITHUB_PAT: "ghp_mock",
      }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Không có câu hỏi");
  });

  it("thực hiện thành công chuỗi Git Database API (/git/trees)", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    // 1. GET /git/ref/heads/main
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ object: { sha: "commit-sha-1" } }),
    });

    // 2. GET /git/commits/commit-sha-1
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tree: { sha: "tree-sha-1" } }),
    });

    // 3. GET raw questions
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockQuestion],
    });

    // 4. POST /git/trees
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sha: "new-tree-sha" }),
    });

    // 5. POST /git/commits
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sha: "new-commit-sha" }),
    });

    // 6. PATCH /git/refs/heads/main
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const result = await executePublishToGithub(
      {
        pin: "2672",
        modifiedQuestions: [
          {
            ...mockQuestion,
            title: "Câu hỏi đã sửa",
          },
        ],
      },
      {
        ADMIN_PIN: "2672",
        GITHUB_PAT: "ghp_mock",
        GITHUB_OWNER: "TanBuiDev",
        GITHUB_REPO: "leetcode",
      }
    );

    expect(result.success).toBe(true);
    expect(result.commitSha).toBe("new-commit-sha");
    expect(result.count).toBe(1);
    expect(result.commitUrl).toContain("new-commit-sha");
  });
});
