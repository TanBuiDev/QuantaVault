# Báo cáo Tổng kết Tái cấu trúc Ngân hàng Câu hỏi Phỏng vấn (Wave 1 + Wave 2)

- **Ngày hoàn thành:** 2026-11-26 (UTC+7)
- **Baseline:** `f0078898988f0fb2bb8c42ef99e75569a4b9757b` (`504` câu hỏi)
- **Phiên bản cuối:** `508` câu hỏi canonical (`504 + 5 added - 1 retired = 508`), 100% baseline ID có disposition truy vết trong `question-audit.json`.

## 1. Thống kê Before / After

- **Tổng số câu:** `504` → `508`
  - **Thêm mới (5):** `q-540` (Access Modifiers), `q-541` (Arrays & Overflow), `q-542` (`this` & `super`), `q-543` (Giới thiệu bản thân Fresher), `q-544` (Xử lý bug khó & teamwork)
  - **Gộp / Retire (1):** `q-068` → `q-067` (lưu snapshot trong `dedup-and-id-map.json`, đăng ký trong `retiredInterviewIds.json`)
- **Phân bố Priority:** `P1` = 193 | `P2` = 226 | `P3` = 89
- **Phân bố Difficulty:** `Fresher` = 33 | `Junior` = 40 | `Middle` = 318 | `Senior` = 117
- **Phân bố 19 Categories:** `java-core` (24), `oop` (22), `modern-java` (8), `exceptions` (7), `collections` (21), `streams` (18), `jvm` (11), `concurrency` (21), `design-patterns` (7), `live-coding` (13), `spring` (40), `security-auth` (64), `database` (71), `microservices` (35), `testing` (19), `testing-devops` (19), `troubleshooting` (16), `project-covie` (89), `career-interview` (3).

## 2. Nâng cấp Trải nghiệm Học (UX)
- Bộ lọc **Chủ đề con (`topic`)**, **Độ ưu tiên (`P1/P2/P3`)**, và **Cấp độ `Fresher`** độc lập, đồng bộ URL & `sessionStorage`.
- Chế độ **Lộ trình học (`?view=path`)** hiển thị tiến độ P1 theo từng bước từ Java Fundamentals → OOP → String/Object → Backend & CoVie.
- Hỗ trợ chỉnh sửa và publish đầy đủ metadata mới qua `InterviewEditModal` và `PublishDrawer`.

## 3. Đường dẫn Review
- Website Production: `https://quantavault.pages.dev/interview/`
- Lộ trình P1 Java Core: `https://quantavault.pages.dev/interview/?category=java-core&priority=p1`
- Chế độ Lộ trình học: `https://quantavault.pages.dev/interview/?view=path`
