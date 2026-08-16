# 74. Search a 2D Matrix — Hints / Gợi ý

## Hint 1
**EN:** The row-boundary condition makes the entire matrix globally sorted in row-major order.

**VI:** Điều kiện giữa các hàng khiến toàn ma trận sorted theo row-major.

## Hint 2
**EN:** Binary-search virtual indices from `0` to `m*n-1`.

**VI:** Binary search index ảo từ `0` đến `m*n-1`.

## Hint 3
Map virtual index `p` to `matrix[p / n][p % n]`.
