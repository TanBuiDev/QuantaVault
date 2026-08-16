# 69. Sqrt(x) — Hints / Gợi ý

## Hint 1

**EN:** The answer is an integer in the range `[0, x]`.

**VI:** Đáp án là một số nguyên trong khoảng `[0, x]`.

## Hint 2

**EN:** Binary search for the largest integer `m` such that `m * m <= x`.

**VI:** Binary search số nguyên lớn nhất `m` sao cho `m * m <= x`.

## Hint 3

Use `long` for the square, or compare with division, to avoid 32-bit overflow.
