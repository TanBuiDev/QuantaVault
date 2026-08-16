public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{0,0,0},{0,1,0},{0,0,0}}, 2);
        test(new int[][]{{0,1},{0,0}}, 1);
        test(new int[][]{{1}}, 0);
        test(new int[][]{{0}}, 1);
        test(new int[][]{{0,0},{0,1}}, 0);
        test(new int[][]{{0,0,0}}, 1);
        test(new int[][]{{0},{0},{0}}, 1);
        System.out.println("PASS 63 Unique Paths II");
    }

    private static void test(int[][] grid, int expected) {
        int actual = new Solution().uniquePathsWithObstacles(grid);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
