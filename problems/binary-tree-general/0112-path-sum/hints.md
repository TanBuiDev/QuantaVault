# Hints / Gợi ý — 112. Path Sum

## Hint 1

**EN:** A valid path must end at a leaf, not merely at any node whose running sum reaches the target.

**VI:** Path hợp lệ phải kết thúc tại leaf, không phải bất kỳ node nào có running sum chạm target.

## Hint 2

**EN:** After visiting a node, subtract its value from the remaining target and pass that value to its children.

**VI:** Sau khi thăm một node, trừ value của nó khỏi target còn lại rồi truyền phần còn lại xuống child.

## Hint 3

**EN:** At a leaf, the path is valid exactly when the remaining target equals the leaf's value.

**VI:** Tại leaf, path hợp lệ khi và chỉ khi target còn lại bằng value của leaf.

## Key observation / Quan sát then chốt

The leaf condition is part of the correctness condition; matching the sum at an internal node is insufficient.
