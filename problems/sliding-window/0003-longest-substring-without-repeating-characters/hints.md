# 3. Longest Substring Without Repeating Characters — Hints / Gợi ý

## Hint 1

Duy trì một window `[left, right]` luôn chứa các ký tự **không lặp**.

## Hint 2

Khi đọc `s[right]`, nếu ký tự này đã xuất hiện tại index `previous` **bên trong current window**, `left` phải nhảy tới `previous + 1`.

## Hint 3

Không được kéo `left` lùi lại. Công thức an toàn:

```text
left = max(left, previous + 1)
```

## Hint 4

Lưu index xuất hiện gần nhất của mỗi ký tự bằng hash map. Sau khi điều chỉnh `left`, cập nhật:

```text
best = max(best, right - left + 1)
```
