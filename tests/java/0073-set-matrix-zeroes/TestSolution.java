import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{1,1,1},{1,0,1},{1,1,1}}, new int[][]{{1,0,1},{0,0,0},{1,0,1}});
        test(new int[][]{{0,1,2,0},{3,4,5,2},{1,3,1,5}}, new int[][]{{0,0,0,0},{0,4,5,0},{0,3,1,0}});
        test(new int[][]{{1,2},{3,4}}, new int[][]{{1,2},{3,4}});
        test(new int[][]{{1,0,3}}, new int[][]{{0,0,0}});
        test(new int[][]{{1},{0},{3}}, new int[][]{{0},{0},{0}});
        System.out.println("PASS 73 Set Matrix Zeroes");
    }

    private static void test(int[][] matrix, int[][] expected) {
        new Solution().setZeroes(matrix);
        if (!Arrays.deepEquals(matrix, expected)) {
            throw new AssertionError("expected=" + Arrays.deepToString(expected) + " actual=" + Arrays.deepToString(matrix));
        }
    }
}
