# 42. Trapping Rain Water

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.
>
> **VI:** Cho `n` số nguyên không âm biểu diễn bản đồ độ cao, trong đó mỗi cột có chiều rộng `1`, hãy tính lượng nước có thể giữ lại sau khi mưa.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
```

> **EN:** Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
>
> **VI:** Giải thích: Bản đồ độ cao được biểu diễn bởi mảng `[0,1,0,2,1,0,1,3,2,1,2,1]`; tổng cộng giữ được `6` đơn vị nước.

### Example 2 / Ví dụ 2

```text
Input: height = [4,2,0,3,2,5]
Output: 9
```

## Constraints / Ràng buộc

> **EN:** `n == `height`.length`
>
> **VI:** `n` bằng độ dài `height`.

> **EN:** `1 <= n <= 2 * 10^4`
>
> **VI:** `n` từ `1` đến `2 * 10^4`.

> **EN:** `0 <= `height[i]` <= 10^5`
>
> **VI:** `0 <= height[i] <= 10^5`
## Source / Nguồn

LeetCode: https://leetcode.com/problems/trapping-rain-water/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```

Media is intentionally not included in the current migration pass.
