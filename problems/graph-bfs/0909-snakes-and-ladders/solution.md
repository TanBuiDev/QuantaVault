# Solution / Lời giải — 909. Snakes and Ladders

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Snakes and Ladders mỗi turn roll 1..6 rồi nếu landing cell có snake/ladder thì chuyển ngay tới destination. Board cells là graph states; mỗi dice roll là một edge cost1 nên cần BFS.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DP theo cell index không đơn giản vì snakes có thể đi lùi và ladders nhảy xa tạo cycles. BFS xử lý graph arbitrary; cần một hàm đổi square number 1..n² sang row/col theo boustrophedon numbering.

**State / invariant / data structure cần hiểu trước code.** Queue chứa square numbers, visited theo square sau khi áp snake/ladder. Invariant dequeue ở level moves là số dice rolls tối thiểu tới square đó; mỗi neighbor là kết quả của một roll 1..6 rồi optional jump.

**Dry run mental theo implementation.** Từ square1, generate 2..7; nếu square2 có ladder tới15 thì enqueue15 với distance1 chứ không enqueue2 như final state. BFS lần đầu chạm n² trả số rolls.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tính row/column direction sai ở hàng xen kẽ hoặc cho chain nhiều snake/ladder trong một roll. Khi nào dùng: board game minimum turns với deterministic special transitions là BFS trên board states.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
