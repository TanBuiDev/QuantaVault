# 58. Length of Last Word

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given a string s consisting of words and spaces, return the length of the last word in the string.
>
> **VI:** Cho một chuỗi `s` gồm các từ và khoảng trắng, hãy trả về độ dài của từ cuối cùng trong chuỗi.

> **EN:** A word is a maximal substring consisting of non-space characters only.
>
> **VI:** Một từ là một substring cực đại chỉ gồm các ký tự không phải khoảng trắng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "Hello World"
Output: 5
```

> **EN:** Explanation: The last word is "World" with length 5.
>
> **VI:** Giải thích: Từ cuối là `"World"`, có độ dài `5`.

### Example 2 / Ví dụ 2

```text
Input: s = "   fly me   to   the moon  "
Output: 4
```

> **EN:** Explanation: The last word is "moon" with length 4.
>
> **VI:** Giải thích: Từ cuối là `"moon"`, có độ dài `4`.

### Example 3 / Ví dụ 3

```text
Input: s = "luffy is still joyboy"
Output: 6
```

> **EN:** Explanation: The last word is "joyboy" with length 6.
>
> **VI:** Giải thích: Từ cuối là `"joyboy"`, có độ dài `6`.

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 104`
>
> **VI:** Độ dài `s` từ `1` đến `10^4`.

> **EN:** s consists of only English letters and spaces ' '.
>
> **VI:** `s` chỉ gồm chữ cái tiếng Anh và dấu cách `' '`.

> **EN:** There will be at least one word in s.
>
> **VI:** `s` luôn chứa ít nhất một từ.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/length-of-last-word/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
