# Solution / Lời giải — 130. Surrounded Regions

## 1. Core idea / Ý tưởng chính

Một region không bị surrounded khi và chỉ khi nó nối được tới biên. Vì vậy flood-fill từ mọi `O` ở biên để mark toàn bộ safe region bằng `#`. Sau đó scan board: `O` chưa mark phải bị capture thành `X`; `#` được restore về `O`.

## 2. Algorithm / Thuật toán

1. Flood-fill từ các cell `O` ở bốn cạnh và đổi chúng thành `#`.
2. Quét toàn board:
   - `O -> X`;
   - `# -> O`.
3. Board được mutate in-place, không return value.

## 3. Why it works / Vì sao đúng

Mọi region chạm biên được flood-fill và mark safe. Một `O` không được mark thì component của nó không chứa cell biên, nên theo định nghĩa nó bị surrounded và phải capture. Vì flood-fill chỉ đi 4 hướng qua `O`, không cell safe nào bị lẫn với region kín.

## 4. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++) {
            mark(board, r, 0);
            if (n > 1) mark(board, r, n - 1);
        }
        for (int c = 0; c < n; c++) {
            mark(board, 0, c);
            if (m > 1) mark(board, m - 1, c);
        }
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (board[r][c] == 'O') board[r][c] = 'X';
                else if (board[r][c] == '#') board[r][c] = 'O';
            }
        }
    }

    private void mark(char[][] board, int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;
        board[r][c] = '#';
        mark(board, r + 1, c);
        mark(board, r - 1, c);
        mark(board, r, c + 1);
        mark(board, r, c - 1);
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(m*n)`.
- **Space:** worst-case `O(m*n)` recursion stack.

## 6. Common mistakes / Lỗi thường gặp

- Flood-fill region kín thay vì bảo vệ region biên.
- Capture `O` trên biên.
- Quên restore marker an toàn.
