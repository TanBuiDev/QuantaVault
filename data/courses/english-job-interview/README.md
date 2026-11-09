# Tiếng Anh Phỏng Vấn Xin Việc – Hỏi & Đáp Song Ngữ

Bộ dữ liệu chuyển đổi từ tài liệu PDF do người học cung cấp để lưu trữ và biên tập nội bộ trên QuantaVault.

- **Nguồn:** `500 hỏi phỏng vấn tiếng Anh thông dụng nhất - kèm câu trả lời.pdf` (99 trang PDF).
- **Quy mô:** 155 mục hỏi–đáp; phần I có 128 mục (đánh số 1–127, lặp số 52), phần II có 27 mục (đánh số 1–27).
- **Tổ chức:** 8 chương, 18 bài học, 155 tệp `.md` câu hỏi.
- **Không tự bổ sung nội dung thiếu:** phần II chỉ có câu hỏi; phần I câu 117 không có ví dụ trả lời.

## Thư mục

- `questions/part-01/q-xxx.md`: 128 mục dành cho ứng viên (hai số 52 dùng `q-052a.md` và `q-052b.md`).
- `questions/part-02/q-xxx.md`: 27 mục hỏi nhà tuyển dụng.
- `lessons/lesson-01.md` đến `lesson-18.md`: 18 bài được tổng hợp **tự động** từ Markdown từng câu, không sửa thủ công.
- `course.json`: dữ liệu tương thích kiểu CourseManifest hiện tại của QuantaVault; **đã đăng ký vào danh mục website**.
- `question-index.json`: mục lục và đường dẫn nguồn.
- `source-pages/`: được lưu trong bản ZIP kiểm duyệt bên ngoài repository (không triển khai raw PDF text lên site).
- `qa-report.json`, `QA-REPORT.md`: báo cáo kiểm tra trích xuất.
- `tools/rebuild_course.py`: tái tạo 18 file bài học và `course.json` từ 155 file Markdown gốc (`--check` hoặc `--write`).

## Quy tắc biên tập

1. Giữ nguyên ý và thứ tự câu hỏi tiếng Anh, bản dịch tiếng Việt, các biến thể và mọi mẫu trả lời.
2. Bảo toàn `sourcePart`, `sourceQuestionNumber`, `sourcePdfPages` trong YAML frontmatter.
3. Chuẩn hóa lỗi ký tự do font PDF không đúng Unicode; không tự thêm ví dụ vào tài liệu gốc.
4. Nếu muốn thêm phiên bản trả lời chuyên sâu cho **Java Backend**, tạo file mở rộng riêng, không sửa trực tiếp phần tư liệu.
5. Chỉ đăng công khai sau khi xác nhận quyền sử dụng/tái bản toàn văn PDF.

## Quy trình cập nhật QuantaVault

`questions/*.md` → `python tools/rebuild_course.py --write` → `course.json` → `python tools/rebuild_course.py --check` → kiểm tra CI → đăng ký course → deploy sau khi được phép.

**Tích hợp khóa học này không sửa dữ liệu tiến độ học tập, D1 hay ngân hàng câu hỏi hiện có.**
