class Solution {
    public int totalNQueens(int n) {
        return search(0, n, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1]);
    }

    private int search(int row, int n, boolean[] columns, boolean[] diag1, boolean[] diag2) {
        if (row == n) {
            return 1;
        }
        int count = 0;
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1;
            int d2 = row + col;
            if (columns[col] || diag1[d1] || diag2[d2]) {
                continue;
            }
            columns[col] = diag1[d1] = diag2[d2] = true;
            count += search(row + 1, n, columns, diag1, diag2);
            columns[col] = diag1[d1] = diag2[d2] = false;
        }
        return count;
    }
}
