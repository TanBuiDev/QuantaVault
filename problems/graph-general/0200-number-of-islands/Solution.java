public class Solution {
    public int numIslands(char[][] grid) {
        int islands = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    // Một cell land còn nguyên tại thời điểm scan nghĩa là component
                    // của nó chưa từng được flood-fill => đây là island mới đúng 1 lần.
                    islands++;
                    sink(grid, r, c);
                }
            }
        }
        return islands;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;

        // Mutate 1 -> 0 trước recursion để cell trở thành visited ngay lập tức;
        // toàn bộ component sẽ biến mất khỏi các lần scan sau.
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}
