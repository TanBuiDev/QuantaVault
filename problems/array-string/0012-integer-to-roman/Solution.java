class Solution {
    // Khởi tạo các mốc giá trị từ lớn đến nhỏ. Bằng cách duyệt từ lớn nhất, 
    // ta đảm bảo tính chất Greedy: luôn dùng ký hiệu lớn nhất có thể trước tiên.
    private static final int[] VALUES = {
        1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1
    };

    private static final String[] SYMBOLS = {
        "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
    };

    public String intToRoman(int num) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < VALUES.length; i++) {
            // Chừng nào số còn lớn hơn mốc giá trị hiện tại, ta cứ nhặt mốc này.
            // Điều này đúng vì các mốc đã được xếp giảm dần.
            while (num >= VALUES[i]) {
                result.append(SYMBOLS[i]);
                num -= VALUES[i];
            }
        }

        return result.toString();
    }
}
