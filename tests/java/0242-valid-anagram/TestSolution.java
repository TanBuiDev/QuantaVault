public class TestSolution {
    public static void main(String[] args) {
        test("anagram", "nagaram", true);
        test("rat", "car", false);
        test("aab", "abb", false);
        test("leetcode", "leetcode", true);
        test("ab", "a", false);
        System.out.println("PASS 242 Valid Anagram");
    }

    private static void test(String s, String t, boolean expected) {
        boolean actual = new Solution().isAnagram(s, t);
        if (actual != expected) {
            throw new AssertionError("s=" + s + " t=" + t + " expected=" + expected + " actual=" + actual);
        }
    }
}
