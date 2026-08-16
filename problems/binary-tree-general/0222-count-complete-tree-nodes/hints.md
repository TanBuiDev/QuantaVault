# Hints / Gợi ý — 222. Count Complete Tree Nodes

## Hint 1

**EN:** In a complete tree, comparing the leftmost heights of the left and right subtrees tells you which side is perfect.

**VI:** Trong complete tree, so sánh leftmost height của left và right subtree cho biết side nào là perfect tree.

## Hint 2

**EN:** If both heights are equal, the left subtree is perfect. Count the root plus that entire subtree in constant arithmetic and recurse only right.

**VI:** Nếu hai height bằng nhau, left subtree là perfect; tính root + toàn bộ left subtree bằng công thức rồi chỉ recurse sang right.

## Hint 3

**EN:** Otherwise the right subtree is perfect and you recurse only into the left subtree.

**VI:** Nếu không bằng nhau, right subtree là perfect và chỉ recurse vào left subtree.

## Key observation / Quan sát then chốt

A perfect binary tree of height `h` nodes along its left spine contains `2^h - 1` nodes.
