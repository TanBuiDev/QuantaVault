public class TestSolution {
    public static void main(String[] args) {
        test(43261596, 964176192);
        test(2147483644, 1073741822);
        test(0, 0);
        test(2, 1073741824);
        System.out.println("PASS 190 Reverse Bits");
    }

    private static void test(int n, int expected) {
        int actual = new Solution().reverseBits(n);
        if (actual != expected) {
            throw new AssertionError("n=" + n + " expected=" + expected + " actual=" + actual);
        }
    }
}
