# 73. Set Matrix Zeroes

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.
>
> **VI:** Cho ma trận số nguyên `m x n`, nếu một phần tử bằng `0`, hãy đặt toàn bộ hàng và cột chứa nó thành `0`.

> **EN:** You must do it in place.
>
> **VI:** Phải thực hiện in-place.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
```

### Example 2 / Ví dụ 2

```text
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

## Constraints / Ràng buộc

> **EN:** `m == matrix.length`
>
> **VI:** `m` là số hàng.

> **EN:** `n == matrix[0].length`
>
> **VI:** `n` là số cột.

> **EN:** `1 <= m, n <= 200`
>
> **VI:** `1 <= m,n <= 200`.

> **EN:** `-231 <= matrix[i][j] <= 231 - 1`
>
> **VI:** Giá trị nằm trong giới hạn số nguyên đề cho.

## Follow up / Mở rộng

> **EN:** A straightforward solution using O(mn) space is probably a bad idea.
>
> **VI:** Dùng `O(mn)` bộ nhớ phụ là cách không tốt.

> **EN:** A simple improvement uses O(m + n) space, but still not the best solution.
>
> **VI:** Có thể cải thiện xuống `O(m+n)`, nhưng vẫn chưa tối ưu.

> **EN:** Could you devise a constant space solution?
>
> **VI:** Có thể giải bằng constant extra space không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/set-matrix-zeroes/

English wording preserved from `raw/top-interview-150/Matrix.txt` (blob `55ea154b7c8a5877a1262dbe14b4de5fe5502273`).
