public class TestSolution {
    public static void main(String[] args) {
        test(3, 0);
        test(5, 1);
        test(0, 0);
        test(25, 6);
        test(30, 7);
        test(125, 31);
        System.out.println("PASS 172 Factorial Trailing Zeroes");
    }

    private static void test(int n, int expected) {
        int actual = new Solution().trailingZeroes(n);
        if (actual != expected) {
            throw new AssertionError("n=" + n + " expected=" + expected + " actual=" + actual);
        }
    }
}
