import java.util.Arrays;

class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];

        // 1 là lower bound bắt buộc cho mọi child; hai lượt sau chỉ tăng khi
        // một quan hệ với hàng xóm chứng minh cần nhiều hơn mức tối thiểu này.
        Arrays.fill(candies, 1);

        for (int i = 1; i < n; i++) {
            // Lượt trái -> phải tạo lower bound nhỏ nhất thỏa constraint với bên trái.
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }

        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                // Constraint bên phải có thể đòi hỏi nhiều hơn, nhưng không được giảm
                // giá trị đã cần để thỏa bên trái; lấy max chính là hợp hai lower bound.
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }

        int total = 0;
        for (int amount : candies) {
            total += amount;
        }
        return total;
    }
}
