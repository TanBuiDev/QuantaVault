# Solution / Lời giải — 46. Permutations

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
