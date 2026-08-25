# 72. Edit Distance

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.
>
> **VI:** Cho hai chuỗi `word1` và `word2`, hãy trả về số thao tác ít nhất cần để biến `word1` thành `word2`.

> **EN:** You have the following three operations permitted on a word:
>
> **VI:** Bạn được phép dùng ba thao tác sau trên một từ:

> **EN:** Insert a character
>
> **VI:** Chèn một ký tự.

> **EN:** Delete a character
>
> **VI:** Xóa một ký tự.

> **EN:** Replace a character
>
> **VI:** Thay thế một ký tự.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: word1 = "horse", word2 = "ros"
Output: 3
```

> **EN:** Explanation:
> horse -> rorse (replace 'h' with 'r')
> rorse -> rose (remove 'r')
> rose -> ros (remove 'e')
>
> **VI:** Cần 3 thao tác: thay `h` bằng `r`, xóa `r`, rồi xóa `e`.

### Example 2 / Ví dụ 2

```text
Input: word1 = "intention", word2 = "execution"
Output: 5
```

> **EN:** Explanation:
> intention -> inention (remove 't')
> inention -> enention (replace 'i' with 'e')
> enention -> exention (replace 'n' with 'x')
> exention -> exection (replace 'n' with 'c')
> exection -> execution (insert 'u')
>
> **VI:** Chuỗi biến đổi trên dùng tổng cộng 5 thao tác.

## Constraints / Ràng buộc

> **EN:** `0 <= `word1`.length, `word2`.length <= 500`
>
> **VI:** Độ dài mỗi chuỗi nằm trong khoảng từ `0` đến `500`.

> **EN:** `word1 and `word2` consist of lowercase English letters.`
>
> **VI:** Hai chuỗi chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/edit-distance/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
