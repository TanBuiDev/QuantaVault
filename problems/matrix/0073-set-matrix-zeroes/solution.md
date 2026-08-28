# 73. Set Matrix Zeroes — Solution

## 1. Core idea

Dùng first row và first column làm marker storage, cộng hai boolean:

```text
firstRowZero
firstColZero
```

Khi thấy `matrix[r][c] == 0` ở interior:

```text
matrix[r][0] = 0
matrix[0][c] = 0
```

## 2. Why two booleans are needed

`matrix[0][0]` nằm đồng thời trên first row và first column, nên một cell không thể lưu hai bit trạng thái độc lập. Ta ghi nhớ trạng thái ban đầu của hai vùng này trước khi dùng chúng làm marker.

## 3. Algorithm

1. Scan first row để biết có zero ban đầu không.
2. Scan first column tương tự.
3. Scan interior, ghi row/column markers.
4. Scan interior lần hai; nếu row marker hoặc column marker bằng `0`, set cell bằng `0`.
5. Nếu `firstRowZero`, zero first row.
6. Nếu `firstColZero`, zero first column.

## 4. Optimal Java solution

```java
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
```

## 5. Correctness

Sau bước marker, với mọi interior row `r`, `matrix[r][0]==0` iff row đó cần zero do có original zero trong interior; tương tự cho columns. Bước apply markers zero chính xác mọi interior cell thuộc một marked row/column. Hai boolean riêng khôi phục yêu cầu zero của first row/column mà không bị marker mutations làm mất thông tin. Vì vậy final matrix đúng với tất cả original zero và không tạo ảnh hưởng ngoài yêu cầu.

## 6. Complexity

```text
Time: O(m*n)
Extra space: O(1)
```

## 7. Common mistakes

- Zero ngay khi gặp `0`, làm zero mới lan truyền sai.
- Dùng `(0,0)` cho cả first row và first column mà không có flag riêng.
- Zero first row/column quá sớm làm hỏng marker.
- Dùng extra row/column arrays dù follow-up yêu cầu constant space.
