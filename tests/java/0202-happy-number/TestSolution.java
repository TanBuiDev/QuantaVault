public class TestSolution {
    public static void main(String[] args) {
        test(19, true);
        test(2, false);
        test(1, true);
        test(7, true);
        test(4, false);
        System.out.println("PASS 202 Happy Number");
    }

    private static void test(int n, boolean expected) {
        boolean actual = new Solution().isHappy(n);
        if (actual != expected) {
            throw new AssertionError("n=" + n + " expected=" + expected + " actual=" + actual);
        }
    }
}
