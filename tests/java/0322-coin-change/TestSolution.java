public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,5}, 11, 3);
        test(new int[]{2}, 3, -1);
        test(new int[]{1}, 0, 0);
        test(new int[]{1,3,4}, 6, 2);
        test(new int[]{2,5,10,1}, 27, 4);
        test(new int[]{2147483647}, 2, -1);
        System.out.println("PASS 322 Coin Change");
    }

    private static void test(int[] coins, int amount, int expected) {
        int actual = new Solution().coinChange(coins, amount);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
