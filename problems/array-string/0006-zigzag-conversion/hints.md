# 6. Zigzag Conversion — Hints / Gợi ý

## Hint 1

Không cần tạo ma trận chứa các khoảng trống. Output cuối chỉ cần biết ký tự nào thuộc **row nào**.

## Hint 2

Mô phỏng con trỏ row:

```text
0 -> 1 -> 2 -> ... -> numRows-1
                      |
0 <- 1 <- 2 <- ... <-
```

## Hint 3

Tạo một `StringBuilder` cho mỗi row và append character hiện tại vào row đang đứng.

## Hint 4

Khi chạm row `0`, hướng phải đi xuống. Khi chạm row `numRows - 1`, hướng phải đi lên.

Nếu `numRows == 1` hoặc `numRows >= s.length()`, kết quả chính là `s`.
