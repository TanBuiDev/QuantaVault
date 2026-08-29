# Solution / Lời giải — 72. Edit Distance

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Edit Distance trên prefixes: để biến word1[0..i) thành word2[0..j), nhìn hai ký tự cuối. Nếu chúng bằng nhau không cần operation mới; nếu khác, operation cuối là insert, delete hoặc replace.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Recursion ba branches exponential vì cùng prefix pairs lặp lại. DP state (i,j) nén mỗi pair prefixes một lần, tạo bảng O(mn); recurrence trực tiếp từ ba possibilities của operation cuối.

**State / invariant / data structure cần hiểu trước code.** dp[i][j] là minimum edits đổi first i chars của word1 thành first j chars word2. Base dp[i][0]=i deletions, dp[0][j]=j insertions; mismatch =1+min(delete,insert,replace).

**Dry run mental theo implementation.** Với horse->ros, tại state h/ r mismatch chọn min của neighbors +1; bảng lần lượt xây từ empty prefixes. Kết quả3 tương ứng replace h->r, delete r, delete e theo một optimal sequence.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là không gắn ba neighbors với đúng operation hoặc sai base empty string. Khi nào dùng: minimum operations biến sequence A thành B thường DP trên hai prefix lengths.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

`dp[i][j]` is the minimum edits converting the first `i` characters of `word1` to the first `j` of `word2`. Compress rows into one array while preserving the old diagonal state separately.

## 2. Optimal Java solution

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[] dp = new int[n + 1];

        // Converting empty word1 prefix to the first j chars of word2 needs j inserts.
        for (int j = 0; j <= n; j++) {
            dp[j] = j;
        }

        for (int i = 1; i <= m; i++) {
            // diagonal preserves old dp[i-1][j-1], which would otherwise be lost
            // as the 1D array is overwritten left-to-right.
            int diagonal = dp[0];

            // Converting first i chars of word1 to empty word2 needs i deletions.
            dp[0] = i;

            for (int j = 1; j <= n; j++) {
                int top = dp[j];

                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // Equal final chars need no new operation; inherit diagonal state.
                    dp[j] = diagonal;
                } else {
                    // top = delete from word1, left = insert into word1,
                    // diagonal = replace. One operation plus the cheapest predecessor.
                    dp[j] = 1 + Math.min(Math.min(top, dp[j - 1]), diagonal);
                }

                // Save old top before next column overwrites it; it becomes next diagonal.
                diagonal = top;
            }
        }

        return dp[n];
    }
}
```

## 3. Correctness

If final characters match, no edit is needed beyond the two shorter prefixes. Otherwise an optimal final operation is exactly one of insert, delete, or replace, corresponding to left, top, or diagonal predecessor state; taking their minimum gives the optimal recurrence.

## 4. Complexity

`O(m*n)` time, `O(n)` space.
