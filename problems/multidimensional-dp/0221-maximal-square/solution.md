# Solution / Lời giải — 221. Maximal Square

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Nếu cell (r,c) là '1', square lớn nhất có bottom-right tại đó chỉ mở rộng khi ba neighbors left, top, top-left đều hỗ trợ square. Side =1+min(ba side lengths đó).

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Thử mọi square và scan cells rất tốn. DP state theo bottom-right nén điều kiện hình học: weakest trong ba hướng giới hạn side mới, giống thêm một border quanh square nhỏ hơn.

**State / invariant / data structure cần hiểu trước code.** dp[r][c] là side length max square toàn1 kết thúc tại (r,c). Nếu matrix cell0 thì0; nếu1 thì1+min(top,left,diag). Track maxSide rồi area=maxSide².

**Dry run mental theo implementation.** Nếu top=2,left=2,diag=2 và current1, tạo side3. Nếu diag chỉ1 dù top/left2, side chỉ2 vì thiếu square 2x2 ở góc chéo để hỗ trợ 3x3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng max neighbors hoặc trả side thay area. Khi nào dùng: largest all-valid square/rectangle local expansion thường DP theo boundary/corner states.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Let DP store the largest all-ones square side ending at each cell. A `1` cell can extend a square by one beyond the minimum of its top, left, and top-left neighbors.

## 2. Optimal Java solution

```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[] dp = new int[cols + 1];
        int maxSide = 0;

        for (int i = 1; i <= rows; i++) {
            // diagonal stores old dp[j-1] = square side ending at top-left neighbor.
            int diagonal = 0;

            for (int j = 1; j <= cols; j++) {
                // Save old dp[j] (top neighbor) before current-row overwrite.
                int top = dp[j];

                if (matrix[i - 1][j - 1] == '1') {
                    // A square can extend by one only as far as ALL three adjacent
                    // squares support: top, left, and top-left. The smallest is limiting.
                    dp[j] = Math.min(Math.min(dp[j], dp[j - 1]), diagonal) + 1;
                    maxSide = Math.max(maxSide, dp[j]);
                } else {
                    // A square ending at a 0 cell has side length zero.
                    dp[j] = 0;
                }

                // Old top becomes top-left for the next column.
                diagonal = top;
            }
        }

        // Problem asks for area, while DP stores side length.
        return maxSide * maxSide;
    }
}
```

## 3. Correctness

A square of side `s>1` ending at a `1` cell exists exactly when the three neighboring ending-squares can all support side at least `s-1`. Hence the largest side is one plus their minimum; tracking the largest such state yields the maximal area.

## 4. Complexity

`O(rows*cols)` time, `O(cols)` space.
