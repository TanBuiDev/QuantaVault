# Hints / Gợi ý

## Hint 1
**EN:** Build the string one character at a time instead of generating every length-`2n` string.

**VI:** Hãy xây chuỗi từng ký tự thay vì sinh mọi chuỗi độ dài `2n`.

## Hint 2
**EN:** Track how many opening and closing parentheses have been used. A prefix is invalid if closing parentheses ever exceed opening parentheses.

**VI:** Theo dõi số dấu mở và dấu đóng đã dùng. Một prefix không hợp lệ nếu số dấu đóng vượt số dấu mở.

## Hint 3
**EN:** Add `(` while `open < n`; add `)` only while `close < open`. When the length reaches `2n`, record the string.

**VI:** Thêm `(` khi `open < n`; chỉ thêm `)` khi `close < open`. Khi độ dài đạt `2n`, ghi nhận kết quả.
