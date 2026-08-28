class Solution {
    public int maxProfit(int[] prices) {
        // Giá mua thấp nhất ghi nhận được tính từ ngày đầu tiên cho đến ngày hiện tại (Running minimum).
        int minPrice = Integer.MAX_VALUE;

        // Lợi nhuận lớn nhất có thể thu được.
        int maxProfit = 0;

        for (int price : prices) {
            // Cập nhật giá mua thấp nhất nếu hôm nay giá rẻ hơn bất kỳ ngày nào trong quá khứ.
            minPrice = Math.min(minPrice, price);

            // Giả định nếu bán vào ngày hôm nay (với mức giá mua thấp nhất đã tìm thấy ở trên),
            // cập nhật lợi nhuận kỷ lục nếu mức lãi này cao hơn các ngày trước.
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
}
