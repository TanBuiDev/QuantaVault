# Solution / Lời giải — 64. Minimum Path Sum

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
