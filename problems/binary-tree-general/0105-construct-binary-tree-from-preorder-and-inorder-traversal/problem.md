# 105. Construct Binary Tree from Preorder and Inorder Traversal

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given two integer arrays `preorder` and `inorder` where `preorder` is the `preorder` traversal of a binary tree and `inorder` is the `inorder` traversal of the same tree, construct and return the binary tree.
>
> **VI:** Cho hai mảng `preorder` và `inorder`, lần lượt là preorder traversal và inorder traversal của cùng một binary tree. Hãy dựng lại và trả về cây đó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
```

### Example 2 / Ví dụ 2

```text
Input: preorder = [-1], inorder = [-1]
Output: [-1]
```

## Constraints / Ràng buộc

> **EN:** 1 <= `preorder`.length <= 3000
>
> **VI:** `1 <= preorder.length <= 3000`.

> **EN:** `inorder`.length == `preorder`.length
>
> **VI:** `inorder.length == preorder.length`.

> **EN:** -3000 <= `preorder[i]`, `inorder[i]` <= 3000
>
> **VI:** Mỗi giá trị nằm trong `[-3000, 3000]`.

> **EN:** `preorder` and `inorder` consist of unique values. Each value of `inorder` also appears in `preorder`. `preorder` is guaranteed to be the `preorder` traversal of the tree. `inorder` is guaranteed to be the `inorder` traversal of the tree.
>
> **VI:** Các value là unique; hai traversal chứa cùng các value và được đảm bảo hợp lệ cho cùng một tree.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
