# Solution / Lời giải — 52. N-Queens II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** N-Queens cần đặt đúng một queen mỗi row; khi chọn column cho row hiện tại, chỉ cần biết column và hai diagonals đó đã bị queen trước chiếm chưa. Không cần đặt thử mọi ô của board.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sinh mọi board n² choices mỗi queen tạo search cực lớn. Quan sát xử lý row theo thứ tự loại luôn row conflict; sets/bitmasks cho columns, r-c diagonal và r+c diagonal prune conflict O(1).

**State / invariant / data structure cần hiểu trước code.** row là level recursion; cols, diag1, diag2 chứa lines đã occupied bởi rows trước. Invariant trước khi đặt row, các queens trong prefix rows không attack nhau; choose chỉ được phép nếu cả ba keys chưa dùng.

**Dry run mental theo implementation.** Dry run n=4: row0 chọn col1, đánh dấu col1,d=-1,s=1; row1 thử columns và bỏ ngay các conflict. Một valid branch đi [1,3,0,2], tới row4 thì count++.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tính diagonal key không nhất quán hoặc quên unmark ba sets. Khi nào dùng: board placement có one-item-per-row/column nên encode attack lines thành O(1) occupancy state để prune.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
