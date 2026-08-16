# Hints / Gợi ý — 106. Construct Binary Tree from Inorder and Postorder Traversal

## Hint 1

**EN:** The last unconsumed value of postorder is the root of the current subtree.

**VI:** Value chưa dùng cuối cùng của postorder là root của subtree hiện tại.

## Hint 2

**EN:** The root's inorder index splits the subtree into left and right ranges; use a hash map for constant-time split lookup.

**VI:** Inorder index của root chia subtree thành left/right range; dùng hash map để lookup split trong `O(1)` average.

## Hint 3

**EN:** Since postorder is consumed from right to left, build the right subtree before the left subtree.

**VI:** Vì postorder được consume từ phải sang trái, phải dựng right subtree trước left subtree.

## Key observation / Quan sát then chốt

Reverse postorder order is `root -> right -> left`, so recursive construction must follow that same consumption order.
