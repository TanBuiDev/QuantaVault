public class TestSolution {
    public static void main(String[] args) {
        Solution solution = new Solution();

        assertEquals(true, solution.exist(new char[][]{
                {'A','B','C','E'},
                {'S','F','C','S'},
                {'A','D','E','E'}
        }, "ABCCED"));

        assertEquals(true, solution.exist(new char[][]{
                {'A','B','C','E'},
                {'S','F','C','S'},
                {'A','D','E','E'}
        }, "SEE"));

        assertEquals(false, solution.exist(new char[][]{
                {'A','B','C','E'},
                {'S','F','C','S'},
                {'A','D','E','E'}
        }, "ABCB"));

        assertEquals(true, solution.exist(new char[][]{{'a'}}, "a"));
        assertEquals(false, solution.exist(new char[][]{{'a'}}, "b"));
        assertEquals(false, solution.exist(new char[][]{{'a','a'}}, "aaa"));

        System.out.println("All tests passed for 79. Word Search");
    }

    private static void assertEquals(boolean expected, boolean actual) {
        if (expected != actual) {
            throw new AssertionError("Expected " + expected + " but got " + actual);
        }
    }
}
