# Solution / Lời giải — 77. Combinations

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
