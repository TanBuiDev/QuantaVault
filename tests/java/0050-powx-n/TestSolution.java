public class TestSolution {
    public static void main(String[] args) {
        test(2.0, 10, 1024.0);
        test(2.1, 3, 9.261);
        test(2.0, -2, 0.25);
        test(5.0, 0, 1.0);
        test(-2.0, 3, -8.0);
        test(2.0, Integer.MIN_VALUE, 0.0);
        System.out.println("PASS 50 Pow(x, n)");
    }

    private static void test(double x, int n, double expected) {
        double actual = new Solution().myPow(x, n);
        double tolerance = 1e-9 * Math.max(1.0, Math.abs(expected));
        if (Math.abs(actual - expected) > tolerance) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
