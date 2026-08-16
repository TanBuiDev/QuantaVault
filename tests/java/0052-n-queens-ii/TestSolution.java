public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        assertEquals(1, solution.totalNQueens(1));
        assertEquals(0, solution.totalNQueens(2));
        assertEquals(0, solution.totalNQueens(3));
        assertEquals(2, solution.totalNQueens(4));
        assertEquals(10, solution.totalNQueens(5));
        System.out.println("All tests passed for 52. N-Queens II");
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
