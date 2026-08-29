# Solution / Lời giải — 200. Number of Islands

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Number of Islands đếm connected components của cells '1' theo 4 hướng. Mỗi khi scan gặp một land chưa thăm, ta vừa tìm được một island mới; flood-fill sẽ tiêu thụ toàn bộ component đó.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** So từng land pair để group là không cần thiết. Grid adjacency cho DFS/BFS trực tiếp; mark visited bằng đổi '1' thành '0' có thể tránh visited matrix nếu input được phép mutate.

**State / invariant / data structure cần hiểu trước code.** Outer scan invariant: mọi land trước vị trí hiện tại đã thuộc một island đã đếm và được mark. Khi gặp '1', count++ rồi DFS mark tất cả cells reachable từ nó nên island đó không bao giờ được đếm lại.

**Dry run mental theo implementation.** Dry run hai cụm land tách nhau: cell đầu cụm1 trigger count1 và flood toàn cụm; các cell còn lại của cụm1 khi scan đã là0. Gặp cell đầu cụm2 trigger count2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tăng count cho từng land cell hoặc dùng diagonal adjacency sai. Khi nào dùng: count connected components trên grid = scan + flood-fill mỗi unvisited component root.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
