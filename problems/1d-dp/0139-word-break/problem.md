# 139. Word Break

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.
>
> **VI:** Cho chuỗi `s` và dictionary `wordDict`, trả về `true` nếu `s` có thể được tách thành một chuỗi gồm một hoặc nhiều từ trong dictionary.

> **EN:** Note that the same word in the dictionary may be reused multiple times in the segmentation.
>
> **VI:** Một từ trong dictionary có thể được dùng lại nhiều lần.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
```
> **EN:** Explanation: Return true because "leetcode" can be segmented as "leet code".
>
> **VI:** `"leetcode"` có thể tách thành `"leet code"`.

### Example 2 / Ví dụ 2
```text
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
```
> **EN:** Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
> Note that you are allowed to reuse a dictionary word.
>
> **VI:** Có thể tách thành `"apple pen apple"`; từ `apple` được dùng lại.

### Example 3 / Ví dụ 3
```text
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 300`
>
> **VI:** Độ dài `s` từ `1` đến `300`.

> **EN:** `1 <= wordDict.length <= 1000`
>
> **VI:** Dictionary có từ `1` đến `1000` từ.

> **EN:** `1 <= wordDict[i].length <= 20`
>
> **VI:** Mỗi từ dài từ `1` đến `20`.

> **EN:** `s and wordDict[i] consist of only lowercase English letters.`
>
> **VI:** `s` và các từ chỉ gồm chữ cái tiếng Anh viết thường.

> **EN:** `All the strings of wordDict are unique.`
>
> **VI:** Các từ trong dictionary là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/word-break/

English wording preserved from `raw/top-interview-150/1D DP.txt` (blob `df3dd4badad938a311d58828af8e8062866c43fe`).
