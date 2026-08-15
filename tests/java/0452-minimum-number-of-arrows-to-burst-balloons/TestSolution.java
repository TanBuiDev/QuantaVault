public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{10,16},{2,8},{1,6},{7,12}}, 2);
        test(new int[][]{{1,2},{3,4},{5,6},{7,8}}, 4);
        test(new int[][]{{1,2},{2,3},{3,4},{4,5}}, 2);
        test(new int[][]{{1,10},{2,9},{3,8},{4,7}}, 1);
        test(new int[][]{{5,6}}, 1);
        test(new int[][]{{-10,-5},{-6,-1},{0,2}}, 2);
        test(
            new int[][]{{Integer.MIN_VALUE, Integer.MIN_VALUE + 1}, {Integer.MAX_VALUE - 1, Integer.MAX_VALUE}},
            2
        );
        System.out.println("PASS 452 Minimum Number of Arrows to Burst Balloons");
    }

    private static void test(int[][] points, int expected) {
        int actual = new Solution().findMinArrowShots(points);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
