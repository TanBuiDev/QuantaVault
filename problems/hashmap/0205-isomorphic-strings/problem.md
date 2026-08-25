# 205. Isomorphic Strings

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given two strings `s` and `t`, determine if they are isomorphic.
>
> **VI:** Cho hai chuỗi `s` và `t`, hãy xác định chúng có isomorphic hay không.

> **EN:** Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.
>
> **VI:** Hai chuỗi isomorphic nếu có thể thay thế các ký tự trong `s` để thu được `t`.

> **EN:** All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.
>
> **VI:** Mọi lần xuất hiện của cùng một ký tự phải được thay thế nhất quán, thứ tự được giữ nguyên. Hai ký tự khác nhau không được map vào cùng một ký tự, nhưng một ký tự có thể map vào chính nó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "egg", t = "add"
Output: true
```

> **EN:** Explanation: The strings `s` and `t` can be made identical by: Mapping 'e' to 'a'. Mapping 'g' to 'd'.
>
> **VI:** Có thể map `e -> a` và `g -> d` một cách nhất quán.

### Example 2 / Ví dụ 2

```text
Input: s = "f11", t = "b23"
Output: false
```

> **EN:** Explanation: The strings `s` and `t` can not be made identical as '1' needs to be mapped to both '2' and '3'.
>
> **VI:** Không hợp lệ vì `1` sẽ phải map đồng thời vào cả `2` và `3`.

### Example 3 / Ví dụ 3

```text
Input: s = "paper", t = "title"
Output: true
```

## Constraints / Ràng buộc

> **EN:** `1 <= `s`.length <= 5 * 10^4`
>
> **VI:** `1 <= s.length <= 5 * 10^4`.

> **EN:** `t.length == `s`.length`
>
> **VI:** Hai chuỗi có cùng độ dài.

> **EN:** `s` and `t` consist of any valid ascii character.
>
> **VI:** `s` và `t` gồm các ký tự ASCII hợp lệ.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/isomorphic-strings/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
