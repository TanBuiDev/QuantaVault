# 128. Longest Consecutive Sequence — Hints / Gợi ý

## Hint 1

Sort sẽ cho lời giải dễ nhưng tốn `O(n log n)`, không đạt yêu cầu `O(n)`.

## Hint 2

Đưa toàn bộ values vào `HashSet` để check `x-1` và `x+1` average `O(1)`.

## Hint 3

Không nên mở rộng sequence từ mọi value. Chỉ bắt đầu tại `x` nếu `x-1` **không tồn tại** trong set.

## Hint 4

Từ một sequence start, tăng `current` cho tới khi `current+1` không còn trong set. Duplicate input tự biến mất trong HashSet.
