# Hints / Gợi ý — 104. Maximum Depth of Binary Tree

## Hint 1

**EN:** The depth of a tree depends only on the depths of its left and right subtrees.

**VI:** Độ sâu của cây chỉ phụ thuộc vào độ sâu của hai subtree trái và phải.

## Hint 2

**EN:** For a non-null node, compute the maximum depth of both children and add one for the current node.

**VI:** Với node khác `null`, lấy depth lớn hơn giữa hai child rồi cộng `1` cho node hiện tại.

## Hint 3

**EN:** The natural base case is `root == null`, whose depth is zero.

**VI:** Base case tự nhiên là `root == null`, có depth bằng `0`.

## Key observation / Quan sát then chốt

Recurrence cốt lõi là `depth(node) = 1 + max(depth(node.left), depth(node.right))`.
