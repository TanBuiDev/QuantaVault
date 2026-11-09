# QuantaVault — Bàn giao ngữ cảnh cho chat phát triển mới

> **Ngày kiểm tra:** 09/11/2026 (GMT+7). Đây là ảnh chụp trạng thái, **không** thay thế việc kiểm tra GitHub và Cloudflare ở đầu chat tiếp theo.

## 1. Dự án và môi trường

- **Website production:** https://quantavault.pages.dev
- **Repository:** https://github.com/TanBuiDev/QuantaVault
- **Production branch:** `main`
- **Frontend:** Next.js, React, TypeScript; Cloudflare Pages (static export + Pages Functions).
- **CI/CD:** GitHub Actions; Web CI kiểm thử rồi triển khai bằng Wrangler lên Cloudflare Pages; Java Docker có workflow riêng.
- **Dữ liệu nội dung chuẩn:** GitHub (chủ yếu `data/` và bản dùng cho web trong `web/src/data/`).
- **Tiến độ phỏng vấn đồng bộ:** Cloudflare D1, binding `INTERVIEW_DB`, qua Pages Function `web/functions/api/interview-progress.ts`.
- **Xuất bản câu hỏi:** Pages Function `web/functions/api/publish.ts` với kiểm tra PIN + TOTP phía server; không tiết lộ/chia sẻ các bí mật này.

