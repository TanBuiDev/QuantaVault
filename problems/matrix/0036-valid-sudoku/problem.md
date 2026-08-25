# 36. Valid Sudoku

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Determine if a 9 x 9 Sudoku `board` is valid. Only the filled cells need to be validated according to the following rules:
>
> **VI:** Xác định một bảng Sudoku `9 x 9` có hợp lệ hay không. Chỉ các ô đã điền cần được kiểm tra theo các quy tắc sau.

> **EN:** Each row must contain the digits 1-9 without repetition.
>
> **VI:** Mỗi hàng không được lặp các chữ số `1-9`.

> **EN:** Each column must contain the digits 1-9 without repetition.
>
> **VI:** Mỗi cột không được lặp các chữ số `1-9`.

> **EN:** Each of the nine 3 x 3 sub-boxes of the `grid` must contain the digits 1-9 without repetition.
>
> **VI:** Mỗi một trong chín sub-box `3 x 3` không được lặp các chữ số `1-9`.

## Note / Lưu ý

> **EN:** A Sudoku `board` (partially filled) could be valid but is not necessarily solvable.
>
> **VI:** Một bảng Sudoku mới điền một phần có thể hợp lệ nhưng chưa chắc giải được.

> **EN:** Only the filled cells need to be validated according to the mentioned rules.
>
> **VI:** Chỉ các ô đã điền mới cần được kiểm tra theo các quy tắc trên.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: board =
[["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]]
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: board =
[["8","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]]
Output: false
```

> **EN:** Explanation: Same as Example 1, except with the 5 in the top `left` corner being modified to 8. Since there are two 8's in the top `left` 3x3 sub-box, it is invalid.
>
> **VI:** Giống Ví dụ 1 nhưng ô góc trên trái đổi từ `5` thành `8`. Khi đó sub-box `3 x 3` góc trên trái có hai số `8`, nên bảng không hợp lệ.

## Constraints / Ràng buộc

> **EN:** `board.length == 9`
>
> **VI:** `board.length == 9`.

> **EN:** `board[i].length == 9`
>
> **VI:** Mỗi hàng có đúng `9` ô.

> **EN:** `board[i][j] is a digit 1-9 or '.'.`
>
> **VI:** Mỗi ô là chữ số `1-9` hoặc `'.'`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/valid-sudoku/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Matrix.txt
blob SHA: 55ea154b7c8a5877a1262dbe14b4de5fe5502273
```
