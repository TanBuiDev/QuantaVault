# 39. Combination Sum

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.
>
> **VI:** Cho mảng các số nguyên phân biệt `candidates` và số nguyên `target`, hãy trả về tất cả các tổ hợp duy nhất có tổng bằng `target`. Có thể trả về theo bất kỳ thứ tự nào.

> **EN:** The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
>
> **VI:** Mỗi số trong `candidates` có thể được chọn không giới hạn số lần. Hai tổ hợp khác nhau nếu tần suất của ít nhất một số được chọn khác nhau.

> **EN:** The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.
>
> **VI:** Test được tạo sao cho số tổ hợp duy nhất có tổng bằng `target` nhỏ hơn 150.

## Examples / Ví dụ
### Example 1 / Ví dụ 1
```text
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.
```

**VI:** Có hai tổ hợp: `2 + 2 + 3` và `7`.

### Example 2 / Ví dụ 2
```text
Input: candidates = [2,3,5], target = 8
Output: [[2,2,2,2],[2,3,3],[3,5]]
```

### Example 3 / Ví dụ 3
```text
Input: candidates = [2], target = 1
Output: []
```

## Constraints / Ràng buộc
> **EN:** `1 <= candidates.length <= 30`
>
> **VI:** `candidates` có từ 1 đến 30 phần tử.

> **EN:** `2 <= candidates[i] <= 40`
>
> **VI:** Mỗi ứng viên nằm trong khoảng 2 đến 40.

> **EN:** All elements of candidates are distinct.
>
> **VI:** Tất cả phần tử của `candidates` là phân biệt.

> **EN:** `1 <= target <= 40`
>
> **VI:** `target` nằm trong khoảng 1 đến 40.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/combination-sum/

English wording preserved from `raw/top-interview-150/Backtracking.txt` (blob `7f95978509c050faa1cfe1181871c15bf3b09c0e`).
