# Hints / Gợi ý — 124. Binary Tree Maximum Path Sum

## Hint 1

**EN:** A path sent upward to a parent cannot branch; it may use at most one child of the current node.

**VI:** Một path truyền lên parent không thể phân nhánh; tại current node nó chỉ có thể dùng tối đa một child.

## Hint 2

**EN:** A path that finishes at the current node may use both left and right gains, so it can update the global answer.

**VI:** Một path hoàn chỉnh tại current node có thể dùng cả left và right gain để cập nhật global answer.

## Hint 3

**EN:** Ignore a negative child gain by clamping it to zero.

**VI:** Bỏ qua child gain âm bằng cách clamp về `0`.

## Key observation / Quan sát then chốt

The value returned to the parent and the value used to update the global optimum are different quantities.
