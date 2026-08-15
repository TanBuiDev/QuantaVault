# 20. Valid Parentheses

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
>
> **VI:** Cho một chuỗi `s` chỉ chứa các ký tự `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`. Hãy xác định chuỗi đó có hợp lệ hay không.

> **EN:** An input string is valid if:
>
> **VI:** Một chuỗi hợp lệ khi thỏa tất cả các điều kiện sau:

> **EN:** Open brackets must be closed by the same type of brackets.
>
> **VI:** Mỗi dấu ngoặc mở phải được đóng bởi đúng loại dấu ngoặc tương ứng.

> **EN:** Open brackets must be closed in the correct order.
>
> **VI:** Các dấu ngoặc mở phải được đóng theo đúng thứ tự lồng nhau.

> **EN:** Every close bracket has a corresponding open bracket of the same type.
>
> **VI:** Mỗi dấu ngoặc đóng phải có một dấu ngoặc mở cùng loại tương ứng trước đó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: s = "()"
Output: true
```

### Example 2 / Ví dụ 2

```text
Input: s = "()[]{}"
Output: true
```

### Example 3 / Ví dụ 3

```text
Input: s = "(]"
Output: false
```

### Example 4 / Ví dụ 4

```text
Input: s = "([])"
Output: true
```

### Example 5 / Ví dụ 5

```text
Input: s = "([)]"
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= s.length <= 104`
>
> **VI:** Độ dài chuỗi nằm trong giới hạn được nêu trong source.

> **EN:** `s consists of parentheses only '()[]{}'.`
>
> **VI:** `s` chỉ chứa sáu ký tự ngoặc `()[]{}`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/valid-parentheses/

English wording preserved from `raw/top-interview-150/Stack.txt` (blob `942ddfc40cd307f8605930897a04d012549bfe32`).
