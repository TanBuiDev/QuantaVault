# Solution / Lời giải — 79. Word Search

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Word Search là một path trên grid: mỗi ký tự word phải khớp cell kế tiếp kề 4 hướng và một cell không được dùng hai lần trong cùng path. Mỗi cell có thể là điểm bắt đầu.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Copy visited matrix cho mỗi branch tốn memory. Quan sát ta có thể mark cell hiện tại visited tạm thời, recurse 4 neighbors rồi restore; mismatch ký tự prune ngay trước khi branching.

**State / invariant / data structure cần hiểu trước code.** State là (r,c,index) cùng marks của cells trong path. Invariant cells marked chính xác path đã dùng và board[r][c] phải match word[index] trước khi đi tiếp; index cuối match thì success.

**Dry run mental theo implementation.** Dry run ABCCED trên board mẫu: start A, đi B,C,C,E,D theo neighbors; mỗi bước mark cell. Nếu một branch dead-end, restore cell trước khi thử hướng sibling để không khóa nhầm đường khác.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cho phép reuse cell hoặc restore quá sớm. Khi nào dùng: tìm sequence trong grid với path-local visited là DFS backtracking mark → explore → unmark.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Start DFS from every cell. A state matches `word[index]`, marks the cell as temporarily used, explores four neighbors, then restores it so sibling paths remain independent.

## 2. Optimal Java solution

```java
class Solution {
    public boolean exist(char[][] board, String word) {
        int rows = board.length;
        int cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int index) {
        // Once every character is consumed, the path is complete; no further
        // board position needs to be valid because the previous move matched the last char.
        if (index == word.length()) {
            return true;
        }

        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
                || board[r][c] != word.charAt(index)) {
            return false;
        }

        char original = board[r][c];

        // Mark before exploring neighbors so this cell cannot be reused within
        // the same path. The marker is safe because board contains letters only.
        board[r][c] = '#';

        boolean found = dfs(board, word, r + 1, c, index + 1)
                || dfs(board, word, r - 1, c, index + 1)
                || dfs(board, word, r, c + 1, index + 1)
                || dfs(board, word, r, c - 1, index + 1);

        // Even if short-circuit OR already found a path, restore shared board state
        // before returning so other start cells/branches see the original board.
        board[r][c] = original;
        return found;
    }
}
```

## 3. Correctness

The recursion consumes one word character per adjacent board cell and the temporary marker prevents cell reuse in one path. Restoring after each branch preserves all alternatives. Therefore a `true` result corresponds exactly to a valid board path spelling the word.

## 4. Complexity

Worst case `O(m*n*4^L)` search for word length `L`, with `O(L)` recursion depth.
