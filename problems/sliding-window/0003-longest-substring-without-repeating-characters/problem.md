# 3. Longest Substring Without Repeating Characters

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a string s, find the length of the longest substring without duplicate characters.
>
> **VI:** Cho chuỗi `s`, hãy tìm độ dài của substring dài nhất không chứa ký tự lặp.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "abcabcbb"
Output: 3
```

> **EN:** Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.
>
> **VI:** Đáp án có thể là `"abc"`, độ dài `3`; `"bca"` và `"cab"` cũng đúng.

### Example 2 / Ví dụ 2

```text
Input: s = "bbbbb"
Output: 1
```

> **EN:** Explanation: The answer is "b", with the length of 1.
>
> **VI:** Substring dài nhất không lặp là `"b"`, độ dài `1`.

### Example 3 / Ví dụ 3

```text
Input: s = "pwwkew"
Output: 3
```

> **EN:** Explanation: The answer is "wke", with the length of 3.
> Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
>
> **VI:** Đáp án là `"wke"`, độ dài `3`. Lưu ý đáp án phải là **substring**; `"pwke"` chỉ là subsequence chứ không phải substring.

## Constraints / Ràng buộc

> **EN:** `0 <= s.length <= 105`
>
> **VI:** `0 <= s.length <= 10^5`.

> **EN:** s consists of English letters, digits, symbols and spaces.
>
> **VI:** `s` gồm chữ cái tiếng Anh, chữ số, ký hiệu và khoảng trắng.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/longest-substring-without-repeating-characters/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Sliding Window.txt
blob SHA: bb49634444716591f3f66b2bbff18e581b5e106c
```
