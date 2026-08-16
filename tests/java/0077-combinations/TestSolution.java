import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        assertCombinations(Arrays.asList(
                Arrays.asList(1,2), Arrays.asList(1,3), Arrays.asList(1,4),
                Arrays.asList(2,3), Arrays.asList(2,4), Arrays.asList(3,4)),
                solution.combine(4, 2));
        assertCombinations(Arrays.asList(Arrays.asList(1)), solution.combine(1, 1));
        assertCombinations(Arrays.asList(Arrays.asList(1,2,3,4)), solution.combine(4, 4));
        assertCombinations(Arrays.asList(Arrays.asList(1), Arrays.asList(2), Arrays.asList(3)), solution.combine(3, 1));
        System.out.println("All tests passed for 77. Combinations");
    }

    private static void assertCombinations(List<List<Integer>> expected, List<List<Integer>> actual) {
        if (!normalize(expected).equals(normalize(actual))) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    private static List<String> normalize(List<List<Integer>> values) {
        List<String> normalized = new ArrayList<>();
        for (List<Integer> value : values) normalized.add(value.toString());
        Collections.sort(normalized);
        return normalized;
    }
}
