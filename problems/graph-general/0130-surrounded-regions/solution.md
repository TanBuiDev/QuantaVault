# Solution / Lời giải — 130. Surrounded Regions

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Một O chỉ bị capture nếu vùng O của nó không chạm border. Thay vì tìm mọi vùng kín, dễ hơn là bảo vệ mọi O nối được tới border rồi flip phần O còn lại.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS từng region rồi ghi danh sách cells để biết có chạm border tạo bookkeeping lớn. Quan sát property đảo ngược: border-connected O chắc chắn sống; multi-source DFS/BFS từ border đánh dấu chúng một lần.

**State / invariant / data structure cần hiểu trước code.** Mark tạm (ví dụ #) nghĩa là O an toàn vì reachable từ border. Invariant sau flood-fill, mọi O được mark là và chỉ là cell nối với một border O; pass cuối O chưa mark phải bị X.

**Dry run mental theo implementation.** Dry run board có cụm O giữa hoàn toàn kín và một O ở border dưới: flood từ border chỉ mark cụm dưới; pass cuối flip cụm giữa thành X và restore marks về O.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là flood từ mọi O hoặc quên bốn borders. Khi nào dùng: capture/enclosed-region problems thường dễ giải từ outside/boundary vào để đánh dấu survivors.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Một region chỉ sống sót khi nối được tới biên. Flood-fill từ mọi `O` ở biên để mark safe component, rồi capture toàn bộ `O` chưa được mark.

## 2. Optimal Java solution

```java
public class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;

        // Chỉ các O nối được tới biên mới KHÔNG bị surrounded, nên ta bảo vệ
        // những component này trước thay vì cố phát hiện từng region kín.
        for (int r = 0; r < m; r++) {
            mark(board, r, 0);
            if (n > 1) mark(board, r, n - 1);
        }
        for (int c = 0; c < n; c++) {
            mark(board, 0, c);
            if (m > 1) mark(board, m - 1, c);
        }

        // O còn lại không thể chạm biên => chắc chắn bị bao kín. Marker # là
        // O an toàn đã được chứng minh, nên chỉ cần restore chúng về O.
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] == 'O') board[r][c] = 'X';
                else if (board[r][c] == '#') board[r][c] = 'O';
            }
        }
    }

    private void mark(char[][] board, int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;

        // Đổi state trước khi recurse vừa đánh dấu safe vừa đóng vai trò visited,
        // tránh quay lại cùng cell qua một cạnh khác của component.
        board[r][c] = '#';
        mark(board, r + 1, c);
        mark(board, r - 1, c);
        mark(board, r, c + 1);
        mark(board, r, c - 1);
    }
}
```

## 3. Correctness

Flood-fill đánh dấu chính xác mọi `O` thuộc component chạm biên. Vì vậy mọi `O` chưa mark không có đường 4-hướng ra biên và phải là surrounded region; đổi chúng thành `X` là đúng, còn `#` được restore.

## 4. Complexity

`O(m*n)` time; worst-case `O(m*n)` recursion stack.
