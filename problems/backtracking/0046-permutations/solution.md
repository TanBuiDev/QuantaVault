# Solution / Lời giải — 46. Permutations

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Permutation khác combination ở chỗ thứ tự quan trọng: với [1,2,3], sau khi chọn 1, vị trí kế tiếp có thể chọn 2 hoặc3; một value chỉ không được dùng lại trong cùng path.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Nested loops chỉ phù hợp n cố định. Backtracking dùng used[]/swap để biểu diễn choices còn lại; mỗi level tương ứng một vị trí output và thử mọi element chưa dùng.

**State / invariant / data structure cần hiểu trước code.** path chứa prefix permutation, used[i] cho biết nums[i] đã có trong path. Invariant số true trong used bằng path size; khi path size==n, path là permutation hoàn chỉnh.

**Dry run mental theo implementation.** Dry run [1,2,3]: choose1, choose2, choose3 -> [1,2,3]; undo3 rồi2, choose3 rồi2 -> [1,3,2]; sau đó undo1 để mở các permutations bắt đầu bằng2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên reset used[i]=false khi backtrack hoặc dùng start index như combinations làm mất permutations. Khi nào dùng: arrange mọi items theo order thường là one-level-per-position backtracking.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

At each permutation position, choose any input index not already used in the current path. Mark → recurse → unmark makes every ordering reachable exactly once for distinct input values.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> current,
                           List<List<Integer>> result) {
        if (current.size() == nums.length) {
            // Copy because current will be changed while exploring sibling permutations.
            result.add(new ArrayList<>(current));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            // used tracks INPUT POSITIONS already placed in the current permutation;
            // each position must appear exactly once before a permutation is complete.
            if (used[i]) {
                continue;
            }

            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, used, current, result);

            // Undo both pieces of branch state so the next candidate can occupy
            // this same permutation position independently.
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}
```

## 3. Correctness

The path contains distinct input positions only. A length-`n` path therefore contains every input exactly once; exploring every unused position at each depth enumerates every permutation.

## 4. Complexity

`O(n * n!)` time to materialize all permutations, `O(n)` recursion/path state excluding output.
