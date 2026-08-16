# Hints / Gợi ý — 102. Binary Tree Level Order Traversal

## Hint 1

**EN:** A queue naturally visits nodes in breadth-first order.

**VI:** Queue tự nhiên duyệt node theo breadth-first order.

## Hint 2

**EN:** Save the queue size before processing a level; that size is exactly the number of nodes belonging to the current level.

**VI:** Lưu queue size trước khi xử lý level; đó chính là số node của current level.

## Hint 3

**EN:** Build one list for those `size` nodes, then append that list to the final answer.

**VI:** Tạo một list cho đúng `size` node đó, rồi append list vào answer.

## Key observation / Quan sát then chốt

Children enqueued while processing a level belong to the next level, so the saved size cleanly separates levels.
