# 1. Two Sum

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
>
> **VI:** Cho mảng số nguyên `nums` và số nguyên `target`, hãy trả về index của hai số có tổng bằng `target`.

> **EN:** You may assume that each input would have exactly one solution, and you may not use the same element twice.
>
> **VI:** Có thể giả sử mỗi input có đúng một lời giải và không được dùng cùng một phần tử hai lần.

> **EN:** You can return the answer in any order.
>
> **VI:** Có thể trả hai index theo bất kỳ thứ tự nào.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

> **EN:** Explanation: Because `nums[0]` + `nums[1]` == 9, we return [0, 1].
>
> **VI:** Vì `nums[0] + nums[1] == 9`, trả `[0,1]`.

### Example 2 / Ví dụ 2

```text
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

### Example 3 / Ví dụ 3

```text
Input: nums = [3,3], target = 6
Output: [0,1]
```

## Constraints / Ràng buộc

> **EN:** `2 <= `nums`.length <= 10^4`
>
> **VI:** `2 <= nums.length <= 10^4`.

> **EN:** `-10^9 <= `nums[i]` <= 10^9`
>
> **VI:** `-10^9 <= nums[i] <= 10^9`.

> **EN:** `-10^9 <= `target` <= 10^9`
>
> **VI:** `-10^9 <= target <= 10^9`.

> **EN:** Only one valid answer exists.
>
> **VI:** Chỉ tồn tại một đáp án hợp lệ.

## Follow-up / Câu hỏi mở rộng

> **EN:** Follow-up: Can you come up with an algorithm that is less than O(n2) time complexity?
>
> **VI:** Có thể tìm thuật toán nhanh hơn `O(n^2)` không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/two-sum/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
