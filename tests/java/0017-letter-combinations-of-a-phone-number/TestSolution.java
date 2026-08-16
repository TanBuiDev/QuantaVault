import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();

        assertSameValues(
                Arrays.asList("ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"),
                solution.letterCombinations("23"));

        assertSameValues(
                Arrays.asList("a", "b", "c"),
                solution.letterCombinations("2"));

        assertSameValues(
                Arrays.asList("p", "q", "r", "s"),
                solution.letterCombinations("7"));

        List<String> seventyNine = solution.letterCombinations("79");
        assertEquals(16, seventyNine.size());
        assertContains(seventyNine, "pw");
        assertContains(seventyNine, "sz");
        assertEquals(16, new HashSet<>(seventyNine).size());

        System.out.println("All tests passed for 17. Letter Combinations of a Phone Number");
    }

    private static void assertSameValues(List<String> expected, List<String> actual) {
        Set<String> expectedSet = new HashSet<>(expected);
        Set<String> actualSet = new HashSet<>(actual);
        if (expected.size() != actual.size() || !expectedSet.equals(actualSet)) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }

    private static void assertContains(List<String> values, String expected) {
        if (!values.contains(expected)) {
            throw new AssertionError("Expected list to contain " + expected + " but got " + values);
        }
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
