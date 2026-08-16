# Hints / Gợi ý — 200. Number of Islands

## Hint 1
**EN:** Each unseen land cell starts exactly one new connected component.

**VI:** Mỗi land cell chưa thăm bắt đầu đúng một connected component mới.

## Hint 2
**EN:** After counting it, flood-fill all horizontally/vertically connected land so it cannot be counted again.

**VI:** Sau khi count, flood-fill toàn bộ land nối 4 hướng để không bị count lần nữa.

## Hint 3
**EN:** You may mark visited land directly in the grid if mutation is allowed.

**VI:** Có thể đánh dấu visited trực tiếp trên grid bằng cách đổi `'1'` thành `'0'`.
