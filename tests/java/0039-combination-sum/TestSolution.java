import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        assertCombinations(Arrays.asList(Arrays.asList(2,2,3), Arrays.asList(7)),
                solution.combinationSum(new int[]{2,3,6,7}, 7));
        assertCombinations(Arrays.asList(Arrays.asList(2,2,2,2), Arrays.asList(2,3,3), Arrays.asList(3,5)),
                solution.combinationSum(new int[]{2,3,5}, 8));
        assertCombinations(Collections.emptyList(), solution.combinationSum(new int[]{2}, 1));
        System.out.println("All tests passed for 39. Combination Sum");
    }

    private static void assertCombinations(List<List<Integer>> expected, List<List<Integer>> actual) {
        if (!normalize(expected).equals(normalize(actual))) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    private static List<String> normalize(List<List<Integer>> values) {
        List<String> normalized = new ArrayList<>();
        for (List<Integer> value : values) {
            List<Integer> copy = new ArrayList<>(value);
            Collections.sort(copy);
            normalized.add(copy.toString());
        }
        Collections.sort(normalized);
        return normalized;
    }
}
