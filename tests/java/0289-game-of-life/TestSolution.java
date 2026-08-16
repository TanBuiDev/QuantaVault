import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{0,1,0},{0,0,1},{1,1,1},{0,0,0}}, new int[][]{{0,0,0},{1,0,1},{0,1,1},{0,1,0}});
        test(new int[][]{{1,1},{1,0}}, new int[][]{{1,1},{1,1}});
        test(new int[][]{{1}}, new int[][]{{0}});
        test(new int[][]{{0}}, new int[][]{{0}});
        System.out.println("PASS 289 Game of Life");
    }

    private static void test(int[][] board, int[][] expected) {
        new Solution().gameOfLife(board);
        if (!Arrays.deepEquals(board, expected)) {
            throw new AssertionError("expected=" + Arrays.deepToString(expected) + " actual=" + Arrays.deepToString(board));
        }
    }
}
