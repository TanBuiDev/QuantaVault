# 150. Evaluate Reverse Polish Notation

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an array of strings `tokens` that represents an arithmetic expression in a [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation).
>
> **VI:** Bạn được cho một mảng chuỗi `tokens` biểu diễn một biểu thức số học ở dạng Reverse Polish Notation (RPN/postfix notation).

> **EN:** Evaluate the expression. Return *an integer that represents the value of the expression*.
>
> **VI:** Hãy tính giá trị biểu thức và trả về một số nguyên là kết quả.

> **EN:** Note that:
>
> **VI:** Lưu ý:

> **EN:** - The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`.
>
> **VI:** - Các operator hợp lệ là `+`, `-`, `*`, `/`.

> **EN:** - Each `operand` may be an integer or another expression.
>
> **VI:** - Mỗi operand có thể là một integer hoặc kết quả của một sub-expression.

> **EN:** - The division between two integers always **truncates toward zero**.
>
> **VI:** - Phép chia integer luôn truncate về `0`.

> **EN:** - There will not be any division by zero.
>
> **VI:** - Không có phép chia cho `0`.

> **EN:** - The input represents a valid arithmetic expression in a reverse polish notation.
>
> **VI:** - Input luôn là một biểu thức RPN hợp lệ.

> **EN:** - The answer and all the intermediate calculations can be represented in a **32-bit** integer.
>
> **VI:** - Kết quả và mọi intermediate result đều nằm trong miền signed 32-bit.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
```

> **VI:** Push `2`, push `1`, gặp `+` thì tính `2+1=3`, push `3`, gặp `3` tiếp theo thì push, rồi `*` cho `3*3=9`.

### Example 2 / Ví dụ 2

```text
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
```

> **VI:** `13 / 5` bằng `2` khi integer division truncate về `0`, sau đó `4 + 2 = 6`.

### Example 3 / Ví dụ 3

```text
Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
Explanation: ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
= ((10 * (6 / (12 * -11))) + 17) + 5
= ((10 * (6 / -132)) + 17) + 5
= ((10 * 0) + 17) + 5
= (0 + 17) + 5
= 17 + 5
= 22
```

> **VI:** Ví dụ này thể hiện rõ operand có thể là intermediate expression và phép chia âm vẫn truncate về `0`.

## Constraints / Ràng buộc

> **EN:** - `1 <= `tokens`.length <= 10^4`
>
> **VI:** - Số token nằm trong giới hạn được nêu trong source.

> **EN:** - `tokens[i]` is either an operator: `"+"`, `"-"`, `"*"`, or `"/"`, or an integer in the range `[-200, 200]`.
>
> **VI:** - Mỗi token là một operator hợp lệ hoặc một integer trong range được nêu.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/evaluate-reverse-polish-notation/

English wording preserved from `raw/top-interview-150/Stack.txt` (blob `942ddfc40cd307f8605930897a04d012549bfe32`).
