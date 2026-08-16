# 97. Interleaving String — Hints / Gợi ý

## Hint 1

**EN:** First check whether `s1.length() + s2.length() == s3.length()`.

**VI:** Trước tiên kiểm tra tổng độ dài; nếu không bằng độ dài `s3` thì chắc chắn `false`.

## Hint 2

Define `dp[i][j]` as whether the first `i + j` characters of `s3` can be formed from the first `i` characters of `s1` and first `j` characters of `s2`.

## Hint 3

Một state có thể đến từ:

```text
from s1: dp[i-1][j] && s1[i-1] == s3[i+j-1]
from s2: dp[i][j-1] && s2[j-1] == s3[i+j-1]
```

## Hint 4

Chỉ cần previous row và current-row left state nên có thể nén còn một boolean array theo `s2`.
