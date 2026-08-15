# 139. Word Break — Hints / Gợi ý

## Hint 1
**EN:** Think about whether each prefix of `s` can be segmented.

**VI:** Xét từng prefix của `s` có thể được tách hợp lệ hay không.

## Hint 2
Define `dp[i]` as whether `s[0..i)` can be segmented.

## Hint 3
For each reachable prefix ending at `j`, if `s.substring(j, i)` is in the dictionary, then `dp[i] = true`.

Dùng `HashSet` cho dictionary và có thể giới hạn `j` theo độ dài từ lớn nhất.
