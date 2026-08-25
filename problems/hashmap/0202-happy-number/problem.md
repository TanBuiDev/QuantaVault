# 202. Happy Number

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Write an algorithm to determine if a number `n` is happy.
>
> **VI:** Viết thuật toán xác định số nguyên `n` có phải happy number hay không.

> **EN:** A happy number is a number defined by the following process:
>
> **VI:** Happy number được định nghĩa bằng quá trình sau.

> **EN:** Starting with any positive integer, replace the number by the sum of the squares of its digits.
>
> **VI:** Bắt đầu từ số nguyên dương, thay số đó bằng tổng bình phương các chữ số.

> **EN:** Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
>
> **VI:** Lặp cho tới khi số trở thành `1` hoặc rơi vào một cycle vô hạn không chứa `1`.

> **EN:** Those numbers for which this process ends in 1 are happy.
>
> **VI:** Những số cuối cùng đi tới `1` là happy number.

> **EN:** Return `true` if `n` is a happy number, and `false` if not.
>
> **VI:** Trả `true` nếu `n` là happy number, ngược lại `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: n = 19
Output: true
```

> **EN:** Explanation:
> 1^2 + 9^2 = 82
> 8^2 + 2^2 = 68
> 6^2 + 8^2 = 100
> 1^2 + 0^2 + 0^2 = 1
>
> **VI:** Chuỗi biến đổi của `19` lần lượt đi qua `82 -> 68 -> 100 -> 1`, nên đây là happy number.

### Example 2 / Ví dụ 2

```text
Input: n = 2
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= `n` <= 2^31 - 1`
>
> **VI:** `1 <= n <= 2^31 - 1`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/happy-number/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
