# Solution / Lời giải — 63. Unique Paths II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Unique Paths II giống đếm đường trên grid nhưng obstacle làm số ways tại cell đó bằng0. Với cell trống, mọi path tới nó phải đến từ top hoặc left, nên ways = top + left.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS thử mọi đường exponential. DP nén các subproblems trùng: số ways tới một cell chỉ phụ thuộc hai neighbors trước đó; dùng 1D dp theo columns giảm space từ O(mn) xuống O(n).

**State / invariant / data structure cần hiểu trước code.** dp[c] trước update là ways từ row trên tới column c; sau dp[c]+=dp[c-1] nó thành ways tới current cell. Obstacle đặt dp[c]=0. Invariant sau xử lý row prefix, dp[c] đúng số paths tới cell đó.

**Dry run mental theo implementation.** Grid [[0,0,0],[0,1,0],[0,0,0]]: row0 dp [1,1,1]; row1 column1 obstacle reset0 nên row thành [1,0,1]; row2 thành [1,1,2], đáp án2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là không reset obstacle về0 khiến paths đi xuyên obstacle. Khi nào dùng: grid paths với moves từ top/left thường DP theo incoming ways, rolling one row nếu chỉ cần previous row.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Compress the grid DP into one row. At a free cell, paths come from above plus left; at an obstacle, the number of paths ending there becomes zero.

## 2. Optimal Java solution

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int rows = obstacleGrid.length;
        int cols = obstacleGrid[0].length;
        int[] dp = new int[cols];

        // Before processing any cell, there is one conceptual way to stand at the
        // start. If the start is an obstacle, its first update will correctly reset to 0.
        dp[0] = 1;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (obstacleGrid[i][j] == 1) {
                    // No path can end on an obstacle. Resetting dp[j] also prevents
                    // paths from above from leaking through this blocked cell to later rows.
                    dp[j] = 0;
                } else if (j > 0) {
                    // Before overwrite, dp[j] is paths from above; dp[j-1] is the
                    // already-updated paths from the left in this row.
                    dp[j] += dp[j - 1];
                }
            }
        }

        return dp[cols - 1];
    }
}
```

## 3. Correctness

For each free cell, every valid path reaches it uniquely from its top or left neighbor. The 1D array stores exactly those two counts at update time; obstacles contribute zero and block propagation.

## 4. Complexity

`O(rows*cols)` time, `O(cols)` space.
