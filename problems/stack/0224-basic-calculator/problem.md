# 224. Basic Calculator

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.
>
> **VI:** Cho chuỗi `s` biểu diễn một expression hợp lệ. Hãy cài đặt basic calculator để tính và trả về kết quả.

> **EN:** Note: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as eval().
>
> **VI:** Không được dùng built-in function có khả năng evaluate trực tiếp expression string như `eval()`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "1 + 1"
Output: 2
```

### Example 2 / Ví dụ 2

```text
Input: s = " 2-1 + 2 "
Output: 3
```

### Example 3 / Ví dụ 3

```text
Input: s = "(1+(4+5+2)-3)+(6+8)"
Output: 23
```

## Constraints / Ràng buộc

> **EN:** `1 <= `s`.length <= 3 * 10^5`
>
> **VI:** Độ dài expression nằm trong giới hạn được nêu trong source.

> **EN:** `s` consists of digits, '+', '-', '(', ')', and ' '.
>
> **VI:** `s` chỉ gồm digit, `+`, `-`, parentheses và space.

> **EN:** `s` represents a valid expression.
>
> **VI:** `s` luôn là một expression hợp lệ.

> **EN:** '+' is not used as a `unary` operation (i.e., "+1" and "+(2 + 3)" is invalid).
>
> **VI:** `+` không được dùng như unary operator.

> **EN:** '-' could be used as a `unary` operation (i.e., "-1" and "-(2 + 3)" is valid).
>
> **VI:** `-` có thể là unary operator, ví dụ `-1` hoặc `-(2+3)`.

> **EN:** There will be no two consecutive operators in the input.
>
> **VI:** Không có hai operator liên tiếp trong input.

> **EN:** Every number and running calculation will fit in a signed 32-bit integer.
>
> **VI:** Mọi number và running calculation đều nằm trong signed 32-bit integer.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/basic-calculator/

English wording preserved from `raw/top-interview-150/Stack.txt` (blob `942ddfc40cd307f8605930897a04d012549bfe32`).
