import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{1,2,3},{4,5,6},{7,8,9}}, new int[][]{{7,4,1},{8,5,2},{9,6,3}});
        test(new int[][]{{5,1,9,11},{2,4,8,10},{13,3,6,7},{15,14,12,16}}, new int[][]{{15,13,2,5},{14,3,4,1},{12,6,8,9},{16,7,10,11}});
        test(new int[][]{{1}}, new int[][]{{1}});
        System.out.println("PASS 48 Rotate Image");
    }

    private static void test(int[][] matrix, int[][] expected) {
        new Solution().rotate(matrix);
        if (!Arrays.deepEquals(matrix, expected)) {
            throw new AssertionError("expected=" + Arrays.deepToString(expected) + " actual=" + Arrays.deepToString(matrix));
        }
    }
}
