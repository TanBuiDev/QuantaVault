# 68. Text Justification

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given an array of strings `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (`left` and `right`) justified.
>
> **VI:** Cho mảng chuỗi `words` và độ rộng `maxWidth`, hãy định dạng văn bản sao cho mỗi dòng có đúng `maxWidth` ký tự và được căn đều cả trái lẫn phải.

> **EN:** You should pack your `words` in a greedy approach; that is, pack as many `words` as you can in each line. Pad extra spaces ' ' when necessary so that each line has exactly `maxWidth` characters.
>
> **VI:** Hãy xếp từ theo greedy: đưa nhiều từ nhất có thể vào mỗi dòng. Thêm space khi cần để mỗi dòng có đúng `maxWidth` ký tự.

> **EN:** Extra spaces between `words` should be distributed as evenly as possible. If the number of spaces on a line does not divide evenly between `words`, the empty slots on the `left` will be assigned more spaces than the slots on the `right`.
>
> **VI:** Space thừa giữa các từ phải được phân bố đều nhất có thể. Nếu không chia hết, các khoảng ở bên trái nhận nhiều space hơn các khoảng bên phải.

> **EN:** For the last line of text, it should be `left`-justified, and no extra space is inserted between `words`.
>
> **VI:** Dòng cuối phải căn trái và không chèn space thừa giữa các từ; phần thiếu được pad ở cuối dòng.

> **EN:** Note:
>
> **VI:** Lưu ý:

> **EN:** A word is defined as a character sequence consisting of non-space characters only.
>
> **VI:** Một word là một dãy ký tự không chứa space.

> **EN:** Each word's length is guaranteed to be greater than 0 and not exceed `maxWidth`.
>
> **VI:** Độ dài mỗi word lớn hơn `0` và không vượt `maxWidth`.

> **EN:** The input array `words` contains at least `one` word.
>
> **VI:** Mảng `words` có ít nhất một word.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
Output:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
```

### Example 2 / Ví dụ 2

```text
Input: words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16
Output:
[
  "What   must   be",
  "acknowledgment  ",
  "shall be        "
]
```

> **EN:** Explanation: Note that the last line is "shall be    " instead of "shall     be", because the last line must be `left`-justified instead of fully-justified. Note that the second line is also `left`-justified because it contains only `one` word.
>
> **VI:** Giải thích: Dòng cuối dùng một space giữa `shall` và `be`, rồi pad phần còn lại ở cuối vì phải căn trái. Dòng chỉ có một word cũng được căn trái.

### Example 3 / Ví dụ 3

```text
Input: words = ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"], maxWidth = 20
Output:
[
  "Science  is  what we",
  "understand      well",
  "enough to explain to",
  "a  computer.  Art is",
  "everything  else  we",
  "do                  "
]
```

## Constraints / Ràng buộc

> **EN:** `1 <= `words`.length <= 300`
>
> **VI:** Số word từ `1` đến `300`.

> **EN:** `1 <= `words[i]`.length <= 20`
>
> **VI:** Độ dài mỗi word từ `1` đến `20`.

> **EN:** `words[i]` consists of only English letters and symbols.
>
> **VI:** Mỗi word chỉ gồm chữ cái tiếng Anh và ký hiệu.

> **EN:** `1 <= `maxWidth` <= 100`
>
> **VI:** `maxWidth` từ `1` đến `100`.

> **EN:** `words[i].length <= maxWidth`
>
> **VI:** Mọi word đều không dài hơn `maxWidth`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/text-justification/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
