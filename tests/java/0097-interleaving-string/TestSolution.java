public class TestSolution {
    public static void main(String[] args) {
        test("aabcc", "dbbca", "aadbbcbcac", true);
        test("aabcc", "dbbca", "aadbbbaccc", false);
        test("", "", "", true);
        test("a", "", "a", true);
        test("", "b", "b", true);
        test("a", "b", "ab", true);
        test("a", "b", "ba", true);
        test("a", "b", "a", false);
        test("aa", "ab", "aaba", true);
        System.out.println("PASS 97 Interleaving String");
    }

    private static void test(String s1, String s2, String s3, boolean expected) {
        boolean actual = new Solution().isInterleave(s1, s2, s3);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
