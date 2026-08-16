# 173. Binary Search Tree Iterator

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Implement the `BSTIterator` class for the inorder traversal of a binary search tree. `BSTIterator(TreeNode root)` initializes the iterator before the smallest element. `next()` advances and returns the next value. `hasNext()` returns whether another value exists. Calls to `next()` are guaranteed to be valid.
>
> **VI:** Hãy cài đặt class `BSTIterator` để duyệt inorder một BST. Constructor nhận `root` và đặt iterator trước phần tử nhỏ nhất. `next()` tiến tới phần tử kế tiếp và trả value; `hasNext()` cho biết còn phần tử kế tiếp hay không. Mọi lần gọi `next()` đều được đảm bảo hợp lệ.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input:
["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
[[[7,3,15,null,null,9,20]], [], [], [], [], [], [], [], [], []]

Output:
[null, 3, 7, true, 9, true, 15, true, 20, false]
```

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[1, 10^5]` and `0 <= Node.val <= 10^6`.
>
> **VI:** Số node nằm trong `[1, 10^5]` và `0 <= Node.val <= 10^6`.

> **EN:** At most `10^5` calls are made to `hasNext()` and `next()`.
>
> **VI:** Có tối đa `10^5` lần gọi `hasNext()` và `next()`.

## Follow-up / Câu hỏi thêm

> **EN:** Can `next()` and `hasNext()` run in average `O(1)` time while using `O(h)` memory?
>
> **VI:** Có thể đạt average `O(1)` cho `next()`/`hasNext()` với `O(h)` memory không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/binary-search-tree-iterator/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
