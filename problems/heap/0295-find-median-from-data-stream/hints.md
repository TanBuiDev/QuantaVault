# 295. Find Median from Data Stream — Hints / Gợi ý

## Hint 1

**EN:** Split the stream into a lower half and an upper half.

**VI:** Chia dữ liệu thành nửa dưới và nửa trên.

## Hint 2

**EN:** Keep the lower half in a max-heap and the upper half in a min-heap.

**VI:** Giữ nửa dưới trong max-heap và nửa trên trong min-heap.

## Hint 3

Maintain sizes differing by at most one; the heap tops are then exactly the middle value(s).
