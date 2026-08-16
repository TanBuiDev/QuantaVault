# 289. Game of Life

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** According to Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."
>
> **VI:** Theo phần mô tả trong đề, Game of Life là một cellular automaton do nhà toán học John Horton Conway đưa ra năm 1970.

> **EN:** The board is made up of an m x n grid of cells, where each cell has an initial state: live (represented by a 1) or dead (represented by a 0). Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):
>
> **VI:** Board là lưới `m x n`; mỗi cell ban đầu sống (`1`) hoặc chết (`0`) và tương tác với tám hàng xóm ngang, dọc, chéo theo bốn rule sau.

> **EN:** Any live cell with fewer than two live neighbors dies as if caused by under-population.
>
> **VI:** Cell sống có ít hơn hai hàng xóm sống sẽ chết.

> **EN:** Any live cell with two or three live neighbors lives on to the next generation.
>
> **VI:** Cell sống có hai hoặc ba hàng xóm sống tiếp tục sống.

> **EN:** Any live cell with more than three live neighbors dies, as if by over-population.
>
> **VI:** Cell sống có hơn ba hàng xóm sống sẽ chết.

> **EN:** Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
>
> **VI:** Cell chết có đúng ba hàng xóm sống sẽ trở thành sống.

> **EN:** The next state of the board is determined by applying the above rules simultaneously to every cell in the current state of the m x n grid board. In this process, births and deaths occur simultaneously.
>
> **VI:** Trạng thái thế hệ tiếp theo phải được tính **đồng thời** từ trạng thái hiện tại; birth/death không được ảnh hưởng tới việc tính các cell khác trong cùng generation.

> **EN:** Given the current state of the board, update the board to reflect its next state.
>
> **VI:** Hãy cập nhật trực tiếp board sang trạng thái thế hệ tiếp theo.

> **EN:** Note that you do not need to return anything.
>
> **VI:** Không cần trả về giá trị.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
```

### Example 2 / Ví dụ 2

```text
Input: board = [[1,1],[1,0]]
Output: [[1,1],[1,1]]
```

## Constraints / Ràng buộc

> **EN:** `m == board.length`
>
> **VI:** `m` là số hàng.

> **EN:** `n == board[i].length`
>
> **VI:** `n` là số cột.

> **EN:** `1 <= m, n <= 25`
>
> **VI:** `1 <= m,n <= 25`.

> **EN:** `board[i][j] is 0 or 1.`
>
> **VI:** Mỗi cell là `0` hoặc `1`.

## Follow up / Mở rộng

> **EN:** Could you solve it in-place? Remember that the board needs to be updated simultaneously: You cannot update some cells first and then use their updated values to update other cells.
>
> **VI:** Có thể giải in-place trong khi vẫn bảo đảm mọi cell được tính từ old state không?

> **EN:** In this question, we represent the board using a 2D array. In principle, the board is infinite, which would cause problems when the active area encroaches upon the border of the array (i.e., live cells reach the border). How would you address these problems?
>
> **VI:** Nếu mô hình board vô hạn và active region chạm biên representation hiện tại, bạn sẽ thiết kế storage thế nào?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/game-of-life/

English wording preserved from `raw/top-interview-150/Matrix.txt` (blob `55ea154b7c8a5877a1262dbe14b4de5fe5502273`).
