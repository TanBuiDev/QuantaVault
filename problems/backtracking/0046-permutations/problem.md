# 46. Permutations

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.
>
> **VI:** Cho mảng `nums` gồm các số nguyên phân biệt, hãy trả về tất cả các hoán vị có thể có. Có thể trả về theo bất kỳ thứ tự nào.

## Examples / Ví dụ
### Example 1 / Ví dụ 1
```text
Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

### Example 2 / Ví dụ 2
```text
Input: nums = [0,1]
Output: [[0,1],[1,0]]
```

### Example 3 / Ví dụ 3
```text
Input: nums = [1]
Output: [[1]]
```

## Constraints / Ràng buộc
> **EN:** `1 <= nums.length <= 6`
>
> **VI:** `nums` có từ 1 đến 6 phần tử.

> **EN:** `-10 <= nums[i] <= 10`
>
> **VI:** Mỗi phần tử nằm trong khoảng -10 đến 10.

> **EN:** All the integers of nums are unique.
>
> **VI:** Tất cả các số trong `nums` là phân biệt.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/permutations/

English wording preserved from `raw/top-interview-150/Backtracking.txt` (blob `7f95978509c050faa1cfe1181871c15bf3b09c0e`).
