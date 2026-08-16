# Solution / Lời giải — 200. Number of Islands

## 1. Core idea / Ý tưởng chính

Quét toàn bộ grid. Mỗi lần gặp `'1'`, đó là một island chưa được đếm: tăng count rồi DFS flood-fill toàn component, đổi land đã thăm thành `'0'`.

## 2. Algorithm / Thuật toán

1. Duyệt mọi cell.
2. Nếu cell là `'1'`, tăng `islands`.
3. DFS từ cell đó theo 4 hướng; mọi land gặp được đổi thành `'0'`.
4. Sau khi quét hết grid, trả `islands`.

## 3. Why it works / Vì sao đúng

Mỗi island là một connected component 4 hướng. Lần đầu scan chạm component, ta count đúng một lần rồi flood-fill toàn bộ component. Sau đó không cell nào của island đó còn `'1'`, nên không thể bị count lại. Mọi island đều có ít nhất một cell được scan, nên không island nào bị bỏ sót.

## 4. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public int numIslands(char[][] grid) {
        int islands = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    sink(grid, r, c);
                }
            }
        }
        return islands;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(m*n)` vì mỗi cell land được flood-fill tối đa một lần.
- **Space:** worst-case `O(m*n)` recursion stack trên một island rất lớn.

## 6. Common mistakes / Lỗi thường gặp

- Tính diagonal là connected.
- Count mỗi land cell thay vì mỗi component.
- Không mark visited trước khi recurse và tạo vòng lặp.
