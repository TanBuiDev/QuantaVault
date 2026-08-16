# 222. Count Complete Tree Nodes

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the root of a complete binary tree, return the number of nodes in the tree. Every level except possibly the last is completely filled, and nodes on the last level are as far left as possible. Design an algorithm that runs in less than `O(n)` time.
>
> **VI:** Cho root của một complete binary tree, hãy trả về số node. Mọi level trừ level cuối đều đầy; các node ở level cuối nằm về bên trái nhiều nhất có thể. Hãy thiết kế thuật toán nhanh hơn `O(n)`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [1,2,3,4,5,6]
Output: 6
```

### Example 2 / Ví dụ 2

```text
Input: root = []
Output: 0
```

### Example 3 / Ví dụ 3

```text
Input: root = [1]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[0, 5 * 10^4]`; the tree is guaranteed to be complete.
>
> **VI:** Số node nằm trong `[0, 5 * 10^4]`; tree được đảm bảo là complete.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/count-complete-tree-nodes/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
