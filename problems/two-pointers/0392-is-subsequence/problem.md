# 392. Is Subsequence

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given two strings s and t, return true if s is a subsequence of t, or false otherwise.
>
> **VI:** Cho hai chuỗi `s` và `t`, hãy trả về `true` nếu `s` là một subsequence của `t`, ngược lại trả về `false`.

> **EN:** A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).
>
> **VI:** Một subsequence được tạo bằng cách xóa một số ký tự (có thể không xóa ký tự nào) khỏi chuỗi gốc nhưng vẫn giữ nguyên thứ tự tương đối của các ký tự còn lại. Ví dụ `"ace"` là subsequence của `"abcde"`, còn `"aec"` thì không.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "abc", t = "ahbgdc"
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: s = "axc", t = "ahbgdc"
Output: false
```

## Constraints / Ràng buộc

> **EN:** `0 <= s.length <= 100`
>
> **VI:** Độ dài `s` từ `0` đến `100`.

> **EN:** `0 <= t.length <= 104`
>
> **VI:** Độ dài `t` từ `0` đến `10^4`.

> **EN:** s and t consist only of lowercase English letters.
>
> **VI:** `s` và `t` chỉ gồm chữ cái tiếng Anh viết thường.

## Follow up / Câu hỏi mở rộng

> **EN:** Suppose there are lots of incoming s, say s1, s2, ..., sk where k >= 109, and you want to check one by one to see if t has its subsequence. In this scenario, how would you change your code?
>
> **VI:** Giả sử có rất nhiều chuỗi truy vấn `s1, s2, ..., sk` với `k >= 10^9`, và cần lần lượt kiểm tra chúng có phải subsequence của cùng một `t` hay không. Khi đó bạn sẽ thay đổi cách làm thế nào?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/is-subsequence/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Two Pointers.txt
blob SHA: 0fac4442afd9fb3ca107f2ed6cc743fe6f50139c
```
