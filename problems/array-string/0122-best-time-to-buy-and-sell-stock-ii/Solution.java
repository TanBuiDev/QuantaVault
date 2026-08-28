class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;

        for (int i = 1; i < prices.length; i++) {
            // Với unlimited transactions, mọi positive delta có thể thu độc lập.
            // Trên một đoạn tăng, tổng các delta này telescope thành đúng peak - valley.
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }

        return profit;
    }
}
