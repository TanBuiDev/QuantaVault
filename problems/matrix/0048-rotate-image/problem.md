# 48. Rotate Image

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an n x n 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise).
>
> **VI:** Cho ma trận vuông `n x n` biểu diễn một ảnh, hãy xoay ảnh `90` độ theo chiều kim đồng hồ.

> **EN:** You have to rotate the image in-place, which means you have to modify the input 2D `matrix` directly. DO NOT allocate another 2D `matrix` and do the rotation.
>
> **VI:** Phải xoay **in-place**, tức sửa trực tiếp ma trận đầu vào. Không được cấp phát một ma trận 2D khác để thực hiện phép xoay.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
```

### Example 2 / Ví dụ 2

```text
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

## Constraints / Ràng buộc

> **EN:** `n == `matrix`.length == `matrix[i]`.length`
>
> **VI:** Ma trận là hình vuông `n x n`.

> **EN:** `1 <= n <= 20`
>
> **VI:** `1 <= n <= 20`.

> **EN:** `-1000 <= `matrix[i]` <= 1000`
>
> **VI:** Mỗi phần tử nằm trong `[-1000,1000]`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/rotate-image/

English wording preserved from `raw/top-interview-150/Matrix.txt` (blob `55ea154b7c8a5877a1262dbe14b4de5fe5502273`).
