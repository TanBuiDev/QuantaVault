# Migration & Rollback Guide — Interview Bank Restructure

## 1. Thay đổi Schema
- `category`: Mở rộng từ 11 lên 19 danh mục (`oop`, `exceptions`, `streams`, `modern-java`, `live-coding`, `testing`, `troubleshooting`, `career-interview` được tách độc lập).
- `difficulty`: Bổ sung `fresher` cùng `junior`, `middle`, `senior`.
- Trường mới bắt buộc trên dữ liệu canonical (`--strict-all`):
  - `topicId`: ID chủ đề con ổn định trong `web/src/lib/interview/topics.ts`.
  - `priority`: `"p1" | "p2" | "p3"`.
  - `learningOrder`: Số nguyên dương xác định thứ tự sư phạm trong topic.

## 2. Tương thích ngược (Progress, Drafts, Cache, URLs)
- **ID Canonical:** Không renumber bất kỳ `q-xxx` nào. `q-068` được retire an toàn vào `retiredInterviewIds.json` (`q-068 -> q-067`).
- **User Progress (`learned`, `review`, `bookmarks`):** Giữ nguyên khóa theo ID câu hỏi và phạm vi tài khoản; không tự đánh dấu `learned` cho các câu mới (`q-540..q-544`).
- **Drafts & Published Cache (`interview_drafts_v1`, `interview_published_cache_v1`):**
  - `questionVersion.ts` và `draftStore.ts` (`areQuestionsEqual`) so sánh đầy đủ `topicId`, `priority`, `learningOrder`.
  - `editorDraft.ts` đọc an toàn bản nháp cũ thiếu field mới (fallback về giá trị canonical hiện tại).
  - `githubPublish.ts` validate đầy đủ 19 categories, `fresher`, `topicId`, `priority`, `learningOrder`, và đồng bộ byte-for-byte 2 file JSON.
- **URL cũ:** `?questionId=q-xxx`, `?category=java-core`, `?difficulty=junior` (không tự mở rộng sang `fresher`), `?edit=true`, `?size=all`, `?recall=answers` đều giữ nguyên hành vi; các category bị tách có banner gợi ý chuyển nhanh sang danh mục con.

## 3. Quy trình Rollback
- Nếu phát hiện lỗi nghiêm trọng sau khi deploy lên `main`:
  1. Dừng các đợt cập nhật tiếp theo và lưu log CI/Cloudflare.
  2. Tạo revert commit (`git revert <commit-sha>`) trên `main` và push để GitHub Actions tự động build & deploy bản ổn định trước đó lên Cloudflare Pages (không force-push, không chạy `wrangler --commit-dirty=true` vượt CI).
  3. Không restore toàn bộ D1 database từ snapshot cũ để tránh mất tiến độ học phát sinh sau release.
