# 28. Find the Index of the First Occurrence in a String

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or -1 if `needle` is not part of `haystack`.
>
> **VI:** Cho hai chuỗi `needle` và `haystack`, hãy trả về index của lần xuất hiện đầu tiên của `needle` trong `haystack`, hoặc `-1` nếu `needle` không xuất hiện.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
```

> **EN:** Explanation: "sad" occurs at index 0 and 6. The first occurrence is at index 0, so we return 0.
>
> **VI:** Giải thích: `"sad"` xuất hiện tại index `0` và `6`; lần đầu ở `0` nên trả `0`.

### Example 2 / Ví dụ 2

```text
Input: haystack = "leetcode", needle = "leeto"
Output: -1
```

> **EN:** Explanation: "leeto" did not occur in "leetcode", so we return -1.
>
> **VI:** Giải thích: `"leeto"` không xuất hiện trong `"leetcode"`, nên trả `-1`.

## Constraints / Ràng buộc

> **EN:** `1 <= `haystack`.length, `needle`.length <= 10^4`
>
> **VI:** `1 <= haystack.length, needle.length <= 10^4`

> **EN:** `haystack` and `needle` consist of only lowercase English characters.
>
> **VI:** `haystack` và `needle` chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
