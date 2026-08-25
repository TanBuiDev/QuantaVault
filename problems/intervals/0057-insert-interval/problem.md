# 57. Insert Interval

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an array of non-overlapping `intervals` `intervals` where `intervals[i]` = [starti, endi] represent the start and the end of the `i`th interval and `intervals` is sorted in ascending order by starti. You are also given an interval `newInterval` = [start, end] that represents the start and end of another interval.
>
> **VI:** Bạn được cho một mảng các interval không chồng lấn `intervals`, trong đó `intervals[i] = [starti, endi]` biểu diễn điểm bắt đầu và kết thúc của interval thứ `i`. Mảng đã được sort tăng dần theo `starti`. Ngoài ra có một interval mới `newInterval = [start, end]`.

> **EN:** Two `intervals` are considered overlapping if they share at least one point.
>
> **VI:** Hai interval được xem là overlap nếu chúng có ít nhất một điểm chung.

> **EN:** Insert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order by starti and `intervals` still does not have any overlapping `intervals` (merge overlapping `intervals` if necessary).
>
> **VI:** Hãy chèn `newInterval` sao cho kết quả vẫn sorted tăng dần theo `starti` và không còn interval nào overlap; nếu cần thì phải merge các interval overlap.

> **EN:** Return `intervals` after the insertion.
>
> **VI:** Trả về danh sách interval sau khi chèn.

> **EN:** Note that you don't need to modify `intervals` in-place. You can make a `new` array and return it.
>
> **VI:** Không bắt buộc phải sửa `intervals` in-place; có thể tạo một mảng mới và trả về.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

> **VI:** `newInterval = [2,5]` overlap với `[1,3]`, nên hai interval được merge thành `[1,5]`.

### Example 2 / Ví dụ 2

```text
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
```

> **EN:** Explanation: Because the `new` interval [4,8] overlaps with [3,5],[6,7],[8,10].
>
> **VI:** Giải thích: `newInterval [4,8]` overlap với `[3,5]`, `[6,7]`, và `[8,10]`, nên toàn bộ nhóm đó được merge thành `[3,10]`.

## Constraints / Ràng buộc

> **EN:** `0 <= `intervals`.length <= 10^4`
>
> **VI:** Số lượng interval nằm trong giới hạn được nêu trong source.

> **EN:** `intervals[i].length == 2`
>
> **VI:** Mỗi interval có đúng hai phần tử.

> **EN:** `0 <= starti <= endi <= 10^5`
>
> **VI:** Mỗi interval hợp lệ với `starti <= endi`.

> **EN:** `intervals is sorted by starti in ascending order.`
>
> **VI:** `intervals` đã được sort tăng dần theo `starti`.

> **EN:** `newInterval.length == 2`
>
> **VI:** `newInterval` có đúng hai phần tử.

> **EN:** `0 <= start <= end <= 10^5`
>
> **VI:** `newInterval` hợp lệ với `start <= end`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/insert-interval/

English wording preserved from `raw/top-interview-150/Intervals.txt` (blob `113c3211b5e02ebaa87bbba24f74f41109da627d`).
