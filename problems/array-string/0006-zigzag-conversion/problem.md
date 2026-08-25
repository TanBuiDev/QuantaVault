# 6. Zigzag Conversion

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of `rows` like this: (you may want to display this pattern in a fixed font for better legibility)
>
> **VI:** Chuỗi `"PAYPALISHIRING"` được viết theo dạng zigzag trên một số hàng cho trước như sau (font cố định sẽ dễ nhìn hơn):

```text
P   A   H   N
A P L S I I G
Y   I   R
```

> **EN:** And then read line by line: "PAHNAPLSIIGYIR"
>
> **VI:** Sau đó đọc lần lượt theo từng hàng ta được `"PAHNAPLSIIGYIR"`.

> **EN:** Write the code that will take a string and make this conversion given a number of `rows`:
>
> **VI:** Hãy viết code thực hiện phép chuyển đổi này với số hàng cho trước:

```text
string convert(string s, int numRows);
```

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
```

### Example 2 / Ví dụ 2

```text
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
```

> **EN:** Explanation:
>
> **VI:** Giải thích:

```text
P     I    N
A   L S  I G
Y A   H R
P     I
```

### Example 3 / Ví dụ 3

```text
Input: s = "A", numRows = 1
Output: "A"
```

## Constraints / Ràng buộc

> **EN:** `1 <= `s`.length <= 1000`
>
> **VI:** Độ dài `s` từ `1` đến `1000`.

> **EN:** `s` consists of English letters (lower-case and upper-case), ',' and '.'.
>
> **VI:** `s` gồm chữ cái tiếng Anh, dấu phẩy `,` và dấu chấm `.`.

> **EN:** `1 <= `numRows` <= 1000`
>
> **VI:** `numRows` từ `1` đến `1000`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/zigzag-conversion/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
