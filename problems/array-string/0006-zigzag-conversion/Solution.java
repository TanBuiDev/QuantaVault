class Solution {
    public String convert(String s, int numRows) {
        // Nếu numRows = 1 thì không có chuyển động lên/xuống.
        // Tương tự, numRows >= s.length() thì mỗi ký tự ở 1 hàng riêng, chuỗi không đổi.
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }

        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) {
            rows[i] = new StringBuilder();
        }

        // direction = 1 (đi xuống), -1 (đi lên)
        int row = 0;
        int direction = 1;

        for (char c : s.toCharArray()) {
            rows[row].append(c);

            // Chạm đỉnh (row == 0) thì đổi hướng đi xuống.
            // Chạm đáy (row == numRows - 1) thì đổi hướng đi lên.
            if (row == 0) {
                direction = 1;
            } else if (row == numRows - 1) {
                direction = -1;
            }

            row += direction;
        }

        StringBuilder result = new StringBuilder(s.length());
        for (StringBuilder currentRow : rows) {
            result.append(currentRow);
        }

        return result.toString();
    }
}
