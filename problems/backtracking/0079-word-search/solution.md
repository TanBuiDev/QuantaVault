# Solution / Lời giải

## Approach / Cách tiếp cận
Use DFS with backtracking from every board cell. A recursive state `(r, c, i)` means we are trying to match `word[i]` at `board[r][c]`. If the character matches, temporarily mark the cell as unavailable, recursively search the four neighbors for `i + 1`, then restore the original character before returning.

Dùng DFS kết hợp backtracking từ mọi ô. Trạng thái `(r, c, i)` biểu diễn việc cần khớp `word[i]` tại `board[r][c]`. Khi ký tự khớp, tạm đánh dấu ô đang dùng, tìm bốn ô lân cận cho ký tự tiếp theo, rồi khôi phục ô trước khi trả về.

## Why it works / Vì sao đúng
Every valid construction of the word corresponds to a path of horizontally or vertically adjacent cells without repeating a cell. The algorithm tries every possible starting cell and, from each matching prefix, explores all legal next cells. Marking the current cell prevents reuse within the same path; restoring it allows the cell to participate in other candidate paths. Therefore every valid path is considered and every invalid path is rejected.

Mọi cách tạo từ hợp lệ tương ứng với một đường đi qua các ô kề ngang/dọc và không lặp ô. Thuật toán thử mọi điểm bắt đầu và mọi bước tiếp theo hợp lệ. Việc đánh dấu ngăn tái sử dụng ô trong cùng đường đi, còn khôi phục cho phép ô đó được dùng trong các đường đi khác. Vì vậy không bỏ sót nghiệm hợp lệ và không chấp nhận đường đi sai.

## Complexity / Độ phức tạp
Let `L = word.length`.

- Time: `O(m * n * 3^L)` in the usual bound after the first step, because a path cannot immediately return to the cell it just used.
- Space: `O(L)` recursion depth, excluding the input board.

## Java
See `Solution.java` for the implementation.
