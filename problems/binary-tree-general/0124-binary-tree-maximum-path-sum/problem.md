# 124. Binary Tree Maximum Path Sum

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** A path in a binary tree is a sequence of nodes where each adjacent pair is connected by an edge. A node can appear at most once, and the path does not need to pass through the `root`. The path sum is the sum of the node values on that path. Given the `root`, return the maximum path sum of any non-empty path.
>
> **VI:** Một path trong binary tree là chuỗi node mà mỗi cặp kề nhau được nối bởi một edge. Mỗi node chỉ được xuất hiện tối đa một lần và path không nhất thiết đi qua root. Path sum là tổng value của các node trên path. Hãy trả về maximum path sum của mọi path không rỗng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [1,2,3]
Output: 6
```

The optimal path is `2 -> 1 -> 3`.

### Example 2 / Ví dụ 2

```text
Input: root = [-10,9,20,null,null,15,7]
Output: 42
```

The optimal path is `15 -> 20 -> 7`.

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[1, 3 * 10^4]`.
>
> **VI:** Số node nằm trong `[1, 3 * 10^4]`.

> **EN:** `-1000 <= `Node`.val <= 1000`
>
> **VI:** `-1000 <= Node.val <= 1000`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/binary-tree-maximum-path-sum/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
