# 373. Find K Pairs with Smallest Sums

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`.
>
> **VI:** Cho hai mảng số nguyên `nums1`, `nums2` đã tăng không giảm và số nguyên `k`.

> **EN:** Define a pair (u, v) which consists of one element from the first array and one element from the second array. Return the `k` pairs with the smallest sums.
>
> **VI:** Một cặp `(u,v)` lấy một phần tử từ mỗi mảng. Hãy trả về `k` cặp có tổng nhỏ nhất.

## Examples / Ví dụ

```text
Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
Output: [[1,2],[1,4],[1,6]]
```

```text
Input: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
Output: [[1,1],[1,1]]
```

## Constraints / Ràng buộc

> **EN:** `1 <= `nums1`.length, `nums2`.length <= 10^5`, arrays are sorted, `1 <= `k` <= 10^4`, and `k <= `nums1`.length * `nums2`.length`.
>
> **VI:** Hai mảng không rỗng và đã sort; `k` hợp lệ và không vượt số cặp có thể tạo.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/find-k-pairs-with-smallest-sums/

English wording preserved from `raw/top-interview-150/Heap.txt` (blob `fbb1dbdac09eda7a70bdcda5a956eee1c308b031`).
