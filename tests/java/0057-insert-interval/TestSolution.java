import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(
            new int[][]{{1,3},{6,9}},
            new int[]{2,5},
            new int[][]{{1,5},{6,9}}
        );
        test(
            new int[][]{{1,2},{3,5},{6,7},{8,10},{12,16}},
            new int[]{4,8},
            new int[][]{{1,2},{3,10},{12,16}}
        );
        test(
            new int[][]{},
            new int[]{5,7},
            new int[][]{{5,7}}
        );
        test(
            new int[][]{{3,5},{7,9}},
            new int[]{1,2},
            new int[][]{{1,2},{3,5},{7,9}}
        );
        test(
            new int[][]{{1,2},{3,5}},
            new int[]{7,9},
            new int[][]{{1,2},{3,5},{7,9}}
        );
        test(
            new int[][]{{2,3},{5,7},{8,10}},
            new int[]{1,12},
            new int[][]{{1,12}}
        );
        test(
            new int[][]{{1,2},{5,7}},
            new int[]{2,5},
            new int[][]{{1,7}}
        );
        System.out.println("PASS 57 Insert Interval");
    }

    private static void test(int[][] intervals, int[] newInterval, int[][] expected) {
        int[][] actual = new Solution().insert(intervals, newInterval);
        if (!Arrays.deepEquals(actual, expected)) {
            throw new AssertionError(
                "expected=" + Arrays.deepToString(expected)
                    + " actual=" + Arrays.deepToString(actual)
            );
        }
    }
}
