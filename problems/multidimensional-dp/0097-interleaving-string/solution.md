# Solution / Lời giải — 97. Interleaving String

## 1. Core idea

State `(i,j)` asks whether the first `i+j` characters of `s3` can be formed from the first `i` of `s1` and first `j` of `s2`. The final character must come from one of those two strings.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

Every valid interleaving prefix ends by taking its last character from either `s1` or `s2`, while preserving internal order. The recurrence checks exactly these two mutually sufficient predecessor states, so `dp[n]` is true exactly for valid interleavings.

## 4. Complexity

`O(m*n)` time, `O(n)` space.
