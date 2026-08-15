# 30. Substring with Concatenation of All Words — Hints / Gợi ý

## Hint 1

Mọi word có cùng `wordLength`. Một valid window luôn gồm đúng `words.length` token, mỗi token dài `wordLength`.

## Hint 2

Các candidate start có thể thuộc `wordLength` alignment khác nhau. Hãy chạy một sliding window riêng cho từng offset:

```text
0, 1, ..., wordLength - 1
```

## Hint 3

Duy trì `need` là frequency của input words và `seen` là frequency trong current window. Nếu gặp token không nằm trong `need`, reset window.

## Hint 4

Nếu một token xuất hiện nhiều hơn số lần được phép, tăng `left` theo từng token cho tới khi frequency hợp lệ trở lại. Khi số token trong window bằng `words.length`, ghi `left` là answer.
