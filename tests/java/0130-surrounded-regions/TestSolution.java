import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        char[][] board = {{'X','X','X','X'},{'X','O','O','X'},{'X','X','O','X'},{'X','O','X','X'}};
        char[][] expected = {{'X','X','X','X'},{'X','X','X','X'},{'X','X','X','X'},{'X','O','X','X'}};
        new Solution().solve(board);
        check(Arrays.deepEquals(board, expected), "example mutation");

        char[][] safe = {{'O','O'},{'O','O'}};
        char[][] safeExpected = {{'O','O'},{'O','O'}};
        new Solution().solve(safe);
        check(Arrays.deepEquals(safe, safeExpected), "border-connected region must survive");
        System.out.println("PASS 130 Surrounded Regions");
    }

    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
