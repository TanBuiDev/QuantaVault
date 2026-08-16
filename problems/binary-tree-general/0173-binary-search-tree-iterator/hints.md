# Hints / Gợi ý — 173. Binary Search Tree Iterator

## Hint 1

**EN:** In inorder traversal, the next value is the leftmost unvisited node.

**VI:** Trong inorder traversal, value kế tiếp là node chưa thăm ngoài cùng bên trái.

## Hint 2

**EN:** Store only the path needed to reach that node instead of materializing the entire traversal.

**VI:** Chỉ lưu path cần thiết để tới node đó thay vì tạo toàn bộ traversal.

## Hint 3

**EN:** After popping a node, push the entire left spine of its right subtree.

**VI:** Sau khi pop một node, push toàn bộ left spine của right subtree của nó.

## Key observation / Quan sát then chốt

Each tree node enters and leaves the stack once, which makes `next()` amortized `O(1)` across the full traversal.
