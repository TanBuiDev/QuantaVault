# 30. Substring with Concatenation of All Words

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** You are given a string s and an array of strings words. All the strings of words are of the same length.
>
> **VI:** Cho chuỗi `s` và mảng chuỗi `words`. Tất cả chuỗi trong `words` có cùng độ dài.

> **EN:** A concatenated string is a string that exactly contains all the strings of any permutation of words concatenated.
>
> **VI:** Một concatenated string là chuỗi chứa chính xác tất cả các chuỗi trong một hoán vị bất kỳ của `words` được nối liên tiếp.

> **EN:** For example, if words = ["ab","cd","ef"], then "abcdef", "abefcd", "cdabef", "cdefab", "efabcd", and "efcdab" are all concatenated strings. "acdbef" is not a concatenated string because it is not the concatenation of any permutation of words.
>
> **VI:** Ví dụ với `words = ["ab","cd","ef"]`, mọi cách nối đủ ba word theo một hoán vị đều hợp lệ; `"acdbef"` không hợp lệ vì không thể tách thành một hoán vị của các word đó.

> **EN:** Return an array of the starting indices of all the concatenated substrings in s. You can return the answer in any order.
>
> **VI:** Trả về mảng các index bắt đầu của mọi substring trong `s` là concatenation hợp lệ. Có thể trả kết quả theo bất kỳ thứ tự nào.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "barfoothefoobarman", words = ["foo","bar"]
Output: [0,9]
```

> **EN:** Explanation:
> The substring starting at 0 is "barfoo". It is the concatenation of ["bar","foo"] which is a permutation of words.
> The substring starting at 9 is "foobar". It is the concatenation of ["foo","bar"] which is a permutation of words.
>
> **VI:** Các substring bắt đầu tại `0` và `9` lần lượt là `"barfoo"` và `"foobar"`, đều ghép đúng các word cần thiết.

### Example 2 / Ví dụ 2

```text
Input: s = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]
Output: []
```

> **EN:** Explanation: There is no concatenated substring.
>
> **VI:** Không có concatenated substring hợp lệ.

### Example 3 / Ví dụ 3

```text
Input: s = "barfoofoobarthefoobarman", words = ["bar","foo","the"]
Output: [6,9,12]
```

> **EN:** Explanation:
> The substring starting at 6 is "foobarthe". It is the concatenation of ["foo","bar","the"].
> The substring starting at 9 is "barthefoo". It is the concatenation of ["bar","the","foo"].
> The substring starting at 12 is "thefoobar". It is the concatenation of ["the","foo","bar"].
>
> **VI:** Các vị trí `6`, `9`, `12` đều bắt đầu một window chứa đúng ba word theo một hoán vị.

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 104`
>
> **VI:** `1 <= s.length <= 10^4`.

> **EN:** `1 <= words.length <= 5000`
>
> **VI:** `1 <= words.length <= 5000`.

> **EN:** `1 <= words[i].length <= 30`
>
> **VI:** `1 <= words[i].length <= 30`.

> **EN:** s and words[i] consist of lowercase English letters.
>
> **VI:** `s` và `words[i]` chỉ gồm chữ cái tiếng Anh viết thường.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/substring-with-concatenation-of-all-words/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Sliding Window.txt
blob SHA: bb49634444716591f3f66b2bbff18e581b5e106c
```
