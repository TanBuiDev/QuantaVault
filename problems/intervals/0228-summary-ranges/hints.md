# 228. Summary Ranges — Hints / Gợi ý

## Hint 1

Mảng đã sorted và unique, nên mỗi range chính là một run các số liên tiếp.

## Hint 2

Giữ `start` và `end` của current run. Nếu số kế tiếp bằng `end + 1`, mở rộng range.

## Hint 3

Khi gặp gap, format current range rồi bắt đầu run mới.

## Hint 4

Cẩn thận overflow khi `end == Integer.MAX_VALUE`; so sánh bằng `long` thay vì tính `int end + 1`.
