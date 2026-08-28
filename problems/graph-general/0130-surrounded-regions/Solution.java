public class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;

        // Chỉ các O nối được tới biên mới KHÔNG bị surrounded, nên ta bảo vệ
        // những component này trước thay vì cố phát hiện từng region kín.
        for (int r = 0; r < m; r++) {
            mark(board, r, 0);
            if (n > 1) mark(board, r, n - 1);
        }
        for (int c = 0; c < n; c++) {
            mark(board, 0, c);
            if (m > 1) mark(board, m - 1, c);
        }

        // O còn lại không thể chạm biên => chắc chắn bị bao kín. Marker # là
        // O an toàn đã được chứng minh, nên chỉ cần restore chúng về O.
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] == 'O') board[r][c] = 'X';
                else if (board[r][c] == '#') board[r][c] = 'O';
            }
        }
    }

    private void mark(char[][] board, int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;

        // Đổi state trước khi recurse vừa đánh dấu safe vừa đóng vai trò visited,
        // tránh quay lại cùng cell qua một cạnh khác của component.
        board[r][c] = '#';
        mark(board, r + 1, c);
        mark(board, r - 1, c);
        mark(board, r, c + 1);
        mark(board, r, c - 1);
    }
}
