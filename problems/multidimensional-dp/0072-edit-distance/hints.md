# 72. Edit Distance — Hints / Gợi ý

## Hint 1

**EN:** Define a state for converting prefixes, not the entire strings at once.

**VI:** Hãy định nghĩa state cho việc biến đổi các prefix của hai chuỗi.

## Hint 2

Let `dp[i][j]` be the minimum edits to convert `word1[0..i)` into `word2[0..j)`.

Nếu hai ký tự cuối giống nhau, không cần thao tác mới. Nếu khác nhau, xét ba lựa chọn insert, delete, replace.

## Hint 3

```text
if chars equal:
    dp[i][j] = dp[i-1][j-1]
else:
    dp[i][j] = 1 + min(
        dp[i][j-1],   // insert
        dp[i-1][j],   // delete
        dp[i-1][j-1]  // replace
    )
```

Chỉ cần previous row nên có thể nén còn `O(n)` space.
