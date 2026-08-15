# 13. Roman to Integer

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
>
> **VI:** Số La Mã được biểu diễn bởi bảy ký hiệu: `I, V, X, L, C, D, M`.

| Symbol / Ký hiệu | Value / Giá trị |
|---|---:|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

> **EN:** Roman numerals are usually written largest to smallest from left to right. However, subtractive forms are used for 4, 9, 40, 90, 400 and 900: IV, IX, XL, XC, CD and CM.
>
> **VI:** Thông thường ký hiệu được viết từ giá trị lớn tới nhỏ. Riêng `4, 9, 40, 90, 400, 900` dùng dạng trừ: `IV, IX, XL, XC, CD, CM`.

> **EN:** Given a roman numeral, convert it to an integer.
>
> **VI:** Cho một số La Mã, hãy chuyển nó thành số nguyên.

## Examples / Ví dụ

```text
Input: s = "III"
Output: 3
```

```text
Input: s = "LVIII"
Output: 58
```

```text
Input: s = "MCMXCIV"
Output: 1994
```

> **EN:** M = 1000, CM = 900, XC = 90 and IV = 4.
>
> **VI:** `M = 1000`, `CM = 900`, `XC = 90`, `IV = 4`.

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 15`
>
> **VI:** Độ dài `s` từ `1` đến `15`.

> **EN:** s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
>
> **VI:** `s` chỉ chứa các ký hiệu La Mã hợp lệ.

> **EN:** It is guaranteed that s is a valid roman numeral in the range [1, 3999].
>
> **VI:** Đề đảm bảo `s` là số La Mã hợp lệ trong khoảng `[1,3999]`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/roman-to-integer/

English source: `raw/top-interview-150/Array  String.txt`, blob `b1c7a453f152629ce35040af85f2b1f4c22f589e`.
