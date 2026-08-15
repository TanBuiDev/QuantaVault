# 149. Max Points on a Line — Hints / Gợi ý

## Hint 1

**EN:** Fix one point as an anchor. Every other point that lies on the same line through that anchor has the same slope.

**VI:** Cố định một điểm làm anchor; các điểm cùng đường thẳng qua anchor có cùng slope.

## Hint 2

**EN:** Avoid floating-point slopes. Represent the slope by the reduced pair `(dy, dx)`.

**VI:** Tránh số thực; biểu diễn slope bằng cặp `(dy, dx)` đã chia cho `gcd(|dy|, |dx|)`.

## Hint 3

Canonicalize signs so equivalent directions get the same key. Treat vertical and horizontal lines consistently, then count normalized slopes in a hash map for each anchor.
