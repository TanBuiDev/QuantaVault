# 290. Word Pattern

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given a `pattern` and a string `s`, find if `s` follows the same `pattern`.
>
> **VI:** Cho `pattern` và chuỗi `s`, hãy xác định `s` có tuân theo cùng pattern hay không.

> **EN:** Here follow means a full match, such that there is a bijection between a letter in `pattern` and a non-empty word in `s`. Specifically:
>
> **VI:** “Follow” nghĩa là match hoàn toàn, sao cho tồn tại một bijection giữa mỗi ký tự trong `pattern` và một word không rỗng trong `s`.

> **EN:** Each letter in `pattern` maps to exactly one unique word in `s`.
>
> **VI:** Mỗi letter trong `pattern` map tới đúng một unique word.

> **EN:** Each unique word in `s` maps to exactly one letter in `pattern`.
>
> **VI:** Mỗi unique word trong `s` map tới đúng một letter.

> **EN:** No two letters map to the same word, and no two words map to the same letter.
>
> **VI:** Không được có hai letter cùng map tới một word, và không được có hai word cùng map tới một letter.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: pattern = "abba", s = "dog cat cat dog"
Output: true
```

> **EN:** Explanation: The bijection can be established as: 'a' maps to "dog". 'b' maps to "cat".
>
> **VI:** Có thể thiết lập bijection `a -> dog`, `b -> cat`.

### Example 2 / Ví dụ 2

```text
Input: pattern = "abba", s = "dog cat cat fish"
Output: false
```

### Example 3 / Ví dụ 3

```text
Input: pattern = "aaaa", s = "dog cat cat dog"
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= `pattern`.length <= 300`
>
> **VI:** Độ dài `pattern` từ `1` đến `300`.

> **EN:** `pattern` contains only lower-case English letters.
>
> **VI:** `pattern` chỉ gồm chữ cái tiếng Anh viết thường.

> **EN:** `1 <= `s`.length <= 3000`
>
> **VI:** Độ dài `s` từ `1` đến `3000`.

> **EN:** `s` contains only lowercase English letters and spaces ' '.
>
> **VI:** `s` chỉ gồm chữ cái viết thường và khoảng trắng.

> **EN:** `s` does not contain any leading or trailing spaces.
>
> **VI:** `s` không có khoảng trắng đầu/cuối.

> **EN:** All the words in `s` are separated by a single space.
>
> **VI:** Các word được ngăn cách bởi đúng một khoảng trắng.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/word-pattern/

English wording preserved from `raw/top-interview-150/Hashmap.txt` (blob `27a5727700e86d5e4e15f746cd2ae51f3d8c2e01`).
