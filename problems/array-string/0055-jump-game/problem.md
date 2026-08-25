# 55. Jump Game

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.
>
> **VI:** Bạn được cho một mảng số nguyên `nums`. Ban đầu bạn đứng ở index đầu tiên của mảng, và mỗi phần tử biểu diễn độ dài bước nhảy tối đa tại vị trí đó.

> **EN:** Return `true` if you can reach the last index, or `false` otherwise.
>
> **VI:** Trả về `true` nếu bạn có thể tới index cuối cùng, ngược lại trả về `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: nums = [2,3,1,1,4]
Output: true
```

> **EN:** Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
>
> **VI:** Giải thích: Nhảy 1 bước từ index `0` đến `1`, sau đó nhảy 3 bước đến index cuối.

### Example 2 / Ví dụ 2

```text
Input: nums = [3,2,1,0,4]
Output: false
```

> **EN:** Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
>
> **VI:** Giải thích: Dù chọn cách nào bạn cũng bị chặn ở index `3`. Giá trị tại đó là `0`, nên không thể tới index cuối.

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 10^4`
>
> **VI:** Độ dài `nums` từ `1` đến `10^4`.

> **EN:** `0 <= `nums[i]` <= 10^5`
>
> **VI:** `0 <= nums[i] <= 10^5`
## Source / Nguồn

LeetCode: https://leetcode.com/problems/jump-game/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
