import java.util.Arrays;

class Solution {
    public int maxProfit(int k, int[] prices) {
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE / 4);

        for (int price : prices) {
            for (int t = 1; t <= k; t++) {
                buy[t] = Math.max(buy[t], sell[t - 1] - price);
                sell[t] = Math.max(sell[t], buy[t] + price);
            }
        }

        return sell[k];
    }
}
