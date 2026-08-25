# 97. Interleaving String

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an interleaving of `s1` and `s2`.
>
> **VI:** Cho ba chuỗi `s1`, `s2`, `s3`, hãy xác định `s3` có được tạo bởi một phép xen kẽ của `s1` và `s2` hay không.

> **EN:** An interleaving of two strings s and t is a configuration where s and t are divided into n and m substrings respectively, such that:
>
> **VI:** Một interleaving của hai chuỗi `s` và `t` là cách chia chúng thành lần lượt `n` và `m` chuỗi con sao cho:

```text
s = s1 + s2 + ... + sn
t = t1 + t2 + ... + tm
|n - m| <= 1
```

> **EN:** The interleaving is `s1` + t1 + `s2` + t2 + `s3` + t3 + ... or t1 + `s1` + t2 + `s2` + t3 + `s3` + ...
>
> **VI:** Chuỗi xen kẽ ghép các phần của hai chuỗi theo thứ tự tương đối ban đầu, luân phiên theo định nghĩa trên.

> **EN:** Note: a + b is the concatenation of strings a and b.
>
> **VI:** Lưu ý: `a + b` là phép nối chuỗi `a` và `b`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
```

> **EN:** Explanation: One way to obtain `s3` is:
> Split s1 into s1 = "aa" + "bc" + "c", and s2 into s2 = "dbbc" + "a".
> Interleaving the two splits, we get "aa" + "dbbc" + "bc" + "a" + "c" = "aadbbcbcac".
> Since s3 can be obtained by interleaving s1 and s2, we return true.
>
> **VI:** Một cách chia và xen kẽ hai chuỗi tạo đúng `s3`, nên trả về `true`.

### Example 2 / Ví dụ 2

```text
Input: s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false
```

> **EN:** Explanation: Notice how it is impossible to interleave `s2` with any other string to obtain `s3`.
>
> **VI:** Không thể xen kẽ `s1` và `s2` theo đúng thứ tự để tạo `s3`.

### Example 3 / Ví dụ 3

```text
Input: s1 = "", s2 = "", s3 = ""
Output: true
```

## Constraints / Ràng buộc

> **EN:** `0 <= `s1`.length, `s2`.length <= 100`
>
> **VI:** Độ dài `s1` và `s2` từ `0` đến `100`.

> **EN:** `0 <= `s3`.length <= 200`
>
> **VI:** Độ dài `s3` từ `0` đến `200`.

> **EN:** `s1, `s2`, and `s3` consist of lowercase English letters.`
>
> **VI:** Ba chuỗi chỉ gồm chữ cái tiếng Anh viết thường.

> **EN:** Follow up: Could you solve it using only O(`s2`.length) additional memory space?
>
> **VI:** Follow-up: Có thể giải bằng `O(s2.length)` bộ nhớ phụ không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/interleaving-string/

English wording preserved from `raw/top-interview-150/Multidimensional DP.txt` (blob `0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f`).
