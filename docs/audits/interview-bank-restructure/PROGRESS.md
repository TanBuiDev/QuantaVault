# Tiến độ Triển khai Tái cấu trúc Ngân hàng Câu hỏi Phỏng vấn

**Chiến lược:** Wave 1 (Schema/UI + Toàn diện Java Core & OOP → Production) → Wave 2 (Toàn bộ các danh mục còn lại → Production)

## Wave 1 — Java Core, OOP & Nền tảng Hệ thống
- [x] **M0-Git:** Làm sạch local/remote git (chỉ còn `main` = `f0078898`, working tree sạch, không còn file tạm)
- [x] **M0-Plan:** Khảo sát consumers, chạy baseline validators, tạo `BASELINE.md` và `PROGRESS.md`
- [x] **M1 (Wave 1):** Audit 100% các câu liên quan `java-core` và `oop` trên toàn bộ 504 câu; phân loại lại các câu sai phạm vi ra khỏi `java-core`; lập ma trận coverage P1/P2 cho Java Fundamentals, OOP, String/Object
- [x] **M2:** Thiết kế Taxonomy 19 categories, Topic Registry (`topics.ts`), mở rộng `InterviewDifficulty` (`fresher`), `InterviewPriority` (`p1|p2|p3`), `topicId`, `learningOrder`, tương thích URL/draft/cache/publish
- [x] **M3 (Wave 1):** Chuẩn hóa 46 câu Java Core & OOP (`java-core`: 24, `oop`: 22), bổ sung `q-540..q-542`, gộp `q-068` → `q-067`, kiểm chứng code Java chạy được (`Wave1Verify.java`), đồng bộ canonical & mirror JSON (506 câu)
- [x] **M5 (Wave 1):** Cập nhật UI filters (topic, priority, fresher), Learning Path mode, Edit/Presentation/Publish, validators (`validate_interview_bank.py`) & unit tests
- [x] **M6 (Wave 1):** Chạy full CI checks local (Python + Vitest 85/85 + Next build + Pages build + Playwright 32/32 + 7/7)
- [x] **M7 (Wave 1):** Push `main` (`29b14d5`), khởi chạy GitHub Actions CI & Cloudflare Production

## Wave 2 — Toàn bộ Các Danh mục Còn lại & Nghiệm thu Cuối
- [x] **M1/M3/M4 — Batch 2A (Java & Thực hành):** `exceptions` (7), `collections` (21), `streams` (18), `modern-java` (8), `jvm` (11), `concurrency` (21), `design-patterns` (7), `live-coding` (13, đã sửa code fence `q-529`)
- [x] **M1/M4 — Batch 2B (Backend & Hệ thống):** `database` (71), `spring` (40), `security-auth` (64), `microservices` (35), `testing` (19), `testing-devops` (19), `troubleshooting` (16), `career-interview` (3, bổ sung `q-543`, `q-544`)
- [x] **M1/M4 — Batch 2C (CoVie):** Audit 89 câu `project-covie` đối chiếu `E:\WebApp\CoVie` (32 modules Java xác minh)
- [x] **M5/M6 (Wave 2):** Siết strict schema validation 100% (`validate_interview_bank.py --strict-all`), hoàn thiện 8 artifacts audit, chạy full CI local
- [x] **M7 (Wave 2):** Push `main`, xác minh GitHub Actions & Cloudflare Production bản hoàn chỉnh
