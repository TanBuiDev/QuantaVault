# 242. Valid Anagram

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given two strings s and t, return true if t is an anagram of s, and false otherwise.
>
> **VI:** Cho hai chuỗi `s` và `t`, trả về `true` nếu `t` là anagram của `s`, ngược lại trả về `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "anagram", t = "nagaram"
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: s = "rat", t = "car"
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= s.length, t.length <= 5 * 104`
>
> **VI:** Độ dài hai chuỗi nằm trong khoảng `1..5*10^4`.

> **EN:** s and t consist of lowercase English letters.
>
> **VI:** `s` và `t` chỉ gồm chữ cái tiếng Anh viết thường.

## Follow-up / Câu hỏi mở rộng

> **EN:** Follow up: What if the inputs contain Unicode characters? How would you adapt your solution to such a case?
>
> **VI:** Nếu input chứa Unicode characters thì cần điều chỉnh lời giải thế nào?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/valid-anagram/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
