public class TestSolution {
    public static void main(String[] args) {
        test("ADOBECODEBANC", "ABC", "BANC");
        test("a", "a", "a");
        test("a", "aa", "");
        test("AAABBC", "AABC", "AABBC");
        test("bba", "ab", "ba");
        System.out.println("PASS 76 Minimum Window Substring");
    }

    private static void test(String s, String t, String expected) {
        String actual = new Solution().minWindow(s, t);
        if (!actual.equals(expected)) {
            throw new AssertionError("s=" + s + " t=" + t + " expected=" + expected + " actual=" + actual);
        }
    }
}
