import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        assertPermutations(Arrays.asList(
                Arrays.asList(1,2,3), Arrays.asList(1,3,2), Arrays.asList(2,1,3),
                Arrays.asList(2,3,1), Arrays.asList(3,1,2), Arrays.asList(3,2,1)),
                solution.permute(new int[]{1,2,3}));
        assertPermutations(Arrays.asList(Arrays.asList(0,1), Arrays.asList(1,0)),
                solution.permute(new int[]{0,1}));
        assertPermutations(Arrays.asList(Arrays.asList(1)), solution.permute(new int[]{1}));
        System.out.println("All tests passed for 46. Permutations");
    }

    private static void assertPermutations(List<List<Integer>> expected, List<List<Integer>> actual) {
        if (!normalize(expected).equals(normalize(actual))) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    private static List<String> normalize(List<List<Integer>> values) {
        List<String> result = new ArrayList<>();
        for (List<Integer> value : values) result.add(value.toString());
        Collections.sort(result);
        return result;
    }
}
