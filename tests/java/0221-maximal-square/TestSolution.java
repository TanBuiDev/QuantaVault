public class TestSolution {
    public static void main(String[] args) {
        test(new char[][]{
            {'1','0','1','0','0'},
            {'1','0','1','1','1'},
            {'1','1','1','1','1'},
            {'1','0','0','1','0'}
        }, 4);

        test(new char[][]{
            {'0','1'},
            {'1','0'}
        }, 1);

        test(new char[][]{{'0'}}, 0);
        test(new char[][]{{'1'}}, 1);

        test(new char[][]{
            {'1','1','1'},
            {'1','1','1'},
            {'1','1','1'}
        }, 9);

        test(new char[][]{
            {'1','1','1','0'},
            {'1','1','1','0'}
        }, 4);

        test(new char[][]{
            {'1','0','1','1'},
            {'1','1','1','1'},
            {'1','1','1','1'}
        }, 4);

        System.out.println("PASS 221 Maximal Square");
    }

    private static void test(char[][] matrix, int expected) {
        int actual = new Solution().maximalSquare(matrix);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
