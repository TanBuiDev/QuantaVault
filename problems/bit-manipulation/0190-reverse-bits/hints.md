# 190. Reverse Bits — Hints / Gợi ý

## Hint 1

**EN:** The output has exactly 32 bit positions, including leading zeros.

**VI:** Output luôn có đúng 32 vị trí bit, kể cả các số 0 ở đầu.

## Hint 2

**EN:** Repeatedly take the lowest bit of `n` and append it to the right side of the result.

**VI:** Liên tục lấy bit thấp nhất của `n` và ghép vào bên phải kết quả.

## Hint 3

Use unsigned right shift `>>>` so the next source bit always moves into position zero.
