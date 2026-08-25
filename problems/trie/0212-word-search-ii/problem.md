# 212. Word Search II

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given an m x n `board` of characters and a list of strings `words`, return all `words` on the `board`.
>
> **VI:** Cho một bảng ký tự kích thước `m x n` và một danh sách chuỗi `words`, hãy trả về tất cả các từ có thể tìm thấy trên bảng.

> **EN:** Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The `same` letter cell may not be used more than once in a word.
>
> **VI:** Mỗi từ phải được tạo từ các ký tự của những ô kề nhau theo thứ tự; hai ô được xem là kề nhau nếu nằm cạnh nhau theo chiều ngang hoặc dọc. Một ô không được dùng quá một lần trong cùng một từ.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
```

**VI:** Trên board tồn tại đường đi tạo được `oath` và `eat`; `pea` và `rain` không tạo được bằng các ô kề hợp lệ.

### Example 2 / Ví dụ 2

```text
Input: board = [["a","b"],["c","d"]], words = ["abcb"]
Output: []
```

**VI:** Không thể tạo `abcb` vì sẽ cần tái sử dụng một ô hoặc đi qua các ô không kề hợp lệ.

## Constraints / Ràng buộc

> **EN:** `m == `board`.length`
>
> **VI:** `m` là số hàng của board.

> **EN:** `n == `board[i]`.length`
>
> **VI:** `n` là số cột của mỗi hàng.

> **EN:** `1 <= m, n <= 12`
>
> **VI:** Board có tối đa 12 hàng và 12 cột.

> **EN:** `board[i]` is a lowercase English letter.
>
> **VI:** Mỗi ô chứa một chữ cái tiếng Anh viết thường.

> **EN:** `1 <= `words`.length <= 3 * 10^4`
>
> **VI:** Danh sách có từ 1 đến 30.000 từ.

> **EN:** `1 <= `words[i]`.length <= 10`
>
> **VI:** Mỗi từ dài từ 1 đến 10 ký tự.

> **EN:** `words[i]` consists of lowercase English letters.
>
> **VI:** Mỗi từ chỉ gồm chữ cái tiếng Anh viết thường.

> **EN:** All the strings of `words` are unique.
>
> **VI:** Mọi chuỗi trong `words` đều là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/word-search-ii/

English wording preserved from `raw/top-interview-150/Trie.txt` (blob `c758d0dd8565d28423d05652b9a060cb5844743d`).