**Trạng thái được kiểm tra ngày 09/11/2026:**
- `main`: `d7397b0263015f6ac42823473870c1c64d3854e3` — đã merge PR #14.
- GitHub Actions [Web CI #42597638147](https://github.com/TanBuiDev/QuantaVault/actions/runs/42597638147): **success**, gồm job triển khai Cloudflare Pages.
- GitHub Actions [Java Docker #42597637968](https://github.com/TanBuiDev/QuantaVault/actions/runs/42597637968): **success**.
- Cloudflare Pages: production deployment `3f60ea75-2585-4c67-9cef-cfd6aff44c2d`, **success**; tạo lúc 10:07 UTC (17:07 GMT+7), ngày 09/11/2026.
- Cloudflare deployment dùng Wrangler `ad_hoc`, trường `commit_hash` có thể để trống: **không suy ra SHA từ Cloudflare**, đối chiếu GitHub Actions deploy job cùng thời điểm.

## 2. Những chức năng cần giữ nguyên

1. **Ngân hàng câu hỏi Java Backend / Microservices:** xem, tìm kiếm, lọc; đánh dấu `Nắm vững`, `Cần ôn`, `Đã lưu`; chỉnh nội dung, lưu bản nháp, xem trước và xuất bản.
2. **Soạn thảo Markdown:** hỗ trợ code block, Mermaid, thay đổi cỡ chữ; phím `Ctrl+B`/`Ctrl+I` và toolbar **B/I** dùng chung logic toggle (đã sửa lỗi thêm `****...****` khi nhấn hai lần).
3. **Xuất bản an toàn:** cập nhật đồng thời `data/interview-questions.json` và `web/src/data/interview-questions.json` bằng Git tree/commit; kiểm tra `baseVersion` theo câu hỏi, phát hiện HTTP 409 khi dữ liệu/nhánh đã thay đổi; giữ bản nháp nếu lỗi.
4. **Đồng bộ tiến độ phỏng vấn:** D1 theo mã đồng bộ riêng, có revision/version và xử lý xung đột; `localStorage` là dự phòng phía trình duyệt.
5. **Luyện thuật toán Top Interview 150**, Monaco, bộ test, Java local runner với Docker (không tự ý sửa hoặc bật runner trên production).
6. **Trang khóa học và Sidebar:** Sidebar tự lấy metadata từ course registry, hiện 3 khóa; khi >4 khóa ban đầu hiển thị 4 rồi cho “Xem thêm”, ưu tiên khóa đang mở/gần đây. Trang catalog có tìm kiếm, lọc trạng thái, responsive layout và “Tiếp tục học” theo khóa gần nhất.

## 3. Ba khóa học đã triển khai (48 bài)

| Slug / ID | Tiêu đề chính xác | Chương | Bài |
|---|---|---:|---:|
| `postgres-for-java` | Database & PostgreSQL cho Java Backend | 4 | 20 |
| `redis-for-java` | Redis từ cơ bản đến thực chiến với Java Spring Boot | 4 | 10 |
| `english-job-interview` | Tiếng Anh Phỏng Vấn Xin Việc – Hỏi & Đáp Song Ngữ | 8 | 18 |

- Registry: `web/src/lib/courses/index.ts`, hàm `getAllCourses()`, `getCourseBySlug()`, `getCourseLesson()`.
- Dữ liệu khóa học: `data/courses/<slug>/course.json` và bản web `web/src/data/courses/<slug>/course.json`. **Phải đồng bộ hai bản**.
- Các bài thường nằm trong `lessons[]` của manifest, nội dung Markdown ở trường `contentMarkdown`; giữ ổn định `course.id`, `lesson.id`, `slug` để không mất tiến độ.
- **Khóa tiếng Anh:** 155 tệp Markdown từng câu trong `data/courses/english-job-interview/questions/`, 18 tệp Markdown bài học trong `lessons/`, có `question-index.json`, `QA-REPORT.md`, script dựng lại manifest; dùng Markdown làm nguồn lưu trữ chuẩn.
- Nguồn tiếng Anh: PDF 99 trang; 155 mục (128 phần I, 27 phần II), 348 mẫu trả lời Anh–Việt, 172 biến thể câu hỏi. Hai mục số 52 giữ ID `interview-en-i-052a` và `interview-en-i-052b`; câu 117 không có mẫu trả lời trong nguồn. Có ghi nhận chuẩn hóa lỗi font, chi tiết xem QA report.
- **Lưu ý pháp lý/chất lượng:** quyền tái xuất bản toàn văn PDF chưa được chứng minh bằng giấy phép trong repo; nếu thay đổi/phát hành lại nội dung, cần kiểm tra quyền sử dụng. Không tự tuyên bố đã rà soát thủ công từng bản dịch; QA tự động không thay thế kiểm duyệt nội dung.

## 4. Phân biệt ba loại dữ liệu — cực kỳ quan trọng

| Loại dữ liệu | Nơi lưu / cơ chế |
|---|---|
| **Câu hỏi chuẩn đã xuất bản** | GitHub `data/interview-questions.json` và mirror `web/src/data/interview-questions.json` |
| **Bản nháp câu hỏi** | `localStorage` của trình duyệt, key `interview_drafts_v1`; session draft chưa lưu là lớp riêng; cache công bố `interview_published_cache_v1` |
| **Trạng thái Nắm vững / Cần ôn / Đã lưu** | Browser `interview-prep-progress-v1`; có cơ chế đồng bộ Cloudflare D1 qua `/api/interview-progress` (binding `INTERVIEW_DB`) |
| **Tiến độ hoàn thành bài trong khóa học** | Hiện `localStorage` key `quantavault-course-progress:v1`, tách theo `course.id`; **chưa đồng bộ D1 như câu hỏi phỏng vấn** |

**Không xóa, reset hay migration dữ liệu học tập nếu chưa có kế hoạch bảo toàn và sự cho phép.** Không coi việc “đã push GitHub” là “đã deploy”; chỉ xác nhận hoàn tất sau GitHub Actions và Cloudflare production.

## 5. Những lỗi đã gặp và cách phòng ngừa

- **Mermaid bị lỗi CI:** chuỗi code fence có thuộc tính phụ `id="..."` làm parser đọc nhầm. Chỉ dùng code fence chuẩn `\`\`\`mermaid` (không thêm metadata), và test Mermaid nghiêm ngặt trước xuất bản.
- **`Ctrl+B`/`Ctrl+I` chỉ wrap không toggle:** đã sửa trên PR #12; lần sau sửa editor phải kiểm thử selection, caret, Markdown lồng, focus, scroll và bản nháp.
- **Khóa Redis đã merge nhưng Sidebar chỉ hiện PostgreSQL:** Sidebar từng hardcode; PR #13 chuyển danh sách sang metadata động và cập nhật catalog; khi thêm khóa phải test Sidebar/catalog và direct static URLs.
- **Đăng ký khóa học mới cần cập nhật registry:** không đủ nếu chỉ tạo `course.json`. Cần dữ liệu canonical + web mirror, registry, Unit Test, Playwright E2E và static export.
- **Test cũ mặc định chỉ có 2 khóa:** khi thêm tiếng Anh PR #14, đã sửa để test có thể thích ứng với 3 khóa; tránh hardcode số lượng trong test.
- **GitHub code-scanning AI** từng lỗi vì hạn mức tháng; phân biệt lỗi dịch vụ kiểm tra bên ngoài với lỗi code và vẫn kiểm tra đủ CI chính.

## 6. Vị trí mã nguồn để bắt đầu chỉnh sửa

- `web/src/components/layout/AppSidebar.tsx` — Sidebar và danh sách khóa động.
- `web/src/features/courses/CourseCatalogView.tsx` — giao diện danh mục/tiến độ khóa.
- `web/src/features/courses/CourseLessonView.tsx` — giao diện đọc bài.
- `web/src/lib/courses/index.ts`, `types.ts`, `useCourseProgress.ts` — registry, kiểu dữ liệu, tiến độ.
- `web/src/features/interview/InterviewEditModal.tsx`, `MarkdownEditorToolbar.tsx`, `markdownFormatting.ts` — editor.
- `web/src/lib/interview/draftStore.ts`, `githubPublish.ts`, `cloudSync.ts`, `progress.ts` — an toàn bản nháp, xuất bản, đồng bộ.
- `web/functions/api/interview-progress.ts`, `publish.ts` — Pages Functions.
- `.github/workflows/web-ci.yml`, `java-docker.yml` — CI/CD.
- `docs/deployment-security.md`, `README.md` — chính sách triển khai và hướng dẫn dev.

## 7. Quy trình sửa code bắt buộc

1. Đọc yêu cầu mới, **fetch lại GitHub `main` mới nhất** và trạng thái Cloudflare Production; không mặc định snapshot trên còn mới.
2. Đọc code/test của đúng chức năng. Đề xuất tác động tới dữ liệu bản nháp, tiến độ và các khóa hiện có.
3. Sửa trên **nhánh riêng**, PR; không force-push `main`, không commit secrets `.env`, PIN, TOTP, PAT hoặc dữ liệu riêng.
4. Kiểm thử từ `web/`: `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run build:pages`, `npm run test:pages-build`, `npm run test:pages`, `npx playwright test`. Từ root: `python tools/validate_content.py`, `python -m unittest discover -s tests -p 'test_*.py'`. Chỉ chạy test thực tế được phép, báo rõ pass/skip/fail.
5. Riêng tính năng Java runner, kiểm tra thêm workflow/test Docker isolation. Riêng khóa học, kiểm tra metadata, 1/2/n khóa, Markdown/Mermaid và tất cả URL bài mới.
6. **Không tự ý merge/deploy production nếu chưa được người dùng cho phép đối với nhiệm vụ mới**. Nếu được duyệt: merge, theo dõi Web CI/Java Docker, xác minh Cloudflare deploy ID và trạng thái `success`.
7. Báo cáo rõ 4 trạng thái: **đã sửa trên branch → đã commit/push → đã merge main → đã deploy production**.

## 8. Nguyên tắc biên soạn nội dung học tập

- Trả lời **tiếng Việt**, chính xác, ưu tiên Java Backend Fresher/Junior; không dài dòng hoặc lặp ý vô ích.
- Phần phỏng vấn thường có **Tóm tắt** đủ trả lời trực tiếp, **Chi tiết** cho nhà tuyển dụng hỏi sâu.
- Với câu **tổng quan kiến trúc dự án CoVie**, *không* xóa mất nội dung then chốt (tech stack, module, Checkout, ACID/locking, Redis, MinIO, PostGIS, Outbox); có thể phân lớp câu trả lời miệng và tài liệu đào sâu.
- Nếu chủ đề quá lớn (ví dụ Redis với 40 mục), chuyển thành khóa học riêng, giữ câu phỏng vấn giới thiệu ngắn.
- Markdown phải copy được trực tiếp; dùng code fence chuẩn `\`\`\`java`, `\`\`\`mermaid`, `\`\`\`sql`, không thêm `id=` vào fence; ví dụ có đủ giải thích.
- Không tự sửa hoặc xuất bản nội dung khi chỉ được yêu cầu **review**.

## 9. Đoạn mở đầu để dán vào chat mới

> Tôi tiếp tục phát triển **QuantaVault**. Đọc file `docs/handoffs/QUANTAVAULT_HANDOFF_2026-11-09.md` trên nhánh `docs/quantavault-handoff-2026-11-09` (hoặc văn bản tôi đính kèm) để lấy ngữ cảnh. Sau đó **kiểm tra GitHub main và Cloudflare Production mới nhất** trước khi kết luận. Hãy giữ nguyên câu hỏi phỏng vấn, bản nháp trình duyệt, tiến độ D1, tiến độ khóa học và các khóa đang có. Khi tôi yêu cầu sửa code, hãy triển khai trên nhánh riêng, kiểm thử, báo cáo PR; **chỉ đưa lên production khi tôi cho phép**. Trả lời bằng tiếng Việt và ưu tiên Java Backend. Tôi sẽ gửi yêu cầu chỉnh sửa tiếp theo.

---

**Mục tiêu của file này:** bàn giao ngữ cảnh và quyết định kỹ thuật đã xác minh, không phải yêu cầu tự động sửa hoặc triển khai website.
