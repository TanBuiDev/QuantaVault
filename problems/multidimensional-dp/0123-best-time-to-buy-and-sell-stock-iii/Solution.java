class Solution {
    public int maxProfit(int[] prices) {
        // Each state is the best cash balance after a particular action count:
        // buy1 = holding after first buy, sell1 = flat after first sell, etc.
        int buy1 = Integer.MIN_VALUE / 4;
        int sell1 = 0;
        int buy2 = Integer.MIN_VALUE / 4;
        int sell2 = 0;

        for (int price : prices) {
            // Keep the best previous state or perform the corresponding action today.
            // Same-day transitions are harmless: buy then sell at one price adds zero
            // profit and simply represents using fewer than two effective transactions.
            buy1 = Math.max(buy1, -price);
            sell1 = Math.max(sell1, buy1 + price);
            buy2 = Math.max(buy2, sell1 - price);
            sell2 = Math.max(sell2, buy2 + price);
        }

        // sell2 represents the best profit after at most two completed transactions.
        return sell2;
    }
}
