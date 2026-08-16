public class TestSolution {
    public static void main(String[] args) {
        test(4, 2);
        test(8, 2);
        test(0, 0);
        test(1, 1);
        test(2147395599, 46339);
        test(Integer.MAX_VALUE, 46340);
        System.out.println("PASS 69 Sqrt(x)");
    }

    private static void test(int x, int expected) {
        int actual = new Solution().mySqrt(x);
        if (actual != expected) {
            throw new AssertionError("x=" + x + " expected=" + expected + " actual=" + actual);
        }
    }
}
