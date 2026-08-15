public class TestSolution {
    public static void main(String[] args) {
        expectOneOf("babad", new String[]{"bab", "aba"});
        expectExact("cbbd", "bb");
        expectExact("a", "a");
        expectExact("aaaa", "aaaa");
        expectOneOf("ac", new String[]{"a", "c"});
        expectExact("racecar", "racecar");
        expectExact("forgeeksskeegfor", "geeksskeeg");
        System.out.println("PASS 5 Longest Palindromic Substring");
    }

    private static void expectExact(String input, String expected) {
        String actual = new Solution().longestPalindrome(input);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }

    private static void expectOneOf(String input, String[] expected) {
        String actual = new Solution().longestPalindrome(input);
        for (String value : expected) {
            if (actual.equals(value)) return;
        }
        throw new AssertionError("unexpected palindrome=" + actual);
    }
}
