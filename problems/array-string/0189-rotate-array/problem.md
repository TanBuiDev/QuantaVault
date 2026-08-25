# 189. Rotate Array

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer array `nums`, rotate the array to the `right` by `k` steps, where `k` is non-negative.
>
> **VI:** Cho một mảng số nguyên `nums`, hãy xoay mảng sang phải `k` bước, trong đó `k` không âm.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums = [1,2,3,4,5,6,7], k = 3
```

**Output / Đầu ra**

```text
[5,6,7,1,2,3,4]
```

> **EN:** Explanation:
> rotate 1 steps to the right: [7,1,2,3,4,5,6]
> rotate 2 steps to the right: [6,7,1,2,3,4,5]
> rotate 3 steps to the right: [5,6,7,1,2,3,4]
>
> **VI:** Giải thích:
> xoay sang phải 1 bước: `[7,1,2,3,4,5,6]`
> xoay sang phải 2 bước: `[6,7,1,2,3,4,5]`
> xoay sang phải 3 bước: `[5,6,7,1,2,3,4]`

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums = [-1,-100,3,99], k = 2
```

**Output / Đầu ra**

```text
[3,99,-1,-100]
```

> **EN:** Explanation:
> rotate 1 steps to the right: [99,-1,-100,3]
> rotate 2 steps to the right: [3,99,-1,-100]
>
> **VI:** Giải thích:
> xoay sang phải 1 bước: `[99,-1,-100,3]`
> xoay sang phải 2 bước: `[3,99,-1,-100]`

## Constraints / Ràng buộc

> **EN:** `1 <= `nums`.length <= 10^5`
>
> **VI:** `1 <= nums.length <= 10^5`

> **EN:** `-2^31 <= `nums[i]` <= 2^31 - 1`
>
> **VI:** `-2^31 <= nums[i] <= 2^31 - 1`

> **EN:** `0 <= `k` <= 10^5`
>
> **VI:** `0 <= k <= 10^5`
## Follow up / Câu hỏi mở rộng

> **EN:** Try to come up with as many solutions as you can. There are at least three different ways to solve this problem.
>
> **VI:** Hãy thử nghĩ ra càng nhiều cách giải càng tốt. Có ít nhất ba cách khác nhau để giải bài này.

> **EN:** Could you do it in-place with O(1) extra space?
>
> **VI:** Bạn có thể làm in-place với `O(1)` bộ nhớ phụ không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/rotate-array/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`. File này không chứa lời giải thuật toán.
