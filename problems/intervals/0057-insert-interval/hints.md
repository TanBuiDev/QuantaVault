# 57. Insert Interval — Hints / Gợi ý

## Hint 1

**EN:** The original intervals are already sorted and non-overlapping. Try to preserve that structure instead of sorting everything again.

**VI:** `intervals` ban đầu đã sorted và non-overlapping. Hãy tận dụng tính chất này thay vì sort lại toàn bộ.

## Hint 2

**EN:** Think of the scan in three phases: intervals completely before `newInterval`, intervals overlapping it, and intervals completely after it.

**VI:** Chia quá trình scan thành ba phase: interval nằm hoàn toàn trước `newInterval`, interval overlap với nó, và interval nằm hoàn toàn sau nó.

## Hint 3

**EN:** An interval is strictly before the new interval when `interval.end < newStart`. It overlaps while `interval.start <= mergedEnd`.

**VI:** Interval nằm hẳn trước khi `interval.end < newStart`. Trong phase merge, còn overlap khi `interval.start <= mergedEnd`.

## Hint 4

**EN:** During the overlap phase, update both boundaries with `min(start)` and `max(end)`, then emit the merged interval exactly once.

**VI:** Trong phase overlap, cập nhật cả hai biên bằng `min(start)` và `max(end)`, sau đó chỉ add merged interval đúng một lần.
