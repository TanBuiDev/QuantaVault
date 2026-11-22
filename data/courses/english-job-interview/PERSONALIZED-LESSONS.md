# Nội dung phỏng vấn cá nhân hóa – Bài 01–06

Các tệp `web/src/data/courses/english-job-interview/personalized/lesson-01.json` đến `lesson-06.json` là phiên bản trả lời song ngữ do người học chọn lọc và duyệt trong cuộc trò chuyện. Chúng là nội dung **hiển thị** cho 6 bài đầu, không thay đổi nguồn PDF gốc.

- Số câu được duyệt: **7, 6, 2, 2, 3, 4** (24 câu hỏi, mỗi câu một mẫu trả lời Anh–Việt).
- Mỗi câu được đánh số theo thứ tự hiển thị tại giao diện; ID `personal-lesson-xx-yy` tránh đụng ID nguồn.
- Mỗi trường `en` / `vi` lưu các đoạn tương ứng theo thứ tự, cách nhau bởi một dòng trống.
- `web/src/lib/courses/englishPractice.ts` thay thế 6 bài đầu khi hiển thị và luyện tập, giữ nguyên nguồn từ Bài 07–18.
- `web/src/lib/courses/index.ts` đồng bộ tiêu đề, mô tả và nội dung Markdown hiển thị.
- `web/src/features/courses/EnglishLessonContent.tsx` hiển thị từng cặp đoạn Anh–Việt, vẫn hỗ trợ nghe, sao chép, ẩn bản dịch, chỉ tiếng Anh.
- Không sửa `questions/**`, `lessons/**`, `course.json`, `practice.json` do công cụ `rebuild_course.py` tạo, hoặc dữ liệu D1 / tiến độ học.

Vì bản tư liệu PDF được giữ nguyên, `python data/courses/english-job-interview/tools/rebuild_course.py --check` phải tiếp tục thành công. Bài kiểm thử về dữ liệu hiển thị kiểm tra 134 câu hỏi (24 mới và 110 từ Bài 07–18), trong khi ngân hàng gốc vẫn giữ 155 câu / 348 mẫu trả lời.
