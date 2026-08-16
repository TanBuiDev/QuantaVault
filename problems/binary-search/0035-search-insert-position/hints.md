# 35. Search Insert Position — Hints / Gợi ý

## Hint 1
**EN:** The answer is the first index whose value is greater than or equal to target.

**VI:** Đáp án là index đầu tiên có giá trị `>= target`.

## Hint 2
**EN:** Search a half-open interval `[0,n)` so `n` is a valid insertion position.

**VI:** Dùng interval `[0,n)` để `n` là vị trí chèn hợp lệ.

## Hint 3
Move left past values `< target`; otherwise move right to mid.
