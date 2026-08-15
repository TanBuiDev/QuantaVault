public class TestSolution {
    public static void main(String[] args) {
        test("abc", "ahbgdc", true);
        test("axc", "ahbgdc", false);
        test("", "ahbgdc", true);
        test("abc", "", false);
        test("aaaa", "aaa", false);
        test("ace", "abcde", true);
        System.out.println("PASS 392 Is Subsequence");
    }

    private static void test(String s, String t, boolean expected) {
        boolean actual = new Solution().isSubsequence(s, t);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
