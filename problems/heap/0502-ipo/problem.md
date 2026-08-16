# 502. IPO

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** You are given `n` projects where project `i` has pure profit `profits[i]` and requires minimum capital `capital[i]`. Initially you have `w` capital. Pick at most `k` distinct projects to maximize final capital.
>
> **VI:** Có `n` dự án, dự án `i` cho lợi nhuận `profits[i]` và cần vốn tối thiểu `capital[i]`. Ban đầu có vốn `w`; hãy chọn tối đa `k` dự án khác nhau để tối đa hóa vốn cuối cùng.

> **EN:** When you finish a project, its profit is added to your total capital. The answer fits in a 32-bit signed integer.
>
> **VI:** Sau khi hoàn thành dự án, lợi nhuận được cộng vào vốn. Đáp án nằm trong `int` 32-bit.

## Examples / Ví dụ

```text
Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]
Output: 4
```

```text
Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]
Output: 6
```

## Constraints / Ràng buộc

> **EN:** `1 <= k,n <= 10^5`, `0 <= w <= 10^9`, profits are nonnegative, and capital requirements are nonnegative.
>
> **VI:** `k,n` tối đa `10^5`; vốn và lợi nhuận không âm theo ràng buộc đề.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/ipo/

English wording preserved from `raw/top-interview-150/Heap.txt` (blob `fbb1dbdac09eda7a70bdcda5a956eee1c308b031`).
