public class TestSolution {
    public static void main(String[] args) {
        char[][] a = {{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}};
        check(new Solution().numIslands(a) == 1, "example 1");

        char[][] b = {{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}};
        check(new Solution().numIslands(b) == 3, "example 2");

        char[][] c = {{'1','0'},{'0','1'}};
        check(new Solution().numIslands(c) == 2, "diagonal land must not connect");
        System.out.println("PASS 200 Number of Islands");
    }

    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
