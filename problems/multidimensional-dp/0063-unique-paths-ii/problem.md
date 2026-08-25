# 63. Unique Paths II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an m x n integer array `grid`. There is a robot initially located at the top-`left` corner (i.e., `grid[0]`). The robot tries to move to the bottom-`right` corner (i.e., `grid`[m - 1][n - 1]). The robot can only move either down or `right` at any point in time.
>
> **VI:** Bạn được cho một ma trận số nguyên `m x n`. Robot bắt đầu ở góc trên-trái và cần đi đến góc dưới-phải, mỗi bước chỉ được đi xuống hoặc sang phải.

> **EN:** An obstacle and space are marked as 1 or 0 respectively in `grid`. A path that the robot takes cannot include any square that is an obstacle.
>
> **VI:** Chướng ngại vật được đánh dấu bằng `1`, ô trống bằng `0`. Đường đi không được đi qua ô chướng ngại vật.

> **EN:** Return the number of possible unique paths that the robot can take to reach the bottom-`right` corner.
>
> **VI:** Trả về số đường đi khác nhau mà robot có thể dùng để đến góc dưới-phải.

> **EN:** The testcases are generated so that the answer will be less than or equal to 2 * 10^9.
>
> **VI:** Các test case được tạo sao cho đáp án không vượt quá `2 * 10^9`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
Output: 2
```

> **EN:** Explanation: There is one obstacle in the middle of the 3x3 `grid` above.
> There are two ways to reach the bottom-right corner:
> 1. Right -> Right -> Down -> Down
> 2. Down -> Down -> Right -> Right
>
> **VI:** Có một chướng ngại vật ở giữa. Có đúng hai đường hợp lệ đến đích như liệt kê.

### Example 2 / Ví dụ 2

```text
Input: obstacleGrid = [[0,1],[0,0]]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** `m == `obstacleGrid`.length`
>
> **VI:** `m` là số hàng của `obstacleGrid`.

> **EN:** `n == `obstacleGrid[i]`.length`
>
> **VI:** `n` là số cột của mỗi hàng.

> **EN:** `1 <= m, n <= 100`
>
> **VI:** `m` và `n` nằm trong khoảng từ `1` đến `100`.

> **EN:** `obstacleGrid[i][j] is 0 or 1.`
>
> **VI:** Mỗi ô là `0` hoặc `1`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/unique-paths-ii/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
