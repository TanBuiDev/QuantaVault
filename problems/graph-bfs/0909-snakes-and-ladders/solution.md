# Solution / Lời giải — 909. Snakes and Ladders

## 1. Core idea / Ý tưởng chính

Mỗi square là một node của unweighted graph; một move là một edge nên BFS tìm shortest path theo số roll. Với mỗi candidate `next`, đổi label sang `(row,col)`, nếu cell có snake/ladder thì destination là giá trị cell, nếu không destination là `next`. Chỉ áp dụng jump đúng một lần.

## 2. Label mapping / Ánh xạ label

Với `square-1 = index`, `rowFromBottom = index / n`, `col = index % n`. Row thực là `n-1-rowFromBottom`. Nếu `rowFromBottom` lẻ thì đảo `col = n-1-col`.

## 3. Optimal Java solution / Java tối ưu

```java
import java.util.*;

public class Solution {
    public int snakesAndLadders(int[][] board) {
        int n = board.length, target = n * n;
        boolean[] seen = new boolean[target + 1];
        Queue<Integer> queue = new ArrayDeque<>();
        queue.offer(1); seen[1] = true;
        int moves = 0;

        while (!queue.isEmpty()) {
            for (int size = queue.size(); size > 0; size--) {
                int current = queue.poll();
                if (current == target) return moves;
                for (int next = current + 1; next <= Math.min(current + 6, target); next++) {
                    int[] cell = cell(next, n);
                    int destination = board[cell[0]][cell[1]] == -1 ? next : board[cell[0]][cell[1]];
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
        if ((rowFromBottom & 1) == 1) col = n - 1 - col;
        return new int[]{row, col};
    }
}
```

## 4. Why it works / Vì sao đúng

BFS explores all states reachable in `k` rolls before any state requiring `k+1` rolls. The transition function exactly simulates one die roll plus at most one mandatory snake/ladder, so the first time `n^2` is reached uses the minimum number of rolls.

## 5. Complexity / Độ phức tạp

Có `n^2` square và mỗi square xét tối đa 6 transition: **time `O(n^2)`**, **space `O(n^2)`**.

## 6. Common mistakes / Lỗi thường gặp

- Map sai chiều row zigzag.
- Chain nhiều snake/ladder trong cùng một roll.
- Mark visited trên pre-jump square thay vì destination thực tế.
