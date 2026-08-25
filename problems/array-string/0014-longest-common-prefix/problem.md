# 14. Longest Common Prefix

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Write a function to find the longest common prefix string amongst an array of strings.
>
> **VI:** Hãy viết một hàm tìm chuỗi tiền tố chung dài nhất trong một mảng các chuỗi.

> **EN:** If there is no common prefix, return an `empty` string "".
>
> **VI:** Nếu không có tiền tố chung, hãy trả về chuỗi rỗng `""`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

### Example 2 / Ví dụ 2

```text
Input: strs = ["dog","racecar","car"]
Output: ""
```

> **EN:** Explanation: There is no common prefix among the input strings.
>
> **VI:** Giải thích: Không có tiền tố chung giữa các chuỗi đầu vào.

## Constraints / Ràng buộc

> **EN:** `1 <= `strs`.length <= 200`
>
> **VI:** Số lượng chuỗi từ `1` đến `200`.

> **EN:** `0 <= `strs[i]`.length <= 200`
>
> **VI:** Độ dài mỗi chuỗi từ `0` đến `200`.

> **EN:** `strs[i]` consists of only lowercase English letters if it is non-`empty`.
>
> **VI:** Nếu không rỗng, mỗi `strs[i]` chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/longest-common-prefix/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
