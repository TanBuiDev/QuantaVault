# Solution / Lời giải — 200. Number of Islands

## 1. Core idea

Mỗi `'1'` còn tồn tại khi scan là đầu tiên ta gặp một connected component mới. Count nó rồi flood-fill toàn component thành `'0'` để không thể đếm lại.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

Mỗi island 4-connected được count tại cell đầu tiên gặp trong scan, sau đó toàn island bị sink. Vì thế mỗi component được count đúng một lần và không component nào bị bỏ sót.

## 4. Complexity

`O(m*n)` time; worst-case `O(m*n)` recursion stack.
