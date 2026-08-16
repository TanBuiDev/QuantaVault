# 77. Combinations

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].
>
> **VI:** Cho hai số nguyên `n` và `k`, hãy trả về tất cả các tổ hợp gồm `k` số được chọn từ đoạn `[1, n]`.

> **EN:** You may return the answer in any order.
>
> **VI:** Có thể trả về kết quả theo bất kỳ thứ tự nào.

## Examples / Ví dụ
### Example 1 / Ví dụ 1
```text
Input: n = 4, k = 2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
Explanation: There are 4 choose 2 = 6 total combinations.
Note that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.
```

**VI:** Có tổng cộng `C(4,2) = 6` tổ hợp; thứ tự phần tử trong tổ hợp không tạo ra đáp án mới.

### Example 2 / Ví dụ 2
```text
Input: n = 1, k = 1
Output: [[1]]
Explanation: There is 1 choose 1 = 1 total combination.
```

## Constraints / Ràng buộc
> **EN:** `1 <= n <= 20`
>
> **VI:** `n` từ 1 đến 20.

> **EN:** `1 <= k <= n`
>
> **VI:** `k` từ 1 đến `n`.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/combinations/

English wording preserved from `raw/top-interview-150/Backtracking.txt` (blob `7f95978509c050faa1cfe1181871c15bf3b09c0e`).
