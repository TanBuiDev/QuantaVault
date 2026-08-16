# 34. Find First and Last Position of Element in Sorted Array — Hints / Gợi ý

## Hint 1

**EN:** One ordinary binary search finds one occurrence, but not necessarily a boundary.

**VI:** Binary search thông thường chỉ tìm một lần xuất hiện, chưa chắc là biên.

## Hint 2

**EN:** Find the first index whose value is at least target, then the first index whose value is greater than target.

**VI:** Tìm index đầu tiên có giá trị `>= target`, rồi index đầu tiên có giá trị `> target`.

## Hint 3

The last occurrence is `upperBound(target) - 1`; verify the lower bound actually equals target.
