# 295. Find Median from Data Stream

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** The median is the middle value in an ordered integer list. If the size of the list is even, the median is the mean of the two middle values.
>
> **VI:** Median là giá trị ở giữa danh sách số nguyên đã sắp xếp; nếu số phần tử chẵn thì median là trung bình của hai giá trị giữa.

> **EN:** Implement the MedianFinder class: `MedianFinder()` initializes the object, `void addNum(int num)` adds a number, and `double findMedian()` returns the median of all elements so far.
>
> **VI:** Cài đặt lớp `MedianFinder` với constructor, `addNum(int)` để thêm số và `findMedian()` để trả median hiện tại.

## Examples / Ví dụ

```text
MedianFinder()
addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3)
findMedian() -> 2.0
```

## Constraints / Ràng buộc

> **EN:** `-10^5 <= num <= 10^5`; at least one element exists before `findMedian`; at most `5 * 10^4` calls are made.
>
> **VI:** `num` trong `[-10^5,10^5]`; luôn có ít nhất một phần tử trước khi gọi `findMedian`; tối đa `5 * 10^4` lời gọi.

## Follow-up / Câu hỏi mở rộng

> **EN:** If all numbers are in [0,100], or 99% are in that range, how would you optimize?
>
> **VI:** Nếu toàn bộ hoặc 99% số nằm trong [0,100], bạn sẽ tối ưu thế nào?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/find-median-from-data-stream/

English wording preserved from `raw/top-interview-150/Heap.txt` (blob `fbb1dbdac09eda7a70bdcda5a956eee1c308b031`).
