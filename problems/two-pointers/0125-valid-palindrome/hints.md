# 125. Valid Palindrome — Hints / Gợi ý

## Hint 1

Không cần tạo một chuỗi đã cleanup. Có thể so sánh trực tiếp từ hai đầu của original string.

## Hint 2

Dùng `left` và `right`. Nếu một bên không phải alphanumeric, di chuyển pointer đó vào trong mà chưa cần so sánh.

## Hint 3

Khi cả hai phía đều là alphanumeric, so sánh sau khi chuyển lowercase:

```text
lower(s[left]) == lower(s[right])
```

Nếu khác → `false`; nếu giống → di chuyển cả hai pointer.

## Hint 4

Khi `left >= right`, mọi cặp cần thiết đã match → `true`.
