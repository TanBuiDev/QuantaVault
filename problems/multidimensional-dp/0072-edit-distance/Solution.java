class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[] dp = new int[n + 1];

        for (int j = 0; j <= n; j++) {
            dp[j] = j;
        }

        for (int i = 1; i <= m; i++) {
            int diagonal = dp[0];
            dp[0] = i;

            for (int j = 1; j <= n; j++) {
                int top = dp[j];

                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[j] = diagonal;
                } else {
                    dp[j] = 1 + Math.min(Math.min(top, dp[j - 1]), diagonal);
                }

                diagonal = top;
            }
        }

        return dp[n];
    }
}
