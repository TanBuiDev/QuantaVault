# 120. Triangle — Hints / Gợi ý

## Hint 1

**EN:** Try solving from the bottom row upward instead of from the top downward.

**VI:** Hãy thử tính từ hàng đáy đi lên thay vì từ đỉnh đi xuống.

## Hint 2

**EN:** From position `j` in a row, the next step can only go to positions `j` or `j + 1` below.

**VI:** Từ vị trí `j`, hai child hợp lệ ở hàng dưới là `j` và `j+1`.

## Hint 3

```text
dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
```

Khởi tạo `dp` bằng hàng cuối, rồi overwrite dần lên trên. Đây là `O(n)` extra space.
