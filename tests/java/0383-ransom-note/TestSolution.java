public class TestSolution {
    public static void main(String[] args) {
        test("a", "b", false);
        test("aa", "ab", false);
        test("aa", "aab", true);
        test("abc", "cba", true);
        test("aabbcc", "aabbc", false);
        System.out.println("PASS 383 Ransom Note");
    }

    private static void test(String ransomNote, String magazine, boolean expected) {
        boolean actual = new Solution().canConstruct(ransomNote, magazine);
        if (actual != expected) {
            throw new AssertionError("ransomNote=" + ransomNote + " magazine=" + magazine + " expected=" + expected + " actual=" + actual);
        }
    }
}
