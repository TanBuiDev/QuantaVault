# Solution / Lời giải — 74. Search a 2D Matrix

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Matrix có rows sorted và first của row sau lớn hơn last row trước, nên nếu tưởng tượng nối các rows lại ta có một sorted array dài m*n mà không cần copy dữ liệu.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Binary search từng row hoặc scan O(m+n) được, nhưng stronger global ordering cho phép một binary search O(log(mn)). Index ảo idx map sang row=idx/n, col=idx%n.

**State / invariant / data structure cần hiểu trước code.** left/right là indices trên flattened sorted order. Invariant target nếu tồn tại nằm trong virtual interval; value(mid)=matrix[mid/n][mid%n] cho comparison giống array bình thường.

**Dry run mental theo implementation.** Dry run matrix 3x4, virtual indices0..11. mid5 map row1,col1; nếu value11<target16 thì left=6, không cần biết rows vật lý khi search.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chia/mod theo số rows thay vì columns. Khi nào dùng: multidimensional storage có global sorted linearization có thể binary-search qua index mapping mà không flatten thật.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

The matrix is globally sorted in row-major order, so treat it as a virtual sorted array of length `rows * cols` and binary-search by mapping `index -> [index/cols][index%cols]`.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

The virtual row-major sequence is sorted by the problem constraints, and the index mapping is bijective over all cells. Ordinary binary search therefore finds the target iff it appears in the matrix.

## 4. Complexity

`O(log(rows*cols))` time, `O(1)` space.
