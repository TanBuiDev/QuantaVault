# 383. Ransom Note

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.
>
> **VI:** Cho hai chuỗi `ransomNote` và `magazine`, hãy trả về `true` nếu có thể tạo `ransomNote` bằng các ký tự lấy từ `magazine`; nếu không thì trả về `false`.

> **EN:** Each letter in `magazine` can only be used once in `ransomNote`.
>
> **VI:** Mỗi ký tự trong `magazine` chỉ được sử dụng tối đa một lần để tạo `ransomNote`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: ransomNote = "a", magazine = "b"
Output: false
```

### Example 2 / Ví dụ 2

```text
Input: ransomNote = "aa", magazine = "ab"
Output: false
```

### Example 3 / Ví dụ 3

```text
Input: ransomNote = "aa", magazine = "aab"
Output: true
```

## Constraints / Ràng buộc

> **EN:** `1 <= `ransomNote`.length, `magazine`.length <= 10^5`
>
> **VI:** `1 <= ransomNote.length, magazine.length <= 10^5`

> **EN:** `ransomNote` and `magazine` consist of lowercase English letters.
>
> **VI:** Hai chuỗi chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/ransom-note/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Hashmap.txt
blob SHA: 27a5727700e86d5e4e15f746cd2ae51f3d8c2e01
```
