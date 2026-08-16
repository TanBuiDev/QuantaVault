# 23. Merge k Sorted Lists — Hints / Gợi ý

## Hint 1
**EN:** At any time, the smallest remaining node must be one of the current list heads.

**VI:** Node nhỏ nhất chưa dùng luôn nằm ở một trong các head hiện tại.

## Hint 2
**EN:** Keep non-null heads in a min-heap by node value.

**VI:** Giữ các head khác null trong min-heap theo `val`.

## Hint 3
After polling a node, push its `next` node if present.
