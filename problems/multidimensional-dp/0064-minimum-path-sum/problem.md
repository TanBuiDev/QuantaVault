# 64. Minimum Path Sum

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a m x n `grid` filled with non-negative numbers, find a path from top `left` to bottom `right`, which minimizes the sum of all numbers along its path.
>
> **VI:** Cho một lưới `m x n` chứa các số không âm, hãy tìm đường đi từ góc trên-trái đến góc dưới-phải sao cho tổng các số trên đường đi là nhỏ nhất.

> **EN:** Note: You can only move either down or `right` at any point in time.
>
> **VI:** Lưu ý: Ở mỗi bước chỉ được đi xuống hoặc sang phải.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
```

> **EN:** Explanation: Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum.
>
> **VI:** Đường `1 → 3 → 1 → 1 → 1` cho tổng nhỏ nhất là `7`.

### Example 2 / Ví dụ 2

```text
Input: grid = [[1,2,3],[4,5,6]]
Output: 12
```

## Constraints / Ràng buộc

> **EN:** `m == `grid`.length`
>
> **VI:** `m` là số hàng của `grid`.

> **EN:** `n == `grid[i]`.length`
>
> **VI:** `n` là số cột của mỗi hàng.

> **EN:** `1 <= m, n <= 200`
>
> **VI:** `1 <= m, n <= 200`

> **EN:** `0 <= `grid[i]` <= 200`
>
> **VI:** Mỗi giá trị trong lưới nằm từ `0` đến `200`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/minimum-path-sum/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
