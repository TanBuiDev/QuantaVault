import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();

        assertEquals(
            5,
            solution.ladderLength(
                "hit",
                "cog",
                Arrays.asList("hot", "dot", "dog", "lot", "log", "cog")
            )
        );

        assertEquals(
            0,
            solution.ladderLength(
                "hit",
                "cog",
                Arrays.asList("hot", "dot", "dog", "lot", "log")
            )
        );

        assertEquals(
            2,
            solution.ladderLength("a", "c", Arrays.asList("a", "b", "c"))
        );

        assertEquals(
            4,
            solution.ladderLength(
                "red",
                "tax",
                Arrays.asList("ted", "tex", "red", "tax", "tad", "den", "rex", "pee")
            )
        );

        System.out.println("PASS 127 Word Ladder");
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
