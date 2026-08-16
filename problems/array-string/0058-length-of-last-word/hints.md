# 58. Length of Last Word — Hints / Gợi ý

## Hint 1

Ta chỉ quan tâm từ **cuối cùng**, nên không cần tách toàn bộ chuỗi thành các từ.

## Hint 2

Bắt đầu từ cuối chuỗi. Trước tiên bỏ qua mọi trailing spaces.

## Hint 3

Sau khi gặp ký tự đầu tiên không phải space, đếm liên tục cho tới khi gặp space hoặc đi hết chuỗi.

```text
skip trailing spaces
count non-space characters
stop at the next space
```
