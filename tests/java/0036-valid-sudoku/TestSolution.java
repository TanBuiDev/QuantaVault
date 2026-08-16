public class TestSolution {
    public static void main(String[] args) {
        test(validBoard(), true);

        char[][] duplicateRow = validBoard();
        duplicateRow[0][2] = '5';
        test(duplicateRow, false);

        char[][] duplicateColumn = validBoard();
        duplicateColumn[0][0] = '6';
        test(duplicateColumn, false);

        char[][] duplicateBox = validBoard();
        duplicateBox[1][1] = '9';
        test(duplicateBox, false);

        System.out.println("PASS 36 Valid Sudoku");
    }

    private static void test(char[][] board, boolean expected) {
        boolean actual = new Solution().isValidSudoku(board);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }

    private static char[][] validBoard() {
        return new char[][]{
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
    }
}
