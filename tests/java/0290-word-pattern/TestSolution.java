public class TestSolution {
    public static void main(String[] args) {
        test("abba", "dog cat cat dog", true);
        test("abba", "dog cat cat fish", false);
        test("aaaa", "dog cat cat dog", false);
        test("ab", "dog dog", false);
        test("aaa", "dog dog", false);
        System.out.println("PASS 290 Word Pattern");
    }

    private static void test(String pattern, String s, boolean expected) {
        boolean actual = new Solution().wordPattern(pattern, s);
        if (actual != expected) {
            throw new AssertionError("pattern=" + pattern + " s=" + s + " expected=" + expected + " actual=" + actual);
        }
    }
}
