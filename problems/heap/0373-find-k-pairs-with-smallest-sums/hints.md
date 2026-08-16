# 373. Find K Pairs with Smallest Sums — Hints / Gợi ý

## Hint 1

**EN:** For a fixed `i`, pairs `(nums1[i], nums2[j])` are ordered by sum as `j` increases.

**VI:** Với `i` cố định, tổng các cặp tăng không giảm theo `j`.

## Hint 2

**EN:** Treat each fixed `i` as a sorted row and merge rows with a min-heap.

**VI:** Xem mỗi `i` như một hàng đã sort và merge các hàng bằng min-heap.

## Hint 3

Only seed the first `min(nums1.length, k)` rows; after polling `(i,j)`, push `(i,j+1)` if it exists.
