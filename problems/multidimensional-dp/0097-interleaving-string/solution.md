# Solution / Lời giải — 97. Interleaving String

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Interleaving String cần dùng toàn bộ s1 và s2 theo thứ tự nội bộ để tạo s3. State tự nhiên là đã lấy i chars từ s1 và j chars từ s2; vị trí s3 lúc đó luôn k=i+j.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Backtracking chọn s1/s2 có thể branch exponential khi chars giống nhau. DP memo trên (i,j) gom states trùng; transition thử lấy next char từ s1 nếu match s3[k] hoặc từ s2 nếu match.

**State / invariant / data structure cần hiểu trước code.** dp[i][j] nghĩa là s3 prefix length i+j có thể tạo từ s1 prefix i và s2 prefix j. Invariant chỉ có hai predecessor: (i-1,j) nếu s1[i-1] match, hoặc (i,j-1) nếu s2[j-1] match.

**Dry run mental theo implementation.** s1='aab', s2='axy', s3='aaxaby': early 'aa' có nhiều choices nhưng DP giữ reachable prefix pairs; mỗi cell OR hai legal predecessors và tránh khám lại cùng suffix choice tree.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ greedy chọn s1 khi cả hai chars cùng match và có thể dead-end. Khi nào dùng: merge hai sequences giữ order để match third sequence thường DP trên pair prefix indices.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
