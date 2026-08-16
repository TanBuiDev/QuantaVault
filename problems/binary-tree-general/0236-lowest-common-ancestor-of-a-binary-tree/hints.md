# Hints / Gợi ý — 236. Lowest Common Ancestor of a Binary Tree

## Hint 1

**EN:** If the current node is `p` or `q`, it is already a valid candidate to return upward.

**VI:** Nếu current node chính là `p` hoặc `q`, nó đã là candidate hợp lệ để trả lên.

## Hint 2

**EN:** Search the left and right subtrees independently.

**VI:** Tìm trong left và right subtree độc lập.

## Hint 3

**EN:** If both recursive calls return non-null nodes, the current node is the first split point and therefore the LCA.

**VI:** Nếu cả hai recursive call đều trả non-null, current node là split point đầu tiên và chính là LCA.

## Key observation / Quan sát then chốt

A non-null result from a subtree means that subtree contains at least one target or already contains their LCA.
