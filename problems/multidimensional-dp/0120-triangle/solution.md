# Solution / Lời giải — 120. Triangle

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Trong Triangle, từ cell row r,col c chỉ đi xuống (r+1,c) hoặc (r+1,c+1). Nếu tính từ dưới lên, minimum path từ cell hiện tại = value + min(best của hai children).

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS mọi root-to-bottom paths exponential. DP bottom-up có lợi vì last row đã là base answers; một 1D array copy last row rồi overwrite upward, không cần full table.

**State / invariant / data structure cần hiểu trước code.** dp[c] trước xử lý row r là minimum sum từ child (r+1,c) xuống đáy. Update dp[c]=triangle[r][c]+min(dp[c],dp[c+1]); invariant sau row r, dp[c] là best từ cell(r,c) xuống.

**Dry run mental theo implementation.** Triangle [[2],[3,4],[6,5,7],[4,1,8,3]]: start [4,1,8,3]; row2 -> [7,6,10]; row1 -> [9,10]; row0 -> [11], answer11.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là update top-down in-place mà overwrite state còn cần. Khi nào dùng: layered DAG với transitions xuống next layer có thể DP bottom-up và rolling one layer.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Work bottom-up. The minimum path from a cell equals its value plus the smaller minimum path of its two allowed children. One array can store the row below.

## 2. Optimal Java solution

```java
import java.util.List;

class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n];

        // Bottom row is the base case: from a bottom cell to the bottom, the
        // minimum path cost is simply that cell's own value.
        for (int j = 0; j < n; j++) {
            dp[j] = triangle.get(n - 1).get(j);
        }

        for (int i = n - 2; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                // From (i,j), the next row allows only child j or j+1. dp still
                // stores the completed optimal costs from those two child states.
                dp[j] = triangle.get(i).get(j) + Math.min(dp[j], dp[j + 1]);
            }
        }

        return dp[0];
    }
}
```

## 3. Correctness

Every path from a triangle cell must continue through exactly one of its two children. Assuming the child DP values are optimal, choosing the smaller one plus current value gives the optimal current state; bottom-up induction reaches the root.

## 4. Complexity

`O(total cells)` time, `O(n)` space for `n` rows.
