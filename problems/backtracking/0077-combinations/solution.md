# Solution / Lời giải — 77. Combinations

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Combinations n choose k chỉ quan tâm tập số tăng dần, không phải mọi permutation. Nếu path đã chọn 2, số tiếp theo chỉ cần xét 3..n; như vậy [1,2] không bị sinh lại dưới dạng [2,1].

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sinh mọi subset rồi lọc size k vẫn thăm 2^n states. Backtracking theo start và dừng khi path size==k chỉ đi các prefixes có ích; có thể prune khi số phần tử còn lại không đủ.

**State / invariant / data structure cần hiểu trước code.** start là số nhỏ nhất được phép chọn tiếp; path luôn strictly increasing. Invariant mỗi combination có đúng một đường sinh theo thứ tự tăng và không có duplicates/permutations.

**Dry run mental theo implementation.** Dry run n=4,k=2: choose1 rồi thử2,3,4 tạo [1,2],[1,3],[1,4]; undo1, choose2 rồi chỉ thử3,4, không bao giờ tạo [2,1].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là recurse với cùng i gây reuse hoặc bắt đầu lại từ1 tạo permutations. Khi nào dùng: chọn k phần tử không thứ tự thường dùng start index tăng dần và size-based base case.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Build each combination in strictly increasing order. `start` prevents reusing/switching earlier values, and the loop upper bound prunes choices that leave too few numbers to reach size `k`.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(1, n, k, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int start, int n, int k, List<Integer> current,
                           List<List<Integer>> result) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }

        int need = k - current.size();

        // If we still need 'need' values, the next choice cannot exceed
        // n-need+1; choosing later would leave too few numbers to finish the set.
        for (int value = start; value <= n - need + 1; value++) {
            current.add(value);

            // Only consider larger values afterward. This creates each k-element
            // set in increasing order and avoids all permutation duplicates.
            backtrack(value + 1, n, k, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

## 3. Correctness

Every emitted path has `k` distinct increasing values, so it is a valid combination. Every `k`-subset has exactly one increasing representation, which the recursion reaches through its values in order.

## 4. Complexity

Output-sensitive: `O(k * C(n,k))` to materialize results; recursion/path state is `O(k)`.
