# Rà soát và xử lý năm vấn đề — 01/11/2026

## Kết quả triển khai

| Vấn đề | Nguyên nhân xác nhận trong mã | Giải pháp |
| --- | --- | --- |
| Xác thực publish | PIN/TOTP mặc định trong source, chấp nhận một trong hai yếu tố, hai endpoint khác nghiệp vụ | Bỏ giá trị mặc định; bắt buộc PIN và OTP độc lập; dùng chung handler, giới hạn body, schema và origin |
| An toàn dữ liệu publish | Đọc nhánh đang thay đổi; đọc/parse lỗi vẫn tiếp tục với mảng rỗng | Đọc tại commit SHA cố định; dừng khi lỗi; kiểm tra phiên bản từng câu hỏi; ghi hai JSON trong một tree/commit, không force-update |
| Website thiếu bài chi tiết | Script lấy một số HTML từ output nội bộ, không xuất trang động và media | Static export chính thức trong staging riêng; xuất đủ 150 bài, payload điều hướng, JSON điều hướng và ảnh theo scope |
| Nội dung cũ xuất hiện lại | Modal sau reload lấy canonical thay vì bản hợp nhất; cache vừa publish tự hết hạn sau 15 phút | Mở từ nội dung hiệu lực sau hydration; nháp tạm chỉ phục hồi khi chọn; cache giữ đến khi canonical khớp; báo xung đột |
| Phạm vi offline/tài liệu | Mermaid tải CDN, tài liệu chứa số liệu và mô tả rộng hơn triển khai | Bundle Mermaid có phiên bản khóa, strict mode và sanitize SVG; cập nhật README và hướng dẫn bảo mật |

Các nguyên nhân trên đã có kiểm thử hồi quy. Không khẳng định chúng là toàn bộ nguyên nhân của sự cố lịch sử nếu chưa có dữ liệu trình duyệt từ lần sự cố đó.

## Các hành vi bảo toàn dữ liệu

- Lưu modal thành công mới xóa nháp tạm; lỗi quota giữ form và báo Toast.
- Nháp chưa lưu tự ghi sau 400ms và khi rời trang; reload hiển thị nội dung đã lưu trước, chờ chọn khôi phục hoặc bỏ nháp.
- Nháp cũ/khác phiên bản và thao tác thay nội dung lưu ở tab khác yêu cầu xác nhận.
- Cache sau publish không tự bị xóa theo thời gian; commit GitHub không bị đồng nhất với deploy thành công.
- Publish chỉ chuyển đúng snapshot đã gửi vào cache; chỉnh sửa tiếp trong lúc request chạy được giữ.
- Lỗi `409` có nội dung remote để đối chiếu; chỉ xác nhận mới cập nhật baseline. Nội dung chỉnh sửa được giữ, không tự retry/publish. Nếu nháp đã đổi trong lúc đối chiếu thì từ chối cập nhật baseline.
- API publish không tự ghi dữ liệu repository cục bộ.

## Phạm vi website

Website giữ phần đọc đề, gợi ý, lời giải, phỏng vấn, ảnh, tiến độ và code cá nhân. Run/Submit được vô hiệu hóa và có giải thích. Các thao tác sửa thuật toán cần filesystem chỉ có ở workspace cục bộ. Chấm Java cloud, PWA và dịch vụ trả phí chưa được bổ sung.

Worker chỉ phục vụ API publish; trang và ảnh tĩnh không cần runtime Next.js. Staging dùng whitelist nguồn và môi trường, không lấy `.env`, bản build cũ hoặc instrumentation Docker. Tài nguyên ảnh đề/lời giải được phân biệt scope, không ghi đè ảnh trùng tên.

## Kiểm chứng

- Vitest: **257 đạt, 16 bỏ qua**; bao gồm publish, lưu/khôi phục, xung đột, phân quyền chức năng static và Mermaid.
- ESLint, build Next.js cục bộ, build Pages: đạt.
- Cài dependency sạch từ lockfile trong sandbox riêng (`npm ci --ignore-scripts --no-audit --no-fund`): đạt; chạy lại lint, 257 test và hai chế độ build với Next.js 16.4.3/Vitest 4.1.12 đều đạt.
- Playwright workspace cục bộ: **4 luồng đạt**, ghi nội dung trên bản sao fixture.
- Playwright Pages trên Wrangler/workerd cục bộ: **3 luồng đạt**, gồm truy cập 150 HTML/payload, reload, Next Link, Back/Forward, ảnh, theme và khôi phục phỏng vấn.
- Kiểm thử staging/media bằng Node: **2 đạt**.
- Kiểm tra nội dung: **150 bài hợp lệ**. Python unittest: **16 đạt**.
- Hai bản JSON phỏng vấn vẫn giống nhau, có **531 câu hỏi**.
- Quét artifact: đạt; đủ 150 trang, không có tệp nguồn/môi trường/tạm bị cấm hoặc Node builtin import trong Worker; staging đã dọn.
- Mermaid thật trên trình duyệt: hai sơ đồ hiện có render SVG, không có request tải Mermaid từ CDN.
- Audit dependency production: **không phát hiện lỗ hổng** tại thời điểm kiểm tra.

Thư mục dependency ban đầu không khớp lockfile (Next.js 16.3.1 thay vì 16.4.3). Đã cài sạch trong sandbox để kiểm chứng và đồng bộ dependency đã khóa vào workspace bằng copy không xóa. Luồng CRUD tham khảo đạt toàn bộ suite trên bản cài sạch và ba lượt kiểm tra nối tiếp bổ sung. CI dùng `npm ci` nghiêm ngặt, không fallback sang `npm install` làm thay đổi dependency ngoài lockfile.

## Giới hạn và triển khai

16 test bỏ qua là tích hợp Docker thật. Docker engine chưa khả dụng trên máy kiểm tra; chưa xác nhận thực thi Java thật trong đợt này. Các test runner đơn vị và luồng workspace khác vẫn đạt.

Trước khi bật publish trên môi trường triển khai, cần cấu hình thông tin xác thực mới và exact allowed origins theo [deployment-security.md](deployment-security.md). Những giá trị mặc định từng xuất hiện trong source phải được coi là đã lộ và thay thế. Rate limiter bộ nhớ chỉ là bảo vệ best-effort; website chưa được cam kết hoàn toàn offline.

Không commit, push, thay secret production hoặc deploy trong lần triển khai này. Thông điệp commit đề xuất khi được phê duyệt: `fix: secure publishing, preserve drafts and export static study pages`.
