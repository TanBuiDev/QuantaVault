# Hints / Gợi ý — 114. Flatten Binary Tree to Linked List

## Hint 1

**EN:** Preorder requires the whole left subtree to appear before the original right subtree.

**VI:** Preorder yêu cầu toàn bộ left subtree xuất hiện trước original right subtree.

## Hint 2

**EN:** If a node has a left subtree, find the rightmost node of that left subtree. It is the last node visited before returning to the original right subtree.

**VI:** Nếu node có left subtree, tìm node ngoài cùng bên phải của left subtree. Đó là node cuối được thăm trước khi sang original right subtree.

## Hint 3

**EN:** Attach the original right subtree after that predecessor, move the left subtree to `right`, then clear `left`.

**VI:** Gắn original right subtree sau predecessor, chuyển left subtree sang `right`, rồi đặt `left = null`.

## Key observation / Quan sát then chốt

Local rewiring can preserve preorder order, so no explicit recursion stack or auxiliary list is necessary.
