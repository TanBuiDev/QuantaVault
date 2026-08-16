# 191. Number of 1 Bits — Hints / Gợi ý

## Hint 1

**EN:** Subtracting one from a positive integer flips its lowest set bit and all lower bits.

**VI:** Trừ 1 sẽ làm thay đổi set bit thấp nhất và các bit phía dưới nó.

## Hint 2

**EN:** The expression `n & (n - 1)` clears exactly the lowest set bit of `n`.

**VI:** Biểu thức `n & (n - 1)` xóa đúng set bit thấp nhất của `n`.

## Hint 3

Repeat that operation until `n` becomes zero and count how many times it succeeds.
