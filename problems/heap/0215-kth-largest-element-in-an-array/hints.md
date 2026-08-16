# 215. Kth Largest Element in an Array — Hints / Gợi ý

## Hint 1

**EN:** Keep only the k largest values seen so far.

**VI:** Chỉ giữ lại `k` giá trị lớn nhất đã thấy.

## Hint 2

**EN:** A min-heap of size k exposes the smallest value among those k candidates.

**VI:** Min-heap kích thước `k` cho biết giá trị nhỏ nhất trong top-k hiện tại.

## Hint 3

Push each value and remove the minimum whenever heap size exceeds k.
