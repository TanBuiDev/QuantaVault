class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // Transpose chỉ swap phía trên main diagonal. Nếu duyệt cả hai phía,
        // mỗi cặp (r,c)/(c,r) sẽ bị swap hai lần và quay về trạng thái ban đầu.
        for (int r = 0; r < n; r++) {
            for (int c = r + 1; c < n; c++) {
                int temp = matrix[r][c];
                matrix[r][c] = matrix[c][r];
                matrix[c][r] = temp;
            }
        }

        // Transpose map (r,c) -> (c,r). Reverse mỗi row đổi column r thành
        // n-1-r, nên tổng hợp hai phép biến đổi chính là rotate clockwise 90°.
        for (int r = 0; r < n; r++) {
            int left = 0;
            int right = n - 1;
            while (left < right) {
                int temp = matrix[r][left];
                matrix[r][left] = matrix[r][right];
                matrix[r][right] = temp;
                left++;
                right--;
            }
        }
    }
}
