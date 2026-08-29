# Solution / Lời giải — 64. Minimum Path Sum

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Minimum Path Sum: để tới cell (r,c), bước trước chỉ có thể từ trên hoặc trái. Vì costs cộng dồn, đường rẻ nhất tới current = grid[r][c] + min(bestTop,bestLeft).

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS enumerate paths exponential; memo/DP lưu best cost mỗi cell. Vì current row chỉ cần dp[c] từ row trên và dp[c-1] vừa update từ trái, một array O(n) đủ.

**State / invariant / data structure cần hiểu trước code.** dp[c] trước update là min cost tới cell trên; dp[c-1] là min cost tới cell trái trong row hiện tại. Invariant sau update dp[c] là min cost tới current; first row/column chỉ có một predecessor.

**Dry run mental theo implementation.** Grid [[1,3,1],[1,5,1],[4,2,1]]: row0 cumulative [1,4,5]; row1 [2,7,6]; row2 [6,8,7], trả7 theo path 1-3-1-1-1.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng max hoặc mishandle boundary với nonexistent predecessor. Khi nào dùng: acyclic grid shortest path với fixed incoming directions thường là straightforward DP topological order.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

The cheapest path to a cell must come from either above or left. Compress the previous/current DP rows into one array and add the current cell cost to the cheaper predecessor.

## 2. Optimal Java solution

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dp = new int[cols];

        dp[0] = grid[0][0];

        // First row has only one predecessor direction: from the left.
        for (int j = 1; j < cols; j++) {
            dp[j] = dp[j - 1] + grid[0][j];
        }

        for (int i = 1; i < rows; i++) {
            // First column likewise can only be reached from above.
            dp[0] += grid[i][0];

            for (int j = 1; j < cols; j++) {
                // Before overwrite dp[j] is the minimum path to the cell above;
                // dp[j-1] is the minimum path to the left cell in the current row.
                dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
            }
        }

        return dp[cols - 1];
    }
}
```

## 3. Correctness

Every legal path into an interior cell has exactly one of two final moves: down from above or right from the left. Taking the cheaper optimal predecessor and adding the cell cost therefore gives the optimal path to that cell.

## 4. Complexity

`O(rows*cols)` time, `O(cols)` space.
