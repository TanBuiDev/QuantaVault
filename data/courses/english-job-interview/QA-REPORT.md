# Báo cáo kiểm tra chuyển đổi PDF → Markdown

- **PDF:** 99 trang.
- **155 mục hỏi–đáp** (128 thuộc phần I và 27 thuộc phần II).
- **8 chương, 18 bài học; 155 tệp câu hỏi Markdown**.
- **348 mẫu trả lời tiếng Anh** được ghép với bản dịch tiếng Việt.
- **172 biến thể câu hỏi tiếng Anh** (một số mục có nhiều cách hỏi).
- **Hai mục số 52:** giữ riêng `interview-en-i-052a` và `interview-en-i-052b`, không tự đánh lại số nguồn.
- **Câu 101:** dòng câu hỏi có màu xanh lá như câu trả lời trong PDF, đã phân loại theo vị trí trước nhãn “Các cách trả lời”.
- **Câu 117:** PDF gốc không có câu trả lời; giữ nguyên câu hỏi và ghi chú thiếu trong nguồn.
- **27 câu ở phần II:** chỉ có câu hỏi song ngữ, không tự soạn lời đáp.
- **Chuẩn hóa lỗi font:** chỉ sửa các mã ký tự bị lỗi có quy luật `{`, `kz`, ký hiệu ba chấm; không diễn giải lại ý nghĩa câu.
- **Đối chiếu:** `source-pages/page-NNN.txt` lưu bản trích xuất thô từng trang để kiểm tra từng từ.
- **Lưu ý biên tập:** nội dung và dịch nghĩa giữ gần nhất với nguồn; một số ví dụ trong sách có tính lịch sử hoặc không phù hợp mọi ngành nghề; việc cải biên cho Java Backend là công đoạn khác.
- **Bản quyền:** dữ liệu được tạo phục vụ lưu trữ/duyệt nội bộ; không mặc định cấp quyền phát hành công khai.

## Kiểm tra bất thường

- `interview-en-i-052a`: source_duplicate_number_52
- `interview-en-i-052b`: source_duplicate_number_52
- `interview-en-i-101`: question_color_in_pdf_is_answer_green
- `interview-en-i-117`: no_answer_in_source

## Thống kê lỗi font đã sửa

- `corrupt-glyph`: 113 chỗ
- `corrupt-kz`: 28 chỗ
- `font-ellipsis`: 6 chỗ
