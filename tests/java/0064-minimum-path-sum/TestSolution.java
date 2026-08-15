public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{1,3,1},{1,5,1},{4,2,1}}, 7);
        test(new int[][]{{1,2,3},{4,5,6}}, 12);
        test(new int[][]{{5}}, 5);
        test(new int[][]{{0,0},{0,0}}, 0);
        test(new int[][]{{1,2,3}}, 6);
        test(new int[][]{{1},{2},{3}}, 6);
        System.out.println("PASS 64 Minimum Path Sum");
    }

    private static void test(int[][] grid, int expected) {
        int actual = new Solution().minPathSum(grid);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
