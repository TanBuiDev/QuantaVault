public class TestSolution {
    public static void main(String[] args) {
        test("sadbutsad", "sad", 0);
        test("leetcode", "leeto", -1);
        test("hello", "llo", 2);
        test("aabaaabaaac", "aabaaac", 4);
        test("abc", "abcd", -1);
        test("mississippi", "issip", 4);
        System.out.println("PASS 28 Find the Index of the First Occurrence in a String");
    }

    private static void test(String haystack, String needle, int expected) {
        int actual = new Solution().strStr(haystack, needle);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
