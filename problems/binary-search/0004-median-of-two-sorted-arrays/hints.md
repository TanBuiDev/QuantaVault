# 4. Median of Two Sorted Arrays — Hints / Gợi ý

## Hint 1

**EN:** Binary-search how many elements to take from the left side of the shorter array.

**VI:** Binary search số phần tử lấy ở nửa trái của mảng ngắn hơn.

## Hint 2

**EN:** Choose partitions so the total number of elements on the left equals `(m+n+1)/2`.

**VI:** Chọn partition để tổng số phần tử phía trái bằng `(m+n+1)/2`.

## Hint 3

A partition is valid when `leftA <= rightB` and `leftB <= rightA`; use infinities at array boundaries.
