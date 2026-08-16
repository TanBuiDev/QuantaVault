import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();

        assertSameValues(
                Arrays.asList("eat", "oath"),
                solution.findWords(new char[][]{
                        {'o','a','a','n'},
                        {'e','t','a','e'},
                        {'i','h','k','r'},
                        {'i','f','l','v'}
                }, new String[]{"oath", "pea", "eat", "rain"}));

        assertSameValues(
                Arrays.asList(),
                solution.findWords(new char[][]{
                        {'a','b'},
                        {'c','d'}
                }, new String[]{"abcb"}));

        assertSameValues(
                Arrays.asList("ab", "abd", "abdc", "ac", "acdb"),
                solution.findWords(new char[][]{
                        {'a','b'},
                        {'c','d'}
                }, new String[]{"ab", "abd", "abdc", "ac", "acdb"}));

        assertSameValues(
                Arrays.asList("aa", "aaa", "aaaa"),
                solution.findWords(new char[][]{
                        {'a','a'},
                        {'a','a'}
                }, new String[]{"aa", "aaa", "aaaa"}));

        assertSameValues(
                Arrays.asList("a"),
                solution.findWords(new char[][]{{'a'}}, new String[]{"a", "b"}));

        System.out.println("All tests passed for 212. Word Search II");
    }

    private static void assertSameValues(List<String> expected, List<String> actual) {
        Set<String> expectedSet = new HashSet<>(expected);
        Set<String> actualSet = new HashSet<>(actual);
        if (expected.size() != actual.size() || !expectedSet.equals(actualSet)) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
