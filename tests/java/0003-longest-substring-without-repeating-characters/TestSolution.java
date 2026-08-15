public class TestSolution {
    public static void main(String[] args) {
        test("abcabcbb", 3);
        test("bbbbb", 1);
        test("pwwkew", 3);
        test("", 0);
        test(" ", 1);
        test("abba", 2);
        System.out.println("PASS 3 Longest Substring Without Repeating Characters");
    }

    private static void test(String s, int expected) {
        int actual = new Solution().lengthOfLongestSubstring(s);
        if (actual != expected) {
            throw new AssertionError("s=" + s + " expected=" + expected + " actual=" + actual);
        }
    }
}
