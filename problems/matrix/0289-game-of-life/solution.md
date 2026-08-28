# 289. Game of Life — Solution

## 1. Core idea

Nếu overwrite `0/1` ngay lập tức, cell sau sẽ thấy **new state** thay vì old state. Ta encode old và new state cùng lúc:

```text
 0 = old dead, new dead
 1 = old live, new live
-1 = old live, new dead
 2 = old dead, new live
```

Nhờ đó pass đầu có thể mutate board nhưng vẫn đọc được old state.

## 2. Counting live neighbors

Old-live values là `1` và `-1`, nên:

```java
Math.abs(board[nr][nc]) == 1
```

cho biết neighbor ban đầu sống.

## 3. First pass

Với mỗi cell, đếm tám neighbor. Sau đó:

```text
old live and (neighbors < 2 or > 3) -> -1
old dead and neighbors == 3          -> 2
```

Các state không đổi giữ nguyên `0` hoặc `1`.

## 4. Second pass

Normalize:

```text
value > 0 -> 1
else      -> 0
```

Điều này map `1,2` thành live và `0,-1` thành dead.

## 5. Optimal Java solution

```java
class Solution {
    public void gameOfLife(int[][] board) {
        int rows = board.length;
        int cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                int liveNeighbors = 0;

                for (int dr = -1; dr <= 1; dr++) {
                    for (int dc = -1; dc <= 1; dc++) {
                        if (dr == 0 && dc == 0) {
                            continue;
                        }

                        int nr = r + dr;
                        int nc = c + dc;

                        // Transitional -1 vẫn là old-live, còn 2 là old-dead.
                        // abs(value)==1 đọc được old state dù neighbor đã bị mutate trước đó.
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                                && Math.abs(board[nr][nc]) == 1) {
                            liveNeighbors++;
                        }
                    }
                }

                // -1 mã hóa live -> dead, giữ dấu vết old-live cho các cell chưa xử lý.
                if (board[r][c] == 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                    board[r][c] = -1;
                } else if (board[r][c] == 0 && liveNeighbors == 3) {
                    // 2 mã hóa dead -> live nhưng vẫn phải được neighbor khác xem là old-dead.
                    board[r][c] = 2;
                }
            }
        }

        // Sau khi mọi rule đã đọc xong old generation, chỉ còn project state
        // chuyển tiếp về bit new-state: 1/2 -> live, 0/-1 -> dead.
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                board[r][c] = board[r][c] > 0 ? 1 : 0;
            }
        }
    }
}
```

## 6. Correctness

Trong pass đầu, mọi neighbor được diễn giải theo old state: `1/-1` là old-live và `0/2` là old-dead. Vì transitional value không làm mất old-state bit, mỗi cell áp dụng đúng bốn rule lên generation ban đầu dù các cell trước đã được đánh dấu transition. Pass hai chỉ project transitional states sang new-state bit, nên final board chính xác là generation kế tiếp.

## 7. Complexity

Mỗi cell xét tối đa tám neighbor:

```text
Time: O(m*n)
Extra space: O(1)
```

## 8. Infinite-board follow-up

Với board sparse vô hạn, có thể lưu chỉ live coordinates trong `HashSet` và đếm neighbor candidates trong `HashMap<Coordinate,Integer>`. Chỉ vùng gần live cells cần materialize, thay vì một ma trận vô hạn.

## 9. Common mistakes

- Overwrite `0/1` ngay trong pass đầu.
- Đếm `2` như old-live dù nó là dead→live.
- Không tính diagonal neighbors.
- Quên normalize transitional states ở pass hai.
