import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(
            new int[][]{{1,3},{2,6},{8,10},{15,18}},
            new int[][]{{1,6},{8,10},{15,18}}
        );
        test(
            new int[][]{{1,4},{4,5}},
            new int[][]{{1,5}}
        );
        test(
            new int[][]{{4,7},{1,4}},
            new int[][]{{1,7}}
        );
        test(
            new int[][]{{1,10},{2,3},{4,8}},
            new int[][]{{1,10}}
        );
        test(
            new int[][]{{1,2},{4,5},{7,8}},
            new int[][]{{1,2},{4,5},{7,8}}
        );
        test(
            new int[][]{{1,4},{1,5},{1,2}},
            new int[][]{{1,5}}
        );
        test(
            new int[][]{{5,5}},
            new int[][]{{5,5}}
        );
        System.out.println("PASS 56 Merge Intervals");
    }

    private static void test(int[][] intervals, int[][] expected) {
        int[][] actual = new Solution().merge(intervals);
        if (!Arrays.deepEquals(actual, expected)) {
            throw new AssertionError(
                "expected=" + Arrays.deepToString(expected)
                    + " actual=" + Arrays.deepToString(actual)
            );
        }
    }
}
