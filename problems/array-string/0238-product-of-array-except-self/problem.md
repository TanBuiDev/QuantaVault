# 238. Product of Array Except Self

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums`, return an array answer such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.
>
> **VI:** Cho mảng số nguyên `nums`, hãy trả về mảng `answer` sao cho `answer[i]` bằng tích của tất cả phần tử trong `nums` ngoại trừ `nums[i]`.

> **EN:** The product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.
>
> **VI:** Đề đảm bảo tích của mọi prefix hoặc suffix của `nums` vừa trong số nguyên 32-bit.

> **EN:** You must write an algorithm that runs in O(n) time and without using the division operation.
>
> **VI:** Thuật toán phải chạy trong `O(n)` và không được dùng phép chia.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
```

### Example 2 / Ví dụ 2

```text
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
```

## Constraints / Ràng buộc

> **EN:** `2 <= `nums`.length <= 10^5`
>
> **VI:** Độ dài `nums` từ `2` đến `10^5`.

> **EN:** `-30 <= `nums[i]` <= 30`
>
> **VI:** Mỗi `nums[i]` nằm trong khoảng `-30` đến `30`.

> **EN:** The input is generated such that `answer[i]` is guaranteed to fit in a 32-bit integer.
>
> **VI:** Đề đảm bảo mọi `answer[i]` vừa trong số nguyên 32-bit.

## Follow up / Câu hỏi mở rộng

> **EN:** Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)
>
> **VI:** Bạn có thể giải với `O(1)` bộ nhớ phụ không? Mảng output không được tính là extra space.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/product-of-array-except-self/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
