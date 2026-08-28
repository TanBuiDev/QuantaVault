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
