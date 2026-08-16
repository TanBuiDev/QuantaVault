# 50. Pow(x, n) — Hints / Gợi ý

## Hint 1
**EN:** Squaring the base lets one multiplication account for twice as many exponent bits.

**VI:** Bình phương base giúp xử lý số mũ theo từng bit.

## Hint 2
For negative `n`, compute with `1/x` and a positive exponent.

## Hint 3
Convert `n` to `long` before negating it; `Integer.MIN_VALUE` cannot be represented as a positive `int`.
