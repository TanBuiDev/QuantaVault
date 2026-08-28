class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length();
        int n = s2.length();

        // An interleaving uses every character of s1 and s2 exactly once.
        if (m + n != s3.length()) {
            return false;
        }

        // dp[j] after processing i chars of s1 means s1[0..i) + s2[0..j)
        // can interleave to form exactly s3[0..i+j).
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        for (int j = 1; j <= n; j++) {
            // With zero s1 chars, the prefix can only come entirely from s2.
            dp[j] = dp[j - 1]
                && s2.charAt(j - 1) == s3.charAt(j - 1);
        }

        for (int i = 1; i <= m; i++) {
            // With zero s2 chars, the prefix can only come entirely from s1.
            dp[0] = dp[0]
                && s1.charAt(i - 1) == s3.charAt(i - 1);

            for (int j = 1; j <= n; j++) {
                char target = s3.charAt(i + j - 1);

                // Before overwrite dp[j] is the state using i-1 chars of s1 (take
                // next target char from s1); dp[j-1] is current-row state (take from s2).
                dp[j] = (dp[j] && s1.charAt(i - 1) == target)
                    || (dp[j - 1] && s2.charAt(j - 1) == target);
            }
        }

        return dp[n];
    }
}
