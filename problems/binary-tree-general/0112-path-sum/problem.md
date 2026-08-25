# 112. Path Sum

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a `root`-to-leaf path such that adding up all the values along the path equals `targetSum`.
>
> **VI:** Cho root của một binary tree và số nguyên `targetSum`. Trả về `true` nếu tồn tại một path từ root tới leaf sao cho tổng value trên path bằng `targetSum`.

> **EN:** A leaf is a node with no children.
>
> **VI:** Leaf là node không có child.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: root = [1,2,3], targetSum = 5
Output: false
```

The two root-to-leaf sums are `3` and `4`, so neither equals `5`.

### Example 3 / Ví dụ 3

```text
Input: root = [], targetSum = 0
Output: false
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in the tree is in the range `[0, 5000]`.
>
> **VI:** Số node của tree nằm trong khoảng `[0, 5000]`.

> **EN:** `-1000 <= `Node`.val <= 1000`
>
> **VI:** `-1000 <= Node.val <= 1000`.

> **EN:** `-1000 <= `targetSum` <= 1000`
>
> **VI:** `-1000 <= targetSum <= 1000`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/path-sum/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
