# 63. Unique Paths II — Hints / Gợi ý

## Hint 1

**EN:** Without obstacles, the number of paths to a cell is the sum of the paths from the cell above and the cell to the left.

**VI:** Nếu không có obstacle, số đường đến một ô bằng tổng số đường từ ô trên và ô trái.

## Hint 2

**EN:** What should the number of paths become when the current cell is an obstacle?

**VI:** Khi gặp obstacle, số đường đến ô đó phải reset về `0`.

## Hint 3

Dùng một mảng `dp[n]`. Với ô trống:

```text
dp[j] = dp[j] + dp[j - 1]
```

Với obstacle:

```text
dp[j] = 0
```

Khởi tạo `dp[0] = 1` trước khi scan nếu ô bắt đầu không bị chặn.
