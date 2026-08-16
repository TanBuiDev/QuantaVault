public class TestSolution {
    public static void main(String[] args) {
        int[][] board = {
            {-1,-1,-1,-1,-1,-1}, {-1,-1,-1,-1,-1,-1}, {-1,-1,-1,-1,-1,-1},
            {-1,35,-1,-1,13,-1}, {-1,-1,-1,-1,-1,-1}, {-1,15,-1,-1,-1,-1}
        };
        check(new Solution().snakesAndLadders(board) == 4, "example 1");
        check(new Solution().snakesAndLadders(new int[][]{{-1,-1},{-1,3}}) == 1, "example 2");
        check(new Solution().snakesAndLadders(new int[][]{{-1,4},{-1,3}}) == 1, "must not chain ladder 2->3->4");
        System.out.println("PASS 909 Snakes and Ladders");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
