# 56. Merge Intervals

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
>
> **VI:** Cho một mảng các khoảng `intervals`, trong đó `intervals[i] = [starti, endi]`. Hãy gộp tất cả các khoảng bị chồng lấn và trả về một mảng các khoảng không còn chồng lấn nhưng vẫn bao phủ toàn bộ các khoảng ban đầu.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```

> **EN:** Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
>
> **VI:** Giải thích: Vì `[1,3]` và `[2,6]` chồng lấn nên gộp chúng thành `[1,6]`.

### Example 2 / Ví dụ 2

```text
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
```

> **EN:** Explanation: Intervals [1,4] and [4,5] are considered overlapping.
>
> **VI:** Giải thích: Hai khoảng `[1,4]` và `[4,5]` được xem là chồng lấn vì chúng cùng chứa điểm `4`.

### Example 3 / Ví dụ 3

```text
Input: intervals = [[4,7],[1,4]]
Output: [[1,7]]
```

> **EN:** Explanation: Intervals [1,4] and [4,7] are considered overlapping.
>
> **VI:** Giải thích: Sau khi xét theo thứ tự bắt đầu, `[1,4]` và `[4,7]` chồng lấn tại điểm `4`, nên kết quả là `[1,7]`.

## Constraints / Ràng buộc

> **EN:** `1 <= intervals.length <= 104`
>
> **VI:** Số lượng interval nằm trong giới hạn được nêu trong source.

> **EN:** `intervals[i].length == 2`
>
> **VI:** Mỗi interval luôn có đúng hai giá trị: điểm bắt đầu và điểm kết thúc.

> **EN:** `0 <= starti <= endi <= 104`
>
> **VI:** Mỗi interval hợp lệ và có `starti <= endi`, với giá trị nằm trong giới hạn được nêu trong source.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/merge-intervals/

English wording preserved from `raw/top-interview-150/Intervals.txt` (blob `113c3211b5e02ebaa87bbba24f74f41109da627d`).
