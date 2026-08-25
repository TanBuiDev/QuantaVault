# 172. Factorial Trailing Zeroes

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an integer `n`, return the number of trailing zeroes in `n`!.
>
> **VI:** Cho số nguyên `n`, hãy trả về số lượng chữ số 0 liên tiếp ở cuối của `n!`.

> **EN:** Note that `n`! = `n` * (`n` - 1) * (`n` - 2) * ... * 3 * 2 * 1.
>
> **VI:** Lưu ý `n! = n * (n - 1) * ... * 2 * 1`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: n = 3
Output: 0
```

### Example 2 / Ví dụ 2
```text
Input: n = 5
Output: 1
```

### Example 3 / Ví dụ 3
```text
Input: n = 0
Output: 0
```

## Constraints / Ràng buộc

> **EN:** `0 <= `n` <= 10^4`
>
> **VI:** `n` nằm trong khoảng từ `0` đến `10^4`.

## Follow-up / Câu hỏi mở rộng

> **EN:** Could you write a solution that works in logarithmic time complexity?
>
> **VI:** Bạn có thể viết lời giải chạy trong thời gian logarithmic không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/factorial-trailing-zeroes/

English wording preserved from `raw/top-interview-150/Math.txt` (blob `acbbece61493a6901c8c6e4974b6103cfb12b086`).
