import { describe, it, expect, beforeEach } from "vitest";
import {
  getDrafts,
  saveDraft,
  removeDraft,
  clearAllDrafts,
  getPublishedCache,
  writePublishedCache,
  commitDraftsToPublished,
  clearAllPublishedCache,
  mergeQuestionsWithDrafts,
  areQuestionsEqual,
  markQuestionDeleted,
  PUBLISHED_CACHE_TTL_MS,
} from "../draftStore";
import type { InterviewQuestion } from "../types";

const mockQuestion1: InterviewQuestion = {
  id: "q-1",
  title: "Câu hỏi 1 gốc",
  category: "java-core",
  difficulty: "junior",
  tags: ["Java"],
  summary: "Tóm tắt 1",
  answerMarkdown: "Trả lời 1",
  keyTakeaways: ["Điểm 1"],
  companies: ["VNPay"],
  relatedProblems: [1],
};

const mockQuestion2: InterviewQuestion = {
  id: "q-2",
  title: "Câu hỏi 2 gốc",
  category: "spring",
  difficulty: "middle",
  tags: ["Spring"],
  summary: "Tóm tắt 2",
  answerMarkdown: "Trả lời 2",
};

describe("draftStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAllDrafts();
    clearAllPublishedCache();
  });

  describe("areQuestionsEqual", () => {
    it("trả về true khi 2 câu hỏi giống nhau hoàn toàn", () => {
      const copy = { ...mockQuestion1 };
      expect(areQuestionsEqual(mockQuestion1, copy)).toBe(true);
    });

    it("trả về false khi tiêu đề bị đổi", () => {
      const changed = { ...mockQuestion1, title: "Tiêu đề khác" };
      expect(areQuestionsEqual(mockQuestion1, changed)).toBe(false);
    });

    it("trả về false khi tóm tắt hoặc nội dung bị đổi", () => {
      const changed = { ...mockQuestion1, summary: "Tóm tắt khác" };
      expect(areQuestionsEqual(mockQuestion1, changed)).toBe(false);
    });

    it("trả về false khi danh sách mảng khác nhau", () => {
      const changed = { ...mockQuestion1, keyTakeaways: ["Điểm khác"] };
      expect(areQuestionsEqual(mockQuestion1, changed)).toBe(false);
    });
  });

  describe("saveDraft & Smart Auto Clean Revert", () => {
    it("lưu vào bản nháp khi có sự thay đổi so với bản gốc", () => {
      const edited: InterviewQuestion = {
        ...mockQuestion1,
        title: "Câu hỏi 1 đã sửa",
      };

      const isSaved = saveDraft(edited, mockQuestion1);
      expect(isSaved).toBe(true);

      const drafts = getDrafts();
      expect(drafts["q-1"]).toBeDefined();
      expect(drafts["q-1"].title).toBe("Câu hỏi 1 đã sửa");
    });

    it("TỰ ĐỘNG XÓA BẢN NHÁP khi người dùng sửa nội dung quay trở lại giống 100% bản gốc", () => {
      // 1. Sửa lần đầu: "xin chào" -> "chào"
      const edited: InterviewQuestion = {
        ...mockQuestion1,
        title: "chào",
      };
      saveDraft(edited, mockQuestion1);
      expect(getDrafts()["q-1"]).toBeDefined();

      // 2. Sửa lần hai quay lại bản gốc: "chào" -> "Câu hỏi 1 gốc"
      const reverted: InterviewQuestion = {
        ...mockQuestion1,
        title: "Câu hỏi 1 gốc",
      };
      const isSaved = saveDraft(reverted, mockQuestion1);

      // Phải trả về false và xóa khỏi localStorage
      expect(isSaved).toBe(false);
      expect(getDrafts()["q-1"]).toBeUndefined();
    });
  });

  describe("mergeQuestionsWithDrafts & deletion", () => {
    it("hợp nhất chính xác danh sách câu hỏi gốc với các câu hỏi nháp", () => {
      const editedQ1: InterviewQuestion = {
        ...mockQuestion1,
        title: "Câu hỏi 1 đã sửa",
      };
      saveDraft(editedQ1);

      const merged = mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], getDrafts());

      expect(merged.length).toBe(2);
      expect(merged[0].id).toBe("q-1");
      expect(merged[0].title).toBe("Câu hỏi 1 đã sửa");
      expect(merged[0].isDraft).toBe(true);

      expect(merged[1].id).toBe("q-2");
      expect(merged[1].title).toBe("Câu hỏi 2 gốc");
      expect(merged[1].isDraft).toBeUndefined();
    });

    it("hỗ trợ ẩn câu hỏi bị đánh dấu xóa trong draft", () => {
      markQuestionDeleted(mockQuestion1);

      const merged = mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], getDrafts());
      // mockQuestion1 bị đánh dấu xóa nên chỉ còn lại mockQuestion2
      expect(merged.length).toBe(1);
      expect(merged[0].id).toBe("q-2");
    });

    it("xóa bản nháp của 1 câu hỏi cụ thể", () => {
      saveDraft(mockQuestion1);
      expect(getDrafts()["q-1"]).toBeDefined();

      removeDraft("q-1");
      expect(getDrafts()["q-1"]).toBeUndefined();
    });

    it("xóa toàn bộ bản nháp sau khi xuất bản", () => {
      saveDraft(mockQuestion1);
      saveDraft(mockQuestion2);
      expect(Object.keys(getDrafts()).length).toBe(2);

      clearAllDrafts();
      expect(Object.keys(getDrafts()).length).toBe(0);
    });
  });

  describe("Optimistic UI & Published Cache", () => {
    it("chuyển đổi toàn bộ drafts sang publishedCache khi gọi commitDraftsToPublished", () => {
      const editedQ1: InterviewQuestion = {
        ...mockQuestion1,
        title: "Câu hỏi 1 đã xuất bản",
      };
      saveDraft(editedQ1);
      expect(Object.keys(getDrafts()).length).toBe(1);

      commitDraftsToPublished();

      // Drafts đã được làm trống
      expect(Object.keys(getDrafts()).length).toBe(0);

      // PublishedCache đã được ghi nhận
      const cache = getPublishedCache();
      expect(cache["q-1"]).toBeDefined();
      expect(cache["q-1"].question.title).toBe("Câu hỏi 1 đã xuất bản");
      expect(cache["q-1"].publishedAt).toBeGreaterThan(0);
    });

    it("hiển thị câu hỏi trong publishedCache với isDraft = false (như dữ liệu chính thức)", () => {
      const editedQ1: InterviewQuestion = {
        ...mockQuestion1,
        title: "Câu hỏi 1 xuất bản ngay",
      };
      saveDraft(editedQ1);
      commitDraftsToPublished();

      const merged = mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], getDrafts());

      expect(merged.length).toBe(2);
      expect(merged[0].id).toBe("q-1");
      expect(merged[0].title).toBe("Câu hỏi 1 xuất bản ngay");
      expect(merged[0].isDraft).toBe(false); // Không còn nhãn nháp nữa!
    });

    it("ưu tiên bản nháp mới (isDraft = true) nếu người dùng tiếp tục sửa câu hỏi đã có trong publishedCache", () => {
      // 1. Xuất bản lần 1
      saveDraft({ ...mockQuestion1, title: "Bản xuất bản v1" });
      commitDraftsToPublished();

      // 2. Soạn nháp lần 2 ngay sau đó
      saveDraft({ ...mockQuestion1, title: "Bản nháp v2 đang sửa" });

      const merged = mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], getDrafts());

      expect(merged[0].title).toBe("Bản nháp v2 đang sửa");
      expect(merged[0].isDraft).toBe(true);
    });

    it("TỰ ĐỘNG DỌN RÁC (Reconciliation): tự xóa khỏi cache khi Cloudflare build xong dữ liệu mới", () => {
      const newTitle = "Nội dung mới sau build";
      // 1. Đưa vào publishedCache
      writePublishedCache({
        "q-1": {
          question: { ...mockQuestion1, title: newTitle },
          publishedAt: Date.now(),
        },
      });
      expect(getPublishedCache()["q-1"]).toBeDefined();

      // 2. Giả lập Cloudflare Pages đã build xong: canonicalQuestions lúc này đã có newTitle!
      const cloudflareUpdatedCanonical = [
        { ...mockQuestion1, title: newTitle },
        mockQuestion2,
      ];

      // Khi trang web render với canonical mới
      mergeQuestionsWithDrafts(cloudflareUpdatedCanonical, {});

      // Cache tự động được dọn sạch vì dữ liệu đã đồng bộ 100%!
      expect(getPublishedCache()["q-1"]).toBeUndefined();
    });

    it("TỰ ĐỘNG XÓA BẢN GHI ĐÃ HẾT HẠN (TTL 15 phút)", () => {
      // Đưa vào cache với timestamp cách đây 20 phút (> 15 phút)
      const oldTimestamp = Date.now() - (PUBLISHED_CACHE_TTL_MS + 5 * 60 * 1000);
      writePublishedCache({
        "q-1": {
          question: { ...mockQuestion1, title: "Nội dung quá cũ" },
          publishedAt: oldTimestamp,
        },
      });

      mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], {});

      // Phải tự động bị xóa vì quá hạn TTL
      expect(getPublishedCache()["q-1"]).toBeUndefined();
    });
  });
});
