public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3,3,5,0,0,3,1,4}, 6);
        test(new int[]{1,2,3,4,5}, 4);
        test(new int[]{7,6,4,3,1}, 0);
        test(new int[]{1,5,2,8}, 10);
        test(new int[]{5}, 0);
        test(new int[]{2,1,2,0,1}, 2);
        System.out.println("PASS 123 Best Time to Buy and Sell Stock III");
    }

    private static void test(int[] prices, int expected) {
        int actual = new Solution().maxProfit(prices);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
