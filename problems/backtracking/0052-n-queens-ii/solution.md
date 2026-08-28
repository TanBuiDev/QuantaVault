# Solution / Lời giải — 52. N-Queens II

## 1. Core idea

Place one queen per row. Three boolean sets—column, `row-col`, and `row+col` diagonals—answer in `O(1)` whether a placement conflicts with any earlier row.

## 2. Optimal Java solution

```java
class Solution {
    public int totalNQueens(int n) {
        return search(0, n, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1]);
    }

    private int search(int row, int n, boolean[] columns, boolean[] diag1, boolean[] diag2) {
        // We place exactly one queen per row, so reaching row n means n non-attacking
        // queens have been placed and this branch contributes one complete solution.
        if (row == n) {
            return 1;
        }

        int count = 0;
        for (int col = 0; col < n; col++) {
            // Cells on the same \ diagonal share row-col; +n-1 shifts it nonnegative.
            // Cells on the same / diagonal share row+col.
            int d1 = row - col + n - 1;
            int d2 = row + col;

            if (columns[col] || diag1[d1] || diag2[d2]) {
                continue;
            }

            columns[col] = diag1[d1] = diag2[d2] = true;
            count += search(row + 1, n, columns, diag1, diag2);

            // These occupancy arrays describe only the CURRENT partial board;
            // undoing all three constraints is required before trying the next column.
            columns[col] = diag1[d1] = diag2[d2] = false;
        }
        return count;
    }
}
```

## 3. Correctness

Each row receives exactly one queen and every attempted column is accepted only if its column and both diagonals are unused. Thus every counted board is valid, and every valid board corresponds to one sequence of column choices explored by the recursion.

## 4. Complexity

Backtracking is `O(n!)`-scale in the worst search tree with `O(n)` recursion plus `O(n)` constraint arrays.
