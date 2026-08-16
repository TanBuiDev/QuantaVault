# 300. Longest Increasing Subsequence — Hints / Gợi ý

## Hint 1

**EN:** The O(n^2) DP is useful: let `dp[i]` be the LIS length ending at `i`.

**VI:** DP O(n²) giúp thấy cấu trúc: `dp[i]` là LIS kết thúc tại `i`.

## Hint 2

**EN:** For the O(n log n) follow-up, keep the smallest possible tail value for every subsequence length found so far.

**VI:** Với O(n log n), giữ tail nhỏ nhất có thể cho mỗi độ dài subsequence.

## Hint 3

For each number, binary-search the first `tails[pos] >= number` and replace it. If no such position exists, append it.

**VI:** Dùng lower bound: tìm vị trí đầu tiên `>= x`; replace vị trí đó hoặc tăng length nếu `x` lớn hơn mọi tail.
