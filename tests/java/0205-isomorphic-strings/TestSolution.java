public class TestSolution {
    public static void main(String[] args) {
        test("egg", "add", true);
        test("f11", "b23", false);
        test("paper", "title", true);
        test("ab", "aa", false);
        test("badc", "baba", false);
        System.out.println("PASS 205 Isomorphic Strings");
    }

    private static void test(String s, String t, boolean expected) {
        boolean actual = new Solution().isIsomorphic(s, t);
        if (actual != expected) {
            throw new AssertionError("s=" + s + " t=" + t + " expected=" + expected + " actual=" + actual);
        }
    }
}
