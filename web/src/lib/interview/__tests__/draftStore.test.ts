import { describe, it, expect, beforeEach, vi } from "vitest";
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
  reconcilePublishedCache,
  getPublishedConflicts,
  useInterviewDrafts,
  rebaseDraft,
  acceptWebsitePublishedVersion,
  keepPublishedVersionAsDraft,
  downloadPublishedConflictBackup,
} from "../draftStore";
import type { InterviewQuestion } from "../types";
import { questionVersion } from "../questionVersion";
import { renderHook, act } from "@testing-library/react";

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

      // Rendering a merge must not write to storage; reconciliation happens in an effect.
      expect(getPublishedCache()["q-1"]).toBeDefined();
    });

    it("giữ nội dung đã xuất bản khi deploy chưa cập nhật sau 15 phút", () => {
      // Đưa vào cache với timestamp cách đây 20 phút (> 15 phút)
      const oldTimestamp = Date.now() - (PUBLISHED_CACHE_TTL_MS + 5 * 60 * 1000);
      writePublishedCache({
        "q-1": {
          question: { ...mockQuestion1, title: "Nội dung quá cũ" },
          publishedAt: oldTimestamp,
        },
      });

      const merged = mergeQuestionsWithDrafts([mockQuestion1, mockQuestion2], {});

      expect(getPublishedCache()["q-1"]).toBeDefined();
      expect(merged[0].title).toBe("Nội dung quá cũ");
    });

    it("không xóa bản nháp đã sửa tiếp trong khi publish đang chạy", () => {
      saveDraft({ ...mockQuestion1, title: "Đã gửi" }, mockQuestion1);
      const submitted = getDrafts();
      saveDraft({ ...mockQuestion1, title: "Sửa tiếp" }, mockQuestion1);
      commitDraftsToPublished(submitted);
      expect(getDrafts()["q-1"].title).toBe("Sửa tiếp");
      expect(getPublishedCache()["q-1"].question.title).toBe("Đã gửi");
    });

    it("không coi draft xóa là cùng phiên bản với draft chưa xóa", () => {
      saveDraft(mockQuestion1);
      const submitted = getDrafts();
      markQuestionDeleted(mockQuestion1);
      commitDraftsToPublished(submitted);
      expect(getDrafts()["q-1"].isDeleted).toBe(true);
    });

    it("báo lỗi nếu bộ nhớ đầy thay vì giả vờ lưu thành công", () => {
      const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
      expect(() => saveDraft(mockQuestion1)).toThrow();
      write.mockRestore();
    });

    it("giữ phiên bản nền ban đầu qua nhiều lần lưu", () => {
      saveDraft({ ...mockQuestion1, title: "Lần 1" }, mockQuestion1);
      saveDraft({ ...mockQuestion1, title: "Lần 2" }, { ...mockQuestion1, title: "Thay đổi ở server" });
      expect(getDrafts()["q-1"].baseVersion).toBe(questionVersion(mockQuestion1));
    });

    it("cho phép sửa quay về nội dung cũ sau khi vừa publish nhưng website chưa cập nhật", () => {
      const published = { ...mockQuestion1, title: "Vừa xuất bản" };
      writePublishedCache({ "q-1": { question: published, publishedAt: Date.now() } });
      expect(saveDraft(mockQuestion1, mockQuestion1)).toBe(true);
      expect(getDrafts()["q-1"].title).toBe(mockQuestion1.title);
      expect(getDrafts()["q-1"].baseVersion).toBe(questionVersion(published));
    });

    it("dọn cache trong effect khi website đã có nội dung xuất bản", () => {
      const published = { ...mockQuestion1, title: "Đã triển khai" };
      writePublishedCache({ "q-1": { question: published, publishedAt: Date.now() } });
      renderHook(() => useInterviewDrafts([published, mockQuestion2]));
      expect(getPublishedCache()["q-1"]).toBeUndefined();
    });

    it("chỉ dọn cache xóa khi câu hỏi không còn trong canonical", () => {
      const cache = { "q-1": { question: { ...mockQuestion1, isDeleted: true }, publishedAt: Date.now() } };
      expect(reconcilePublishedCache([mockQuestion1], cache)).toBe(cache);
      expect(reconcilePublishedCache([mockQuestion2], cache)).toEqual({});
    });

    it("phân biệt deploy đang chờ với website có phiên bản khác", () => {
      const cache = { "q-1": { question: { ...mockQuestion1, title: "Đã gửi" }, publishedAt: Date.now(), baseVersion: questionVersion(mockQuestion1) } };
      expect(getPublishedConflicts([mockQuestion1], cache)).toEqual([]);
      expect(getPublishedConflicts([{ ...mockQuestion1, title: "Sửa từ nơi khác" }], cache)).toEqual(["q-1"]);
      expect(getPublishedConflicts([{ ...mockQuestion1, title: "Đã gửi" }], cache)).toEqual([]);
    });

    it("nhận thay đổi ở tab khác qua storage event", () => {
      const { result } = renderHook(() => useInterviewDrafts());
      act(() => {
        localStorage.setItem("interview_drafts_v1", JSON.stringify({ "q-1": { ...mockQuestion1, title: "Tab khác" } }));
        window.dispatchEvent(new StorageEvent("storage", { key: "interview_drafts_v1" }));
      });
      expect(result.current.drafts["q-1"].title).toBe("Tab khác");
    });

    it("đối chiếu xong chỉ cập nhật baseline, giữ nguyên nội dung đã sửa", () => {
      saveDraft({ ...mockQuestion1, title: "Nội dung đang giữ" }, mockQuestion1);
      const expected = getDrafts()["q-1"];
      const remote = { ...mockQuestion1, title: "Phiên bản trên GitHub" };
      rebaseDraft("q-1", expected, remote);
      expect(getDrafts()["q-1"]).toEqual({ ...expected, baseVersion: questionVersion(remote) });
    });

    it("hỗ trợ baseline câu hỏi bị xóa trên GitHub mà không xóa bản sửa local", () => {
      saveDraft({ ...mockQuestion1, title: "Khôi phục với nội dung đã sửa" }, mockQuestion1);
      const expected = getDrafts()["q-1"];
      rebaseDraft("q-1", expected, null);
      expect(getDrafts()["q-1"]).toEqual({ ...expected, baseVersion: questionVersion(null) });
    });

    it.each(["content", "deleted", "base", "missing"])("không rebase nếu snapshot %s đã thay đổi", (change) => {
      saveDraft({ ...mockQuestion1, title: "Đã đối chiếu" }, mockQuestion1);
      const expected = getDrafts()["q-1"];
      if (change === "content") saveDraft({ ...expected, answerMarkdown: "Sửa tiếp" }, mockQuestion1);
      if (change === "deleted") markQuestionDeleted(expected, mockQuestion1);
      if (change === "base") localStorage.setItem("interview_drafts_v1", JSON.stringify({ "q-1": { ...expected, baseVersion: "another-version" } }));
      if (change === "missing") removeDraft("q-1");
      const before = getDrafts();
      expect(() => rebaseDraft("q-1", expected, { ...mockQuestion1, title: "Phiên bản remote mới" })).toThrow();
      expect(getDrafts()).toEqual(before);
    });

    it("không làm mất baseline cũ nếu lưu rebase thất bại", () => {
      saveDraft({ ...mockQuestion1, title: "Cần giữ lại" }, mockQuestion1);
      const expected = getDrafts()["q-1"];
      const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
      expect(() => rebaseDraft("q-1", expected, { ...mockQuestion1, title: "Remote" })).toThrow();
      write.mockRestore();
      expect(getDrafts()["q-1"]).toEqual(expected);
    });
  });

  describe("safe published conflict resolution", () => {
    const local = { ...mockQuestion1, title: "Locally published", answerMarkdown: "Local answer" };
    const remote = { ...mockQuestion1, title: "Website version", answerMarkdown: "Website answer" };
    const cached = () => ({ question: local, publishedAt: 1234, baseVersion: questionVersion(mockQuestion1) });

    it("accepts website copy for one ID only, preserving drafts and unrelated cache", () => {
      const other = { ...mockQuestion2, title: "Unrelated published version" };
      const expected = cached();
      writePublishedCache({ "q-1": expected, "q-2": { question: other, publishedAt: 5678 } });
      saveDraft({ ...mockQuestion1, title: "Unpublished edit" }, mockQuestion1);
      const beforeDrafts = getDrafts();

      acceptWebsitePublishedVersion("q-1", expected);
      expect(getPublishedCache()["q-1"]).toBeUndefined();
      expect(getPublishedCache()["q-2"].question.title).toBe(other.title);
      expect(getDrafts()).toEqual(beforeDrafts);
    });

    it("refuses stale cache snapshots from another tab without deleting anything", () => {
      const expected = cached();
      const changed = { ...expected, question: { ...expected.question, title: "Newer tab edit" } };
      writePublishedCache({ "q-1": expected });
      writePublishedCache({ "q-1": changed });
      expect(() => acceptWebsitePublishedVersion("q-1", expected)).toThrow(/đã thay đổi/);
      expect(() => keepPublishedVersionAsDraft("q-1", expected, remote)).toThrow(/đã thay đổi/);
      expect(getPublishedCache()["q-1"]).toEqual(changed);
      expect(getDrafts()).toEqual({});
    });

    it("moves local published copy to a draft based on website version without republishing", () => {
      const expected = cached();
      writePublishedCache({ "q-1": expected });
      keepPublishedVersionAsDraft("q-1", expected, remote);
      expect(getDrafts()["q-1"]).toEqual({ ...local, baseVersion: questionVersion(remote) });
      expect(getPublishedCache()["q-1"]).toBeUndefined();
    });

    it("never overwrites a separately edited draft", () => {
      const expected = cached();
      writePublishedCache({ "q-1": expected });
      saveDraft({ ...mockQuestion1, title: "Work in progress" }, mockQuestion1);
      const before = getDrafts();
      expect(() => keepPublishedVersionAsDraft("q-1", expected, remote)).toThrow(/bản nháp/);
      expect(getDrafts()).toEqual(before);
      expect(getPublishedCache()["q-1"]).toEqual(expected);
    });

    it("keeps published copy if storage refuses the draft write", () => {
      const expected = cached();
      writePublishedCache({ "q-1": expected });
      const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("quota", "QuotaExceededError");
      });
      expect(() => keepPublishedVersionAsDraft("q-1", expected, remote)).toThrow();
      spy.mockRestore();
      expect(getPublishedCache()["q-1"]).toEqual(expected);
      expect(getDrafts()["q-1"]).toBeUndefined();
    });

    it("retains both copies if the second cache write fails after draft creation", () => {
      const expected = cached();
      writePublishedCache({ "q-1": expected });
      const setItem = Storage.prototype.setItem;
      const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (key, value) {
        if (key === "interview_published_cache_v1") throw new DOMException("quota", "QuotaExceededError");
        return setItem.call(this, key, value);
      });
      expect(() => keepPublishedVersionAsDraft("q-1", expected, remote)).toThrow();
      spy.mockRestore();
      expect(getPublishedCache()["q-1"]).toEqual(expected);
      expect(getDrafts()["q-1"]).toEqual({ ...local, baseVersion: questionVersion(remote) });
    });

    it("backs up canonical, draft and published layers without mutating them", () => {
      const expected = cached();
      writePublishedCache({ "q-1": expected });
      saveDraft({ ...mockQuestion2, title: "Unpublished question" }, mockQuestion2);
      const beforeDraft = getDrafts();
      const beforeCache = getPublishedCache();
      const create = vi.fn(() => "blob:test");
      const revoke = vi.fn();
      const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
      Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
      Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revoke });
      downloadPublishedConflictBackup([mockQuestion1, mockQuestion2], beforeDraft, beforeCache);
      expect(create).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revoke).toHaveBeenCalledWith("blob:test");
      expect(getDrafts()).toEqual(beforeDraft);
      expect(getPublishedCache()).toEqual(beforeCache);
      click.mockRestore();
    });
  });

});
