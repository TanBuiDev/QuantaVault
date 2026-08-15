# 15. 3Sum

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
>
> **VI:** Cho mảng số nguyên `nums`, hãy trả về tất cả bộ ba `[nums[i], nums[j], nums[k]]` sao cho ba index khác nhau và tổng của ba phần tử bằng `0`.

> **EN:** Notice that the solution set must not contain duplicate triplets.
>
> **VI:** Lưu ý rằng tập kết quả không được chứa các triplet trùng nhau.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

> **EN:** Explanation:
> nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
> nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
> nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
> The distinct triplets are [-1,0,1] and [-1,-1,2].
> Notice that the order of the output and the order of the triplets does not matter.
>
> **VI:** Giải thích: Có nhiều tổ hợp index cho tổng bằng `0`, nhưng sau khi loại duplicate thì chỉ còn hai triplet phân biệt `[-1,-1,2]` và `[-1,0,1]`. Thứ tự các triplet trong output không quan trọng.

### Example 2 / Ví dụ 2

```text
Input: nums = [0,1,1]
Output: []
```

> **EN:** Explanation: The only possible triplet does not sum up to 0.
>
> **VI:** Triplet duy nhất có thể chọn không có tổng bằng `0`.

### Example 3 / Ví dụ 3

```text
Input: nums = [0,0,0]
Output: [[0,0,0]]
```

> **EN:** Explanation: The only possible triplet sums up to 0.
>
> **VI:** Triplet duy nhất có tổng bằng `0`.

## Constraints / Ràng buộc

> **EN:** `3 <= nums.length <= 3000`
>
> **VI:** Độ dài `nums` từ `3` đến `3000`.

> **EN:** `-105 <= nums[i] <= 105`
>
> **VI:** Mỗi `nums[i]` nằm trong khoảng `-10^5` đến `10^5`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/3sum/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Two Pointers.txt
blob SHA: 0fac4442afd9fb3ca107f2ed6cc743fe6f50139c
```
