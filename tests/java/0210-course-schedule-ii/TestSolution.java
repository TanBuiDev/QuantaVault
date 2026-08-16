public class TestSolution {
    public static void main(String[] args) {
        checkValid(2, new int[][]{{1,0}}, new Solution().findOrder(2, new int[][]{{1,0}}));
        check(new Solution().findOrder(2, new int[][]{{1,0},{0,1}}).length == 0, "cycle must return empty");
        int[][] diamond = {{1,0},{2,0},{3,1},{3,2}};
        checkValid(4, diamond, new Solution().findOrder(4, diamond));
        checkValid(1, new int[][]{}, new Solution().findOrder(1, new int[][]{}));
        System.out.println("PASS 210 Course Schedule II");
    }

    private static void checkValid(int n, int[][] prerequisites, int[] order) {
        check(order.length == n, "order length mismatch");
        int[] position = new int[n];
        boolean[] seen = new boolean[n];
        for (int i = 0; i < n; i++) {
            check(order[i] >= 0 && order[i] < n && !seen[order[i]], "invalid/duplicate course");
            seen[order[i]] = true;
            position[order[i]] = i;
        }
        for (int[] p : prerequisites) check(position[p[1]] < position[p[0]], "prerequisite order violated");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
