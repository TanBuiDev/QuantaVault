# Solution / Lời giải — 909. Snakes and Ladders

## 1. Core idea

Mỗi square là state, một die roll là một unweighted transition. BFS tối thiểu hóa số roll; transition phải mô phỏng đúng zigzag label và tối đa một snake/ladder jump.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class Solution {
    public int snakesAndLadders(int[][] board) {
        int n = board.length, target = n * n;
        boolean[] seen = new boolean[target + 1];
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(1);
        seen[1] = true;

        // Một BFS level tương ứng chính xác một lần gieo xúc xắc.
        int moves = 0;

        while (!queue.isEmpty()) {
            for (int size = queue.size(); size > 0; size--) {
                int current = queue.poll();
                if (current == target) return moves;

                for (int next = current + 1; next <= Math.min(current + 6, target); next++) {
                    int[] cell = cell(next, n);

                    // Mỗi roll áp dụng tối đa đúng MỘT snake/ladder tại landing square;
                    // không tiếp tục chain dù destination cũng có snake/ladder.
                    int destination = board[cell[0]][cell[1]] == -1 ? next : board[cell[0]][cell[1]];

                    // State thật sau một move là destination sau jump. Mark pre-jump
                    // square sẽ không ngăn việc xử lý trùng cùng board state.
                    if (!seen[destination]) {
                        seen[destination] = true;
                        queue.offer(destination);
                    }
                }
            }
            moves++;
        }
        return -1;
    }

    private int[] cell(int square, int n) {
        int index = square - 1;
        int rowFromBottom = index / n;
        int col = index % n;
        int row = n - 1 - rowFromBottom;

        // Labels chạy boustrophedon: row 0 tính từ đáy đi trái->phải,
        // row 1 đi phải->trái, rồi luân phiên tiếp.
        if ((rowFromBottom & 1) == 1) col = n - 1 - col;
        return new int[]{row, col};
    }
}
```

## 3. Correctness

Mỗi edge của implicit graph mô phỏng đúng một die roll và jump bắt buộc. BFS khám phá mọi state trong `k` rolls trước `k+1`, nên lần đầu tới `n²` là minimum moves. `seen` áp dụng trên destination thật sau jump.

## 4. Complexity

Có `n²` states, mỗi state tối đa 6 transitions: `O(n²)` time và `O(n²)` space.
