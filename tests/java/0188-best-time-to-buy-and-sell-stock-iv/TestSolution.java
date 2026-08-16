public class TestSolution {
    public static void main(String[] args) {
        test(2, new int[]{2,4,1}, 2);
        test(2, new int[]{3,2,6,5,0,3}, 7);
        test(3, new int[]{7,6,4,3,1}, 0);
        test(5, new int[]{1,2,3,4,5}, 4);
        test(1, new int[]{5}, 0);
        test(1, new int[]{1,5,2,8}, 7);
        test(2, new int[]{1,5,2,8}, 10);
        System.out.println("PASS 188 Best Time to Buy and Sell Stock IV");
    }

    private static void test(int k, int[] prices, int expected) {
        int actual = new Solution().maxProfit(k, prices);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
