# 64. Minimum Path Sum — Hints / Gợi ý

## Hint 1

**EN:** For each cell, consider the minimum cost to reach it rather than enumerating complete paths.

**VI:** Với mỗi ô, hãy lưu chi phí nhỏ nhất để đi đến ô đó thay vì liệt kê mọi đường.

## Hint 2

**EN:** Since movement is only down or right, a cell can only be reached from above or from the left.

**VI:** Một ô chỉ có thể đến từ top hoặc left.

## Hint 3

```text
dp[j] = grid[i][j] + min(top, left)
```

Dùng một hàng DP; xử lý biên đầu tiên cẩn thận vì hàng/cột đầu chỉ có một predecessor.
