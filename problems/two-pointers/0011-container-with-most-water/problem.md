# 11. Container With Most Water

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
>
> **VI:** Cho mảng số nguyên `height` có độ dài `n`. Có `n` đường thẳng đứng, trong đó đường thứ `i` có hai đầu mút là `(i, 0)` và `(i, height[i])`.

> **EN:** Find two lines that together with the x-axis form a container, such that the container contains the most water.
>
> **VI:** Hãy tìm hai đường thẳng cùng với trục `x` tạo thành một container chứa được nhiều nước nhất.

> **EN:** Return the maximum amount of water a container can store.
>
> **VI:** Trả về lượng nước lớn nhất mà container có thể chứa.

> **EN:** Notice that you may not slant the container.
>
> **VI:** Lưu ý rằng không được nghiêng container.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
```

> **EN:** Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
>
> **VI:** Giải thích: Các đường thẳng đứng được biểu diễn bởi mảng `[1,8,6,2,5,4,8,3,7]`. Trong trường hợp này, diện tích nước lớn nhất mà container có thể chứa là `49`.

### Example 2 / Ví dụ 2

```text
Input: height = [1,1]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** `n == height.length`
>
> **VI:** `n` chính là độ dài của `height`.

> **EN:** `2 <= n <= 105`
>
> **VI:** `2 <= n <= 10^5`.

> **EN:** `0 <= height[i] <= 104`
>
> **VI:** `0 <= height[i] <= 10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/container-with-most-water/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Two Pointers.txt
blob SHA: 0fac4442afd9fb3ca107f2ed6cc743fe6f50139c
```
