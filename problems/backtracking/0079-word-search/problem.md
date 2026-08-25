# 79. Word Search

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given an `m x n` `grid` of characters `board` and a string `word`, return `true` if `word` exists in the `grid`.
>
> **VI:** Cho lưới ký tự `board` kích thước `m x n` và chuỗi `word`, hãy trả về `true` nếu `word` tồn tại trong lưới.

> **EN:** The `word` can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
>
> **VI:** Từ được tạo bởi các ô kề nhau theo chiều ngang hoặc dọc. Mỗi ô chỉ được sử dụng tối đa một lần trong một đường tìm kiếm.

## Examples / Ví dụ
```text
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true

Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true

Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
```

## Constraints / Ràng buộc
> **EN:** `m == `board`.length`, `n = `board[i]`.length`, `1 <= m, n <= 6`, `1 <= `word`.length <= 15`, and `board` and `word` consist only of lowercase and uppercase English letters.
>
> **VI:** Kích thước mỗi chiều từ 1 đến 6, độ dài `word` từ 1 đến 15, và dữ liệu chỉ gồm chữ cái tiếng Anh viết hoa hoặc viết thường.

## Follow-up / Mở rộng
> **EN:** Could you use search pruning to make your solution faster with a larger `board`?
>
> **VI:** Có thể cắt tỉa không gian tìm kiếm để tăng tốc khi bảng lớn hơn không?

## Source / Nguồn
LeetCode: https://leetcode.com/problems/word-search/

English wording preserved from `raw/top-interview-150/Backtracking.txt` (blob `7f95978509c050faa1cfe1181871c15bf3b09c0e`).
