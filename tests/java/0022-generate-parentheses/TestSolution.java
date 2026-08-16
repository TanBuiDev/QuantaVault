import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        assertSameSet(Arrays.asList("()"), solution.generateParenthesis(1));
        assertSameSet(Arrays.asList("(())", "()()"), solution.generateParenthesis(2));
        assertSameSet(Arrays.asList("((()))", "(()())", "(())()", "()(())", "()()()"), solution.generateParenthesis(3));
        System.out.println("All tests passed for 22. Generate Parentheses");
    }

    private static void assertSameSet(List<String> expected, List<String> actual) {
        Set<String> expectedSet = new HashSet<>(expected);
        Set<String> actualSet = new HashSet<>(actual);
        if (expected.size() != actual.size() || !expectedSet.equals(actualSet)) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
