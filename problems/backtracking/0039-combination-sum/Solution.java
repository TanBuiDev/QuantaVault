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
