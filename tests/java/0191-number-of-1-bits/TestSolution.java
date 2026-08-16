public class TestSolution {
    public static void main(String[] args) {
        test(11, 3);
        test(128, 1);
        test(2147483645, 30);
        test(1, 1);
        test(7, 3);
        System.out.println("PASS 191 Number of 1 Bits");
    }

    private static void test(int n, int expected) {
        int actual = new Solution().hammingWeight(n);
        if (actual != expected) {
            throw new AssertionError("n=" + n + " expected=" + expected + " actual=" + actual);
        }
    }
}
