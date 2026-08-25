# 228. Summary Ranges

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are given a sorted unique `integer` array `nums`.
>
> **VI:** Bạn được cho một mảng số nguyên `nums` đã được sắp xếp và không có phần tử trùng.

> **EN:** A range [a,b] is the set of all integers from a to b (inclusive).
>
> **VI:** Một range `[a,b]` là tập tất cả số nguyên từ `a` đến `b`, tính cả hai đầu.

> **EN:** Return the smallest sorted list of ranges that cover all the numbers in the array exactly. That is, each element of `nums` is covered by exactly one of the ranges, and there is no `integer` x such that x is in one of the ranges but not in `nums`.
>
> **VI:** Trả về danh sách range nhỏ nhất, đã sắp xếp, bao phủ chính xác mọi số trong mảng: mỗi phần tử thuộc đúng một range và không range nào chứa số không có trong `nums`.

> **EN:** Each range [a,b] in the list should be output as:
>
> **VI:** Mỗi range `[a,b]` được xuất như sau:

> **EN:** "a->b" if a != b
>
> **VI:** `"a->b"` nếu `a != b`.

> **EN:** "a" if a == b
>
> **VI:** `"a"` nếu `a == b`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [0,1,2,4,5,7]
Output: ["0->2","4->5","7"]
```

> **EN:** Explanation: The ranges are: [0,2] --> "0->2", [4,5] --> "4->5", [7,7] --> "7".
>
> **VI:** Các run liên tiếp là `[0,2]`, `[4,5]`, và `[7,7]`, nên format tương ứng như output.

### Example 2 / Ví dụ 2

```text
Input: nums = [0,2,3,4,6,8,9]
Output: ["0","2->4","6","8->9"]
```

> **EN:** Explanation: The ranges are: [0,0] --> "0", [2,4] --> "2->4", [6,6] --> "6", [8,9] --> "8->9".
>
> **VI:** Các run liên tiếp là `[0,0]`, `[2,4]`, `[6,6]`, `[8,9]`.

## Constraints / Ràng buộc

> **EN:** `0 <= `nums`.length <= 20`
>
> **VI:** `0 <= nums.length <= 20`.

> **EN:** `-2^31 <= `nums[i]` <= 2^31 - 1`
>
> **VI:** `-2^31 <= nums[i] <= 2^31 - 1`

> **EN:** All the values of `nums` are unique.
>
> **VI:** Mọi giá trị trong `nums` là duy nhất.

> **EN:** `nums` is sorted in ascending order.
>
> **VI:** `nums` được sắp xếp tăng dần.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/summary-ranges/

English wording preserved from `raw/top-interview-150/Intervals.txt` (blob `113c3211b5e02ebaa87bbba24f74f41109da627d`).
