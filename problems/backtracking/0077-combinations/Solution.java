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
        for (int value = start; value <= n - need + 1; value++) {
            current.add(value);
            backtrack(value + 1, n, k, current, result);
            current.remove(current.size() - 1);
        }
    }
}
