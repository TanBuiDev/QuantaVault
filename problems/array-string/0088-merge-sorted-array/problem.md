# 88. Merge Sorted Array

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.
>
> **VI:** Bạn được cho hai mảng số nguyên `nums1` và `nums2`, đều được sắp xếp theo **thứ tự không giảm**, cùng hai số nguyên `m` và `n`, lần lượt biểu thị số phần tử hợp lệ trong `nums1` và `nums2`.

> **EN:** Merge `nums1` and `nums2` into a single array sorted in non-decreasing order.
>
> **VI:** Hãy gộp `nums1` và `nums2` thành một mảng duy nhất được sắp xếp theo **thứ tự không giảm**.

> **EN:** The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.
>
> **VI:** Mảng đã sắp xếp cuối cùng **không được trả về từ hàm**, mà phải được lưu trực tiếp vào `nums1`. Vì vậy, `nums1` có độ dài `m + n`: `m` phần tử đầu là dữ liệu cần gộp, còn `n` phần tử cuối được đặt bằng `0` và phải bỏ qua. `nums2` có độ dài `n`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
```

**Output / Đầu ra**

```text
[1,2,2,3,5,6]
```

> **EN:** Explanation: The arrays we are merging are `[1,2,3]` and `[2,5,6]`. The result of the merge is `[1,2,2,3,5,6]` with the underlined elements coming from `nums1`.
>
> **VI:** Giải thích: Hai mảng thực sự cần gộp là `[1,2,3]` và `[2,5,6]`. Kết quả sau khi gộp là `[1,2,2,3,5,6]`.

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums1 = [1], m = 1, nums2 = [], n = 0
```

**Output / Đầu ra**

```text
[1]
```

> **EN:** Explanation: The arrays we are merging are `[1]` and `[]`. The result of the merge is `[1]`.
>
> **VI:** Giải thích: Hai mảng cần gộp là `[1]` và `[]`. Kết quả là `[1]`.

### Example 3 / Ví dụ 3

**Input / Đầu vào**

```text
nums1 = [0], m = 0, nums2 = [1], n = 1
```

**Output / Đầu ra**

```text
[1]
```

> **EN:** Explanation: The arrays we are merging are `[]` and `[1]`. The result of the merge is `[1]`. Note that because `m = 0`, there are no elements in `nums1`. The `0` is only there to ensure the merge result can fit in `nums1`.
>
> **VI:** Giải thích: Hai mảng cần gộp là `[]` và `[1]`. Kết quả là `[1]`. Vì `m = 0`, `nums1` ban đầu không có phần tử hợp lệ; số `0` chỉ là vùng trống để kết quả có thể được ghi vào `nums1`.

## Constraints / Ràng buộc

> **EN:** `nums1.length == `m` + n`
>
> **VI:** Độ dài `nums1` bằng `m + n`.

> **EN:** `nums2.length == n`
>
> **VI:** Độ dài `nums2` bằng `n`.

> **EN:** `0 <= `m`, `n` <= 200`
>
> **VI:** `m` và `n` nằm trong khoảng từ `0` đến `200`.

> **EN:** `1 <= `m` + `n` <= 200`
>
> **VI:** Tổng `m + n` nằm trong khoảng từ `1` đến `200`.

> **EN:** `-10^9 <= `nums1[i]`, `nums2[j]` <= 10^9`
>
> **VI:** Giá trị các phần tử nằm trong miền số nguyên được nêu trong đề nguồn.

## Follow-up / Câu hỏi mở rộng

> **EN:** Can you come up with an algorithm that runs in `O(`m` + `n`)` time?
>
> **VI:** Bạn có thể xây dựng thuật toán chạy trong thời gian `O(m + n)` không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/merge-sorted-array/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`. File này không chứa gợi ý hay lời giải thuật toán.
