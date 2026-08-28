class Solution {
    public void gameOfLife(int[][] board) {
        int rows = board.length;
        int cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                int liveNeighbors = 0;

                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }

                        int nr = r + dr;
                        int nc = c + dc;

                        // Transitional -1 vẫn là old-live, còn 2 là old-dead.
                        // abs(value)==1 đọc được old state dù neighbor đã bị mutate trước đó.
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                                && Math.abs(board[nr][nc]) == 1) {
                            liveNeighbors++;
                        }
                    }
                }

                // -1 mã hóa live -> dead, giữ dấu vết old-live cho các cell chưa xử lý.
                if (board[r][c] == 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                    board[r][c] = -1;
                } else if (board[r][c] == 0 && liveNeighbors == 3) {
                    // 2 mã hóa dead -> live nhưng vẫn phải được neighbor khác xem là old-dead.
                    board[r][c] = 2;
                }
            }
        }

        // Sau khi mọi rule đã đọc xong old generation, chỉ còn project state
        // chuyển tiếp về bit new-state: 1/2 -> live, 0/-1 -> dead.
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                board[r][c] = board[r][c] > 0 ? 1 : 0;
            }
        }
    }
}
