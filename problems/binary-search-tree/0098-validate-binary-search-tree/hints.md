# Hints / Gợi ý — 98. Validate Binary Search Tree

## Hint 1
**EN:** Comparing a node only with its parent is not sufficient; ancestors also impose constraints.

**VI:** Chỉ so sánh node với parent là chưa đủ; ancestors cũng tạo constraint.

## Hint 2
**EN:** Pass an allowed `(low, high)` range down the recursion.

**VI:** Truyền range hợp lệ `(low, high)` xuống recursion.

## Hint 3
**EN:** Use bounds wider than `int`, because valid node values may equal `Integer.MIN_VALUE` or `Integer.MAX_VALUE`.

**VI:** Dùng bounds rộng hơn `int` vì node hợp lệ có thể bằng `Integer.MIN_VALUE` hoặc `Integer.MAX_VALUE`.
