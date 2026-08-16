public class TestSolution {
    public static void main(String[] args) {
        test(5, 7, 4);
        test(0, 0, 0);
        test(1, Integer.MAX_VALUE, 0);
        test(12, 12, 12);
        test(12, 15, 12);
        System.out.println("PASS 201 Bitwise AND of Numbers Range");
    }

    private static void test(int left, int right, int expected) {
        int actual = new Solution().rangeBitwiseAnd(left, right);
        if (actual != expected) {
            throw new AssertionError("left=" + left + " right=" + right + " expected=" + expected + " actual=" + actual);
        }
    }
}
