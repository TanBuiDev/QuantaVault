# 167. Two Sum II - Input Array Is Sorted

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two `numbers` such that they add up to a specific `target` number.
>
> **VI:** Cho mảng số nguyên `numbers` được đánh index từ `1` và đã sắp xếp theo thứ tự không giảm, hãy tìm hai số có tổng bằng `target`.

> **EN:** Let these two `numbers` be `numbers[index1]` and `numbers[index2]` where 1 <= index1 < index2 <= `numbers`.length.
>
> **VI:** Gọi hai số là `numbers[index1]` và `numbers[index2]`, với `1 <= index1 < index2 <= numbers.length`.

> **EN:** Return the indices of the two `numbers`, index1 and index2, added by one as an integer array [index1, index2] of length 2.
>
> **VI:** Trả về hai index theo chuẩn 1-based dưới dạng mảng `[index1, index2]` có độ dài `2`.

> **EN:** The tests are generated such that there is exactly one solution. You may not use the same element twice.
>
> **VI:** Đề đảm bảo có đúng một lời giải và không được dùng cùng một phần tử hai lần.

> **EN:** Your solution must use only constant extra space.
>
> **VI:** Lời giải phải chỉ dùng `O(1)` bộ nhớ phụ.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
```

### Example 2 / Ví dụ 2

```text
Input: numbers = [2,3,4], target = 6
Output: [1,3]
```

### Example 3 / Ví dụ 3

```text
Input: numbers = [-1,0], target = -1
Output: [1,2]
```

## Constraints / Ràng buộc

> **EN:** `2 <= `numbers`.length <= 3 * 10^4`
>
> **VI:** Độ dài `numbers` từ `2` đến `3 * 10^4`.

> **EN:** `-1000 <= `numbers[i]` <= 1000`
>
> **VI:** `-1000 <= numbers[i] <= 1000`

> **EN:** `numbers` is sorted in non-decreasing order.
>
> **VI:** `numbers` được sắp xếp theo thứ tự không giảm.

> **EN:** `-1000 <= `target` <= 1000`
>
> **VI:** `-1000 <= target <= 1000`

> **EN:** The tests are generated such that there is exactly one solution.
>
> **VI:** Đề đảm bảo có đúng một lời giải.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Two Pointers.txt
blob SHA: 0fac4442afd9fb3ca107f2ed6cc743fe6f50139c
```
