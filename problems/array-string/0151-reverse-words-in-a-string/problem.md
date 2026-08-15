# 151. Reverse Words in a String

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an input string s, reverse the order of the words.
>
> **VI:** Cho chuỗi đầu vào `s`, hãy đảo ngược thứ tự các từ.

> **EN:** A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space.
>
> **VI:** Một từ là một dãy ký tự không phải space. Các từ trong `s` được ngăn cách bởi ít nhất một space.

> **EN:** Return a string of the words in reverse order concatenated by a single space.
>
> **VI:** Trả về chuỗi gồm các từ theo thứ tự ngược, nối với nhau bằng đúng một space.

> **EN:** Note that s may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.
>
> **VI:** `s` có thể có leading spaces, trailing spaces hoặc nhiều space giữa hai từ. Kết quả chỉ được có một space giữa các từ và không có space thừa.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "the sky is blue"
Output: "blue is sky the"
```

### Example 2 / Ví dụ 2

```text
Input: s = "  hello world  "
Output: "world hello"
```

> **EN:** Explanation: Your reversed string should not contain leading or trailing spaces.
>
> **VI:** Giải thích: Chuỗi kết quả không được có leading hoặc trailing spaces.

### Example 3 / Ví dụ 3

```text
Input: s = "a good   example"
Output: "example good a"
```

> **EN:** Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
>
> **VI:** Giải thích: Nhiều space giữa hai từ phải được rút về một space trong kết quả.

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 104`
>
> **VI:** Độ dài `s` từ `1` đến `10^4`.

> **EN:** s contains English letters (upper-case and lower-case), digits, and spaces ' '.
>
> **VI:** `s` chứa chữ cái tiếng Anh, chữ số và space `' '`.

> **EN:** There is at least one word in s.
>
> **VI:** `s` có ít nhất một từ.

## Follow-up / Câu hỏi mở rộng

> **EN:** If the string data type is mutable in your language, can you solve it in-place with O(1) extra space?
>
> **VI:** Nếu kiểu string trong ngôn ngữ của bạn mutable, bạn có thể giải in-place với `O(1)` extra space không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/reverse-words-in-a-string/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
