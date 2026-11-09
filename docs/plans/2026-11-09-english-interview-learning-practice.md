# Kế hoạch triển khai — Nâng cấp khóa Tiếng Anh Phỏng Vấn (09/11/2026)

## 1. Mục tiêu và phạm vi
- Khóa được sửa: `english-job-interview` (18 bài, 8 chương, 155 câu hỏi; giữ nguyên ID, slug và thứ tự).
- Trang đọc bài là chế độ **Học**; tạo trang **Luyện tập** riêng tại `/courses/english-job-interview/practice`.
- Không làm thay đổi nội dung PostgreSQL, Redis, dữ liệu phỏng vấn, D1, session bản nháp hay tiến độ khóa học `quantavault-course-progress:v1`.
- Chỉ sửa trên branch `feat/english-interview-study-practice-20261109`, mở PR. **Không merge/main/production khi chưa được cho phép riêng.**

## 2. Yêu cầu được duyệt

| # | Yêu cầu | Tiêu chí nghiệm thu |
|---|---|---|
| 1 | Bỏ “Tóm tắt bài học” ở khóa tiếng Anh | Không hiện summary box; PostgreSQL/Redis giữ nguyên |
| 2 | Không dùng emoji UI; icon chuyên nghiệp, thống nhất | Dùng `lucide-react`; lập `CourseIcon` dùng chung ở sidebar, catalog, syllabus và header, không hardcode fallback Database |
| 3 | Tiêu đề song ngữ | Mỗi bài hiển thị EN chính / VI phụ; metadata title EN dùng cho tìm kiếm, mục lục, điều hướng và SEO; không đổi id/slug |
| 4 | Bỏ văn bản nói về nhập/chuyển từ PDF | Không còn trong nội dung học, summary, author hay phần mô tả khóa học hiển thị |
| 5 | Bỏ dòng “Nguồn: PDF ...” khỏi bài học | Không xuất hiện trên web; nguồn và đối chiếu gốc trong YAML/QA nội bộ được giữ lại |
| 6 | Luyện nhớ hai chiều bằng chế độ riêng | Chọn bài, chọn loại bài tập câu hỏi/mẫu trả lời; chọn VI→EN hoặc EN→VI, nhập bản dịch, tự mở đáp án, tự đánh giá “Đã nhớ/Cần ôn”, chuyển bài; câu không có mẫu không hiển thị bài tập mẫu |
| 7 | Sửa vấn đề phát hiện khi review | Không lặp H1 trong trang đọc; lời chúc hoàn thành chỉ khi tiến độ thực đạt 100%; thống nhất biểu tượng khóa học, tránh bản dịch gây hiểu nhầm |

## 3. Quy tắc dữ liệu và kiến trúc
1. **Nguồn chuẩn:** `data/courses/english-job-interview/questions/**/*.md`, `question-index.json`, `course.json`. Không sửa ý nghĩa 155 câu hỏi/348 mẫu trả lời trong đợt UI; giữ metadata truy xuất nguồn trong YAML.
2. **Bản sinh:** script `tools/rebuild_course.py` chịu trách nhiệm tái tạo `lessons/*.md`, canonical `course.json`, web mirror `course.json` và dữ liệu luyện tập dạng có cấu trúc `practice.json`. Nội dung public không chứa ghi chú nguồn PDF.
3. **Tính ổn định:** dùng `question.id` từ YAML/frontmatter, `lesson.id` cố định; bài mẫu có ID `question.id + ':answer:' + number`. Không đụng `interview_drafts_v1`, `interview-prep-progress-v1` hay D1.
4. **Tiến độ luyện:** lưu riêng dưới khóa `quantavault-english-practice:v1` trên localStorage; chỉ chứa kết quả tự đánh giá và hướng dịch, không lưu bản dịch gõ vào; dữ liệu hiện hữu không bị reset.
5. **Tái sử dụng UI:** tạo `CourseIcon`; tạo bộ component luyện tập riêng `EnglishPracticeView` và helper `englishPractice`; giữ component nền tảng `MarkdownContent` nguyên tính năng cho các khóa còn lại.
6. **UX/A11y:** điều khiển có nhãn, bàn phím, thông báo tiến độ, khu vực nhập rõ ràng; hỗ trợ màn hình nhỏ, trạng thái không có đáp án; trạng thái tự đánh giá không phải chấm bằng so khớp ký tự.
7. **Thông tin nguồn và quyền sử dụng:** nguồn để kiểm duyệt nội bộ vẫn được bảo toàn; việc bỏ dòng PDF khỏi giao diện không chứng minh quyền tái bản, cần kiểm tra độc lập.

## 4. Thiết kế Luyện tập
- Header có liên kết quay lại bài học và bộ đếm câu; chọn bài cụ thể hoặc toàn bộ khóa.
- Chọn **Câu hỏi** hoặc **Mẫu trả lời**; một câu hỏi có thể có nhiều mẫu (sẽ luyện từng mẫu).
- Hai hướng: **Việt → Anh** (ẩn bản tiếng Anh); **Anh → Việt** (ẩn bản tiếng Việt).
- Một thẻ/1 lượt: văn bản gợi ý → ô nhập → nút hiện/ẩn bản dịch mẫu → tự đánh giá Đã nhớ/Cần ôn → chuyển thẻ.
- Mặc định chưa lộ đáp án; thay đổi bài/hướng/loại reset textarea, không lưu câu trả lời nháp.
- Chế độ câu hỏi vẫn hoạt động cho phần II và câu 117 không có ví dụ; chế độ mẫu trả lời chỉ lấy dữ liệu thực có.

## 5. Kiểm thử và tiêu chí chặn merge
- Python: chạy `python tools/rebuild_course.py --check`, `python tools/validate_content.py`, `python -m unittest discover -s tests -p 'test_*.py'`.
- Web: `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run build:pages`, `npm run test:pages-build`, `npm run test:pages`, `npx playwright test`.
- Test 155 câu hỏi, 18 bài, 348 bản trả lời, 2 ID số 52, câu 117 và 27 câu không đáp án; mirror canonical và web bằng nhau; không lộ PDF/footer; khóa PostgreSQL/Redis regression.
- Test luyện: hai chiều hiển thị chính xác; đáp án ẩn trước khi yêu cầu; đi bài tiếp không giữ văn bản nhập; tự đánh giá tách khỏi tiến độ hoàn thành; localStorage lỗi không làm crash.
- Đánh giá GitHub Actions PR, kiểm tra diff và trạng thái trước khi yêu cầu merge.

## 6. Quy trình giao nhận
1. Tạo nhánh riêng và commit kế hoạch này.
2. Sửa code + nguồn được sinh, chạy CI trên PR.
3. Gửi PR để review; phân biệt đã commit, push, merge và deployment.
4. **Dừng trước merge/deploy** cho đến khi được người dùng chấp thuận rõ ràng.

## 7. Ngoài phạm vi
- Chấm đúng/sai bằng AI/LLM; nhận diện giọng nói; xáo trộn ngẫu nhiên toàn khóa; đồng bộ luyện tập lên D1; biên tập lại 348 mẫu dịch.
- Sửa bản dịch chất lượng thấp là một đợt kiểm duyệt nội dung riêng, phải được duyệt trước.
