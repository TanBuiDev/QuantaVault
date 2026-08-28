class Solution {
    public boolean isValidSudoku(char[][] board) {
        boolean[][] rows = new boolean[9][9];
        boolean[][] cols = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char ch = board[r][c];
                if (ch == '.') {
                    continue;
                }

                // '1'..'9' được nén thành 0..8 để dùng trực tiếp làm index boolean.
                int digit = ch - '1';

                // r/3 và c/3 cho tọa độ box 0..2; flatten theo row-major
                // tạo đúng một id 0..8 cho mỗi sub-box 3x3.
                int box = (r / 3) * 3 + (c / 3);

                // Một occurrence trước đó trong bất kỳ phạm vi nào đã đủ chứng minh
                // board invalid; không cần đợi scan hết ba cấu trúc.
                if (rows[r][digit] || cols[c][digit] || boxes[box][digit]) {
                    return false;
                }

                rows[r][digit] = true;
                cols[c][digit] = true;
                boxes[box][digit] = true;
            }
        }

        return true;
    }
}
