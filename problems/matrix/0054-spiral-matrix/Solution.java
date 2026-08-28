import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> answer = new ArrayList<>();
        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;

        // Rectangle [top..bottom] x [left..right] luôn là chính xác vùng chưa output.
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) {
                answer.add(matrix[top][c]);
            }
            top++;

            for (int r = top; r <= bottom; r++) {
                answer.add(matrix[r][right]);
            }
            right--;

            // Sau hai cạnh đầu, rectangle có thể đã co thành rỗng (single row).
            // Guard ngăn đọc bottom edge lần hai và tạo duplicate.
            if (top <= bottom) {
                for (int c = right; c >= left; c--) {
                    answer.add(matrix[bottom][c]);
                }
                bottom--;
            }

            // Tương tự với single column: chỉ đọc left edge nếu vẫn còn cột chưa xử lý.
            if (left <= right) {
                for (int r = bottom; r >= top; r--) {
                    answer.add(matrix[r][left]);
                }
                left++;
            }
        }

        return answer;
    }
}
