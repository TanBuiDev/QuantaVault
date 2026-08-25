# 120. Triangle

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a `triangle` array, return the minimum path sum from top to bottom.
>
> **VI:** Cho một mảng dạng tam giác, hãy trả về tổng đường đi nhỏ nhất từ đỉnh xuống đáy.

> **EN:** For each step, you may move to an adjacent number of the row below. More formally, if you are on index i on the current row, you may move to either index i or index i + 1 on the `next` row.
>
> **VI:** Ở mỗi bước, bạn chỉ được đi tới một số kề ở hàng dưới. Cụ thể, từ index `i` ở hàng hiện tại, có thể đi tới index `i` hoặc `i + 1` ở hàng kế tiếp.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
Output: 11
```

> **EN:** Explanation: The `triangle` looks like:
>    2
>   3 4
>  6 5 7
> 4 1 8 3
> The minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11.
>
> **VI:** Đường tối ưu là `2 -> 3 -> 5 -> 1`, tổng bằng `11`.

### Example 2 / Ví dụ 2

```text
Input: triangle = [[-10]]
Output: -10
```

## Constraints / Ràng buộc

> **EN:** `1 <= `triangle`.length <= 200`
>
> **VI:** Số hàng từ `1` đến `200`.

> **EN:** `triangle[0].length == 1`
>
> **VI:** Hàng đầu có đúng một phần tử.

> **EN:** `triangle[i].length == `triangle`[i - 1].length + 1`
>
> **VI:** Mỗi hàng dài hơn hàng trước đúng một phần tử.

> **EN:** `-10^4 <= `triangle[i]` <= 10^4`
>
> **VI:** `-10^4 <= triangle[i] <= 10^4`

> **EN:** Follow up: Could you do this using only O(n) extra space, where n is the total number of rows in the `triangle`?
>
> **VI:** Follow-up: Có thể giải bằng `O(n)` bộ nhớ phụ với `n` là số hàng không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/triangle/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
