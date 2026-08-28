class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length;
        int cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int index) {
        // Once every character is consumed, the path is complete; no further
        // board position needs to be valid because the previous move matched the last char.
        if (index == word.length()) {
            return true;
        }

        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
                || board[r][c] != word.charAt(index)) {
            return false;
        }

        char original = board[r][c];

        // Mark before exploring neighbors so this cell cannot be reused within
        // the same path. The marker is safe because board contains letters only.
        board[r][c] = '#';

        boolean found = dfs(board, word, r + 1, c, index + 1)
                || dfs(board, word, r - 1, c, index + 1)
                || dfs(board, word, r, c + 1, index + 1)
                || dfs(board, word, r, c - 1, index + 1);

        // Even if short-circuit OR already found a path, restore shared board state
        // before returning so other start cells/branches see the original board.
        board[r][c] = original;
        return found;
    }
}
