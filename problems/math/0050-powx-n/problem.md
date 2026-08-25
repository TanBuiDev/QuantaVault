# 50. Pow(x, n)

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Implement `pow(`x`, `n`)`, which calculates `x` raised to the power `n` (i.e., $`x`^`n`$).
>
> **VI:** Cài đặt `pow(x, n)`, tính `x` lũy thừa `n` ($x^n$).

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: x = 2.00000, n = 10
Output: 1024.00000
```

### Example 2 / Ví dụ 2
```text
Input: x = 2.10000, n = 3
Output: 9.26100
```

### Example 3 / Ví dụ 3
```text
Input: x = 2.00000, n = -2
Output: 0.25000
```
> **EN:** Explanation: $2^{-2} = \frac{1}{2^2} = \frac{1}{4} = 0.25$
>
> **VI:** Số mũ âm tương đương lấy nghịch đảo ($2^{-2} = \frac{1}{2^2} = \frac{1}{4} = 0.25$), nên kết quả là `0.25`.

## Constraints / Ràng buộc

> **EN:** `-100.0 < `x` < 100.0`
>
> **VI:** `x` nằm giữa `-100` và `100`.

> **EN:** `$-2^{31} <= `n` <= 2^{31} - 1$`
>
> **VI:** `n` nằm trong miền số nguyên 32-bit đã cho.

> **EN:** `n is an integer.`
>
> **VI:** `n` là số nguyên.

> **EN:** `Either `x` is not `zero` or `n` > 0.`
>
> **VI:** Hoặc `x != 0`, hoặc `n > 0`.

> **EN:** `$-10^4 <= `x`^`n` <= 10^4$`
>
> **VI:** Kết quả nằm trong miền giá trị đã cho.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/powx-n/

English wording preserved from `raw/top-interview-150/Math.txt` (blob `acbbece61493a6901c8c6e4974b6103cfb12b086`).
