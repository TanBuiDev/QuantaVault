# Hints / Gợi ý — 103. Binary Tree Zigzag Level Order Traversal

## Hint 1
**EN:** Keep normal BFS queue order; only change how values are inserted into the current level list.

**VI:** Giữ nguyên thứ tự BFS trong queue; chỉ thay đổi cách insert value vào list của current level.

## Hint 2
**EN:** A direction flag can alternate after every level.

**VI:** Một direction flag có thể đảo sau mỗi level.

## Hint 3
**EN:** For reverse levels, insert values at the front of a deque/list instead of reversing the entire tree traversal.

**VI:** Với level ngược, insert value vào đầu deque/list thay vì đảo traversal của tree.
