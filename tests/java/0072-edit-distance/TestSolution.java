public class TestSolution {
    public static void main(String[] args) {
        test("horse", "ros", 3);
        test("intention", "execution", 5);
        test("", "", 0);
        test("", "abc", 3);
        test("abc", "", 3);
        test("abc", "abc", 0);
        test("a", "b", 1);
        test("kitten", "sitting", 3);
        System.out.println("PASS 72 Edit Distance");
    }

    private static void test(String word1, String word2, int expected) {
        int actual = new Solution().minDistance(word1, word2);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
