class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length, cols = matrix[0].length;
        int left = 0, right = rows * cols - 1;

        // Row ordering plus "first of next row > last of previous row" means the
        // matrix is globally sorted when viewed as one row-major virtual array.
        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Convert a virtual 1D index back to its row/column without copying data.
            int value = matrix[mid / cols][mid % cols];
            if (value == target) return true;
            if (value < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}
