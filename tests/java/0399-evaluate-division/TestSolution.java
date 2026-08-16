import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        List<List<String>> equations = Arrays.asList(
            Arrays.asList("a", "b"), Arrays.asList("b", "c"));
        double[] values = {2.0, 3.0};
        List<List<String>> queries = Arrays.asList(
            Arrays.asList("a", "c"), Arrays.asList("b", "a"), Arrays.asList("a", "e"),
            Arrays.asList("a", "a"), Arrays.asList("x", "x"));
        assertArray(new Solution().calcEquation(equations, values, queries),
                    new double[]{6.0, 0.5, -1.0, 1.0, -1.0});

        List<List<String>> reverseQueries = Arrays.asList(
            Arrays.asList("c", "a"), Arrays.asList("c", "b"));
        assertArray(new Solution().calcEquation(equations, values, reverseQueries),
                    new double[]{1.0 / 6.0, 1.0 / 3.0});
        System.out.println("PASS 399 Evaluate Division");
    }

    private static void assertArray(double[] actual, double[] expected) {
        if (actual.length != expected.length) throw new AssertionError("length mismatch");
        for (int i = 0; i < actual.length; i++) {
            if (Math.abs(actual[i] - expected[i]) > 1e-9) {
                throw new AssertionError("index " + i + ": expected " + expected[i] + " got " + actual[i]);
            }
        }
    }
}
