# Solution / Lời giải — 39. Combination Sum

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Combination Sum cho phép dùng lại cùng candidate nhiều lần. Sau khi sort/duyệt theo index, một branch chọn candidates[i] có thể recurse lại với chính i; branch bỏ nó sẽ thử i+1.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sinh mọi multiset theo length tùy ý không có bound rõ. Quan sát target giảm mỗi lần chọn số dương, nên recursion dừng tự nhiên khi remaining==0 hoặc candidate>remaining; start index tránh permutations trùng thứ tự.

**State / invariant / data structure cần hiểu trước code.** remaining là target còn thiếu, start giới hạn candidates được phép chọn tiếp, path là combination đang xây. Invariant path không giảm theo index order nên cùng multiset chỉ xuất hiện một lần.

**Dry run mental theo implementation.** Dry run candidates [2,3,6,7], target7: chọn2 -> remaining5, lại2 ->3, rồi3 ->0 tạo [2,2,3]; branch root chọn7 ->0 tạo [7].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là recurse i+1 sau khi chọn khiến mất khả năng reuse, hoặc reset start về0 tạo permutations. Khi nào dùng: unlimited-choice combination thường giữ same index sau choose và advance index giữa sibling choices.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Sort candidates, build combinations in nondecreasing index order, and recurse with the same index to allow unlimited reuse. This enumerates combinations without permutation duplicates.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start,
                           List<Integer> current, List<List<Integer>> result) {
        if (remaining == 0) {
            // current is mutated by later backtracking, so output needs its own snapshot.
            result.add(new ArrayList<>(current));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            int value = candidates[i];

            // Candidates are sorted and positive; once value is too large, every
            // later value is also too large for this remaining target.
            if (value > remaining) {
                break;
            }

            current.add(value);

            // Recurse with i (not i+1) because the same candidate may be reused.
            // Keeping indices nondecreasing prevents permutations of one combination.
            backtrack(candidates, remaining - value, i, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

## 3. Correctness

Every path has nondecreasing candidate indices, so each multiset combination has one representation. Reusing index `i` permits arbitrary multiplicity, and every branch subtracts exactly its chosen value until reaching target remainder `0`.

## 4. Complexity

Backtracking is output/search-tree dependent; recursion depth is at most `target / minCandidate`, excluding output storage.
