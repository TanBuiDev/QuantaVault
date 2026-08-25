# 76. Minimum Window Substring

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given two strings `s` and `t` of lengths m and n respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string "".
>
> **VI:** Cho hai chuỗi `s` và `t` có độ dài lần lượt là `m` và `n`, hãy trả về substring ngắn nhất của `s` chứa mọi ký tự trong `t`, kể cả số lần lặp. Nếu không tồn tại, trả về chuỗi rỗng `""`.

> **EN:** The testcases will be generated such that the answer is unique.
>
> **VI:** Test được tạo sao cho đáp án là duy nhất.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
```

> **EN:** Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string `t`.
>
> **VI:** `"BANC"` là window ngắn nhất chứa đủ `A`, `B`, `C` từ `t`.

### Example 2 / Ví dụ 2

```text
Input: s = "a", t = "a"
Output: "a"
```

> **EN:** Explanation: The entire string `s` is the minimum window.
>
> **VI:** Toàn bộ `s` chính là minimum window.

### Example 3 / Ví dụ 3

```text
Input: s = "a", t = "aa"
Output: ""
```

> **EN:** Explanation: Both 'a'`s` from `t` must be included in the window.
> Since the largest window of s only has one 'a', return empty string.
>
> **VI:** `t` cần hai ký tự `a`, nhưng `s` chỉ có một nên không có window hợp lệ.

## Constraints / Ràng buộc

> **EN:** `m == `s`.length`
>
> **VI:** `m` là độ dài `s`.

> **EN:** `n == `t`.length`
>
> **VI:** `n` là độ dài `t`.

> **EN:** `1 <= m, n <= 10^5`
>
> **VI:** `1 <= m, n <= 10^5`.

> **EN:** `s` and `t` consist of uppercase and lowercase English letters.
>
> **VI:** `s` và `t` chỉ gồm chữ cái tiếng Anh viết hoa và viết thường.

## Follow-up / Câu hỏi mở rộng

> **EN:** Follow up: Could you find an algorithm that runs in O(m + n) time?
>
> **VI:** Có thể tìm thuật toán chạy trong `O(m+n)` không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/minimum-window-substring/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Sliding Window.txt
blob SHA: bb49634444716591f3f66b2bbff18e581b5e106c
```
