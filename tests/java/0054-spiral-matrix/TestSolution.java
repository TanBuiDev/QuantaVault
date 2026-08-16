import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{1,2,3},{4,5,6},{7,8,9}}, Arrays.asList(1,2,3,6,9,8,7,4,5));
        test(new int[][]{{1,2,3,4},{5,6,7,8},{9,10,11,12}}, Arrays.asList(1,2,3,4,8,12,11,10,9,5,6,7));
        test(new int[][]{{1,2,3,4}}, Arrays.asList(1,2,3,4));
        test(new int[][]{{1},{2},{3}}, Arrays.asList(1,2,3));
        test(new int[][]{{42}}, Arrays.asList(42));
        System.out.println("PASS 54 Spiral Matrix");
    }

    private static void test(int[][] matrix, List<Integer> expected) {
        List<Integer> actual = new Solution().spiralOrder(matrix);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
