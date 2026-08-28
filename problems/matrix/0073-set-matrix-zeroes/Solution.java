class Solution {
    public void setZeroes(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        boolean firstRowZero = false;
        boolean firstColZero = false;

        // first row/column sẽ bị tái sử dụng làm marker, nên phải chụp lại
        // trạng thái zero ban đầu của chúng trước khi marker mutations làm mất thông tin.
        for (int c = 0; c < cols; c++) {
            if (matrix[0][c] == 0) {
                firstRowZero = true;
                break;
            }
        }

        for (int r = 0; r < rows; r++) {
            if (matrix[r][0] == 0) {
                firstColZero = true;
                break;
            }
        }

        for (int r = 1; r < rows; r++) {
            for (int c = 1; c < cols; c++) {
                if (matrix[r][c] == 0) {
                    // Hai border cell đóng vai trò row/column marker, thay cho
                    // hai mảng boolean phụ và giữ extra space ở O(1).
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }

        // Apply marker cho interior trước; zero first row/column sớm hơn sẽ tạo
        // marker giả và làm zero lan sang các hàng/cột không nên bị ảnh hưởng.
        for (int r = 1; r < rows; r++) {
            for (int c = 1; c < cols; c++) {
                if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                    matrix[r][c] = 0;
                }
            }
        }

        if (firstRowZero) {
            for (int c = 0; c < cols; c++) {
                matrix[0][c] = 0;
            }
        }

        if (firstColZero) {
            for (int r = 0; r < rows; r++) {
                matrix[r][0] = 0;
            }
        }
    }
}
