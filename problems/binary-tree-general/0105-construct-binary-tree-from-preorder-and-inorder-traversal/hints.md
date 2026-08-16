# Hints / Gợi ý — 105. Construct Binary Tree from Preorder and Inorder Traversal

## Hint 1

**EN:** In preorder traversal, the first unconsumed value is always the root of the current subtree.

**VI:** Trong preorder, value chưa dùng đầu tiên luôn là root của subtree hiện tại.

## Hint 2

**EN:** The root's position in inorder splits the current subtree into its left and right parts.

**VI:** Vị trí root trong inorder chia subtree hiện tại thành phần trái và phần phải.

## Hint 3

**EN:** Build a map from value to inorder index so each split point is found in `O(1)` instead of scanning repeatedly.

**VI:** Tạo map `value -> inorder index` để tìm split point trong `O(1)` thay vì scan lặp lại.

## Key observation / Quan sát then chốt

Because values are unique, each preorder root value identifies exactly one inorder split position.
