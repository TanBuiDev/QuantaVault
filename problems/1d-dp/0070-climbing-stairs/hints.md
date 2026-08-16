# 70. Climbing Stairs — Hints / Gợi ý

## Hint 1
**EN:** Think about the last move used to reach step `n`.

**VI:** Hãy xét bước cuối để đến bậc `n`.

## Hint 2
The last move is either one step from `n-1` or two steps from `n-2`.

## Hint 3
```text
ways[n] = ways[n - 1] + ways[n - 2]
```

Chỉ cần hai state trước, nên không cần mảng DP.
