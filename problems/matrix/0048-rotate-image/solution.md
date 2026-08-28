# 48. Rotate Image — Solution

## 1. Core idea

Rotation clockwise có thể phân rã thành:

```text
transpose -> reverse every row
```

Ví dụ:

```text
1 2 3       1 4 7       7 4 1
4 5 6  ->   2 5 8  ->   8 5 2
7 8 9       3 6 9       9 6 3
```

## 2. Transpose in-place

Chỉ swap các cặp phía trên main diagonal. Nếu loop toàn ma trận, cùng một cặp sẽ bị swap hai lần và trở về vị trí cũ.

## 3. Reverse each row

Sau transpose, đảo mỗi row bằng two pointers. Đây cũng là in-place.

## 4. Why it works

Original coordinate `(r,c)` sau transpose thành `(c,r)`. Reverse row biến column index `r` thành `n-1-r`, nên final coordinate là:

```text
(c, n - 1 - r)
```

Đó chính là coordinate transform của rotation clockwise 90°.

## 5. Optimal Java solution

```java
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
```

## 6. Correctness

Transpose đưa mọi value từ `(r,c)` tới `(c,r)`. Row reversal sau đó đưa nó tới `(c,n-1-r)`. Vì mỗi original coordinate được map bijectively tới đúng rotated coordinate, toàn bộ matrix sau hai phép biến đổi bằng rotation yêu cầu.

## 7. Complexity

Cả transpose và row reversal xử lý `O(n²)` cells/swaps:

```text
Time: O(n²)
Extra space: O(1)
```

## 8. Common mistakes

- Dùng ma trận mới, vi phạm in-place.
- Transpose toàn bộ hai phía diagonal và swap hai lần.
- Reverse columns thay vì rows (cho rotation khác).
- Nhầm clockwise với counterclockwise.
