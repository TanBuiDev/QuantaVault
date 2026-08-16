# Hints / Gợi ý — 133. Clone Graph

## Hint 1

**EN:** A graph may contain cycles, so recursive traversal needs a visited structure.

**VI:** Graph có thể có cycle, nên recursive traversal cần cấu trúc visited.

## Hint 2

**EN:** Instead of storing only visited state, map each original node to its cloned node.

**VI:** Thay vì chỉ lưu visited, hãy map mỗi original node tới cloned node tương ứng.

## Hint 3

**EN:** Create and record the clone before recursively cloning neighbors.

**VI:** Hãy tạo và lưu clone trước khi recursively clone các neighbor.

## Key observation / Quan sát then chốt

The old-to-new map simultaneously prevents infinite recursion and guarantees that every original node corresponds to exactly one cloned object.
