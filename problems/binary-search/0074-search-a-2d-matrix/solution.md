# Solution / Lời giải — 74. Search a 2D Matrix

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
