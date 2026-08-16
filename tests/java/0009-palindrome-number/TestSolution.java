public class TestSolution {
    public static void main(String[] args) {
        test(121, true);
        test(-121, false);
        test(10, false);
        test(0, true);
        test(1221, true);
        test(12321, true);
        test(123, false);
        System.out.println("PASS 9 Palindrome Number");
    }

    private static void test(int x, boolean expected) {
        boolean actual = new Solution().isPalindrome(x);
        if (actual != expected) {
            throw new AssertionError("x=" + x + " expected=" + expected + " actual=" + actual);
        }
    }
}
