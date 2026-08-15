public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{7,1,5,3,6,4}, 7);
        test(new int[]{1,2,3,4,5}, 4);
        test(new int[]{7,6,4,3,1}, 0);
        test(new int[]{5}, 0);
        test(new int[]{1,5,2,8,3,10}, 17);
        test(new int[]{4,4,4,4}, 0);
        System.out.println("PASS 122 Best Time to Buy and Sell Stock II");
    }

    private static void test(int[] prices, int expected) {
        int actual = new Solution().maxProfit(prices);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
