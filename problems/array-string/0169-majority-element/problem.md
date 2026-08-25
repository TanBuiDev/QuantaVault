# 169. Majority Element

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given an array `nums` of size `n`, return the `majority` element.
>
> **VI:** Cho một mảng `nums` có kích thước `n`, hãy trả về **phần tử chiếm đa số**.

> **EN:** The `majority` element is the element that appears more than `⌊n / 2⌋` times. You may assume that the `majority` element always exists in the array.
>
> **VI:** Phần tử chiếm đa số là phần tử xuất hiện **nhiều hơn `⌊n / 2⌋` lần**. Bạn có thể giả định rằng phần tử chiếm đa số luôn tồn tại trong mảng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums = [3,2,3]
```

**Output / Đầu ra**

```text
3
```

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums = [2,2,1,1,1,2,2]
```

**Output / Đầu ra**

```text
2
```

## Constraints / Ràng buộc

> **EN:** `n == `nums`.length`
>
> **VI:** `n` bằng độ dài của `nums`.

> **EN:** `1 <= n <= 5 * 10^4`
>
> **VI:** `1 <= n <= 5 * 10^4`

> **EN:** `-10^9 <= `nums[i]` <= 10^9`
>
> **VI:** `-10^9 <= nums[i] <= 10^9`

> **EN:** The input is generated such that a `majority` element will exist in the array.
>
> **VI:** Dữ liệu đầu vào được tạo sao cho luôn tồn tại một phần tử chiếm đa số.

## Follow-up / Câu hỏi mở rộng

> **EN:** Could you solve the problem in linear time and in `O(1)` space?
>
> **VI:** Bạn có thể giải bài toán trong thời gian tuyến tính và với `O(1)` bộ nhớ phụ không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/majority-element/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`.
