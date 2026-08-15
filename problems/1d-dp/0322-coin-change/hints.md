# 322. Coin Change — Hints / Gợi ý

## Hint 1

**EN:** Define the best answer for every smaller amount from `0` to `amount`.

**VI:** Hãy lưu đáp án tốt nhất cho mọi tổng nhỏ từ `0` tới `amount`.

## Hint 2

**EN:** If the last coin has value `coin`, the previous amount is `current - coin`.

**VI:** Nếu coin cuối có giá trị `coin`, predecessor amount là `current - coin`.

## Hint 3

```text
dp[0] = 0
dp[x] = min(dp[x], dp[x - coin] + 1)
```

Dùng sentinel `amount + 1` cho state chưa reachable; vì mỗi coin ít nhất bằng `1`, một lời giải hợp lệ không bao giờ cần hơn `amount` coin.
