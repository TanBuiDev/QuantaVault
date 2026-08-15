public class TestSolution {
    public static void main(String[] args) {
        test("A man, a plan, a canal: Panama", true);
        test("race a car", false);
        test(" ", true);
        test("0P", false);
        test(".,!", true);
        test("A1b2b1a", true);
        System.out.println("PASS 125 Valid Palindrome");
    }

    private static void test(String s, boolean expected) {
        boolean actual = new Solution().isPalindrome(s);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
