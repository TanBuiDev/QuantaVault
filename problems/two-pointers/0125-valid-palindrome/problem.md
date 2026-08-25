# 125. Valid Palindrome

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.
>
> **VI:** Một cụm từ là palindrome nếu sau khi chuyển chữ hoa thành chữ thường và loại mọi ký tự không phải chữ hoặc số, chuỗi đọc xuôi và đọc ngược giống nhau. Ký tự alphanumeric gồm chữ cái và chữ số.

> **EN:** Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.
>
> **VI:** Cho chuỗi `s`, trả về `true` nếu đó là palindrome, ngược lại trả về `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "A man, a plan, a canal: Panama"
Output: true
```

> **EN:** Explanation: "amanaplanacanalpanama" is a palindrome.
>
> **VI:** Giải thích: Sau khi chuẩn hóa được `"amanaplanacanalpanama"`, đây là palindrome.

### Example 2 / Ví dụ 2

```text
Input: s = "race a car"
Output: false
```

> **EN:** Explanation: "raceacar" is not a palindrome.
>
> **VI:** Giải thích: `"raceacar"` không phải palindrome.

### Example 3 / Ví dụ 3

```text
Input: s = " "
Output: true
```

> **EN:** Explanation: `s` is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.
>
> **VI:** Giải thích: Sau khi bỏ ký tự không alphanumeric, chuỗi trở thành rỗng. Chuỗi rỗng đọc xuôi/ngược giống nhau nên là palindrome.

## Constraints / Ràng buộc

> **EN:** `1 <= `s`.length <= 2 * 10^5`
>
> **VI:** Độ dài `s` từ `1` đến `2 * 10^5`.

> **EN:** `s` consists only of printable ASCII characters.
>
> **VI:** `s` chỉ gồm các ký tự ASCII có thể in được.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/valid-palindrome/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Two Pointers.txt
blob SHA: 0fac4442afd9fb3ca107f2ed6cc743fe6f50139c
```
