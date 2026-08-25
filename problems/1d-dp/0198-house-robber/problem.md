# 198. House Robber

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.
>
> **VI:** Bạn là một tên trộm chuyên nghiệp đang lên kế hoạch trộm các ngôi nhà dọc một con phố. Mỗi nhà có một số tiền nhất định; hai nhà kề nhau có hệ thống an ninh liên kết nên không thể trộm cả hai trong cùng đêm.

> **EN:** Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.
>
> **VI:** Cho mảng số nguyên `nums` biểu diễn số tiền trong từng nhà, hãy trả về số tiền lớn nhất có thể lấy mà không kích hoạt báo động.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: nums = [1,2,3,1]
Output: 4
```
> **EN:** Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
> Total amount you can rob = 1 + 3 = 4.
>
> **VI:** Trộm nhà 1 và nhà 3, tổng `1 + 3 = 4`.

### Example 2 / Ví dụ 2
```text
Input: nums = [2,7,9,3,1]
Output: 12
```
> **EN:** Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
> Total amount you can rob = 2 + 9 + 1 = 12.
>
> **VI:** Trộm nhà 1, 3 và 5, tổng `12`.

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 100`
>
> **VI:** Có từ `1` đến `100` ngôi nhà.

> **EN:** `0 <= `nums[i]` <= 400`
>
> **VI:** Tiền trong mỗi nhà từ `0` đến `400`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/house-robber/

English wording preserved from `raw/top-interview-150/1D DP.txt` (blob `df3dd4badad938a311d58828af8e8062866c43fe`).
