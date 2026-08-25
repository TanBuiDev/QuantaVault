# 106. Construct Binary Tree from Inorder and Postorder Traversal

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given two integer arrays `inorder` and `postorder` where `inorder` is the `inorder` traversal of a binary tree and `postorder` is the `postorder` traversal of the same tree, construct and return the binary tree.
>
> **VI:** Cho hai mảng `inorder` và `postorder`, lần lượt là inorder traversal và postorder traversal của cùng một binary tree. Hãy dựng lại và trả về cây đó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
Output: [3,9,20,null,null,15,7]
```

### Example 2 / Ví dụ 2

```text
Input: inorder = [-1], postorder = [-1]
Output: [-1]
```

## Constraints / Ràng buộc

> **EN:** 1 <= `inorder`.length <= 3000
>
> **VI:** `1 <= inorder.length <= 3000`.

> **EN:** `postorder`.length == `inorder`.length
>
> **VI:** `postorder.length == inorder.length`.

> **EN:** -3000 <= `inorder[i]`, `postorder[i]` <= 3000
>
> **VI:** Các value nằm trong `[-3000, 3000]`.

> **EN:** `inorder` and `postorder` consist of unique values. Each value of `postorder` also appears in `inorder`. `inorder` is guaranteed to be the `inorder` traversal of the tree. `postorder` is guaranteed to be the `postorder` traversal of the tree.
>
> **VI:** Các value là unique; hai traversal chứa cùng các value và được đảm bảo hợp lệ cho cùng một tree.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
