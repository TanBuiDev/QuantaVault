public class TestSolution {
    public static void main(String[] args) {
        check(new Solution().canFinish(2, new int[][]{{1,0}}), "acyclic example");
        check(!new Solution().canFinish(2, new int[][]{{1,0},{0,1}}), "cycle must fail");
        check(new Solution().canFinish(3, new int[][]{}), "independent courses");
        check(new Solution().canFinish(4, new int[][]{{1,0},{2,0},{3,1},{3,2}}), "diamond DAG");
        System.out.println("PASS 207 Course Schedule");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
