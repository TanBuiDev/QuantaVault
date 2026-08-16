# 108. Convert Sorted Array to Binary Search Tree — Hints / Gợi ý

## Hint 1
**EN:** Choosing the middle element as root keeps left and right subtree sizes nearly equal.

**VI:** Chọn phần tử giữa làm root giúp kích thước hai subtree gần bằng nhau.

## Hint 2
**EN:** Values left of the midpoint belong to the left BST; values right of it belong to the right BST.

**VI:** Các giá trị bên trái midpoint tạo left subtree; bên phải tạo right subtree.

## Hint 3
Apply the same rule recursively to each half.
