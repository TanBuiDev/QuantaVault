public class TestSolution {
    public static void main(String[] args) {
        test(new int[][]{{1,1},{2,2},{3,3}}, 3);
        test(new int[][]{{1,1},{3,2},{5,3},{4,1},{2,3},{1,4}}, 4);
        test(new int[][]{{2,1},{2,3},{2,5},{4,5}}, 3);
        test(new int[][]{{0,0},{1,-1},{2,-2},{2,0}}, 3);
        test(new int[][]{{0,0}}, 1);
        test(new int[][]{{0,0},{1,0},{2,0},{3,1}}, 3);
        System.out.println("PASS 149 Max Points on a Line");
    }

    private static void test(int[][] points, int expected) {
        int actual = new Solution().maxPoints(points);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
