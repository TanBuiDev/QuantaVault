# 66. Plus One

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's.
>
> **VI:** Bạn được cho một số nguyên lớn dưới dạng mảng `digits`, mỗi phần tử là một chữ số. Các chữ số được sắp từ hàng cao nhất đến thấp nhất từ trái sang phải và không có số 0 ở đầu.

> **EN:** Increment the large integer by one and return the resulting array of digits.
>
> **VI:** Hãy tăng số nguyên đó lên 1 và trả về mảng chữ số kết quả.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: digits = [1,2,3]
Output: [1,2,4]
```

### Example 2 / Ví dụ 2
```text
Input: digits = [4,3,2,1]
Output: [4,3,2,2]
```

### Example 3 / Ví dụ 3
```text
Input: digits = [9]
Output: [1,0]
```

## Constraints / Ràng buộc

> **EN:** `1 <= digits.length <= 100`
>
> **VI:** Mảng có từ 1 đến 100 chữ số.

> **EN:** `0 <= digits[i] <= 9`
>
> **VI:** Mỗi phần tử là một chữ số từ 0 đến 9.

> **EN:** `digits` does not contain any leading 0's.
>
> **VI:** Mảng không có số 0 ở đầu.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/plus-one/

English wording preserved from `raw/top-interview-150/Math.txt` (blob `acbbece61493a6901c8c6e4974b6103cfb12b086`).
