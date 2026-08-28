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
