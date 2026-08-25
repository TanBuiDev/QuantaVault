# 100. Same Tree

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.
>
> **VI:** Cho root của hai binary tree `p` và `q`. Hãy kiểm tra hai cây có giống nhau hay không.

> **EN:** Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.
>
> **VI:** Hai binary tree được xem là giống nhau khi có cấu trúc hoàn toàn giống nhau và các node tương ứng có cùng giá trị.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: p = [1,2,3], q = [1,2,3]
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: p = [1,2], q = [1,null,2]
Output: false
```

### Example 3 / Ví dụ 3

```text
Input: p = [1,2,1], q = [1,1,2]
Output: false
```

## Constraints / Ràng buộc

> **EN:** The number of nodes in `both` trees is in the range [0, 100].
>
> **VI:** Số node trong mỗi cây nằm trong `[0, 100]`.

> **EN:** -10^4 <= `Node`.val <= 10^4
>
> **VI:** `Node.val` nằm trong `[-10^4, 10^4]`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/same-tree/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
