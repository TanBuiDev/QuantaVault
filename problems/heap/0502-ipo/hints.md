# 502. IPO — Hints / Gợi ý

## Hint 1

**EN:** At any current capital, only projects with `capital[i] <= w` are eligible.

**VI:** Với vốn hiện tại, chỉ dự án có `capital[i] <= w` mới làm được.

## Hint 2

**EN:** Among all eligible projects, choosing the largest profit can never reduce future options because profits are nonnegative.

**VI:** Trong các dự án đủ điều kiện, chọn profit lớn nhất không làm mất lựa chọn tương lai vì profit không âm.

## Hint 3

Use one min-heap ordered by required capital and one max-heap of profits for currently affordable projects.
