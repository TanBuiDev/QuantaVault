# 224. Basic Calculator — Solution

## 1. Core idea / Intuition

Expression chỉ có `+`, `-` và parentheses, nên có thể evaluate trong một scan với ba state chính:

```text
result  = tổng đã commit trong current parenthesis level
number  = number đang parse
sign    = dấu áp dụng cho number tiếp theo
```

Parentheses tạo một **context mới**. Khi gặp `(`, lưu outer `result` và `sign` vào stack rồi reset `result=0`, `sign=1`. Khi gặp `)`, hoàn tất inner result và ghép lại:

```text
outerResult + outerSign * innerResult
```

## 2. Requirement recap / Tóm tắt yêu cầu

Cần parse digits, spaces, `+`, `-`, `(`, `)`; hỗ trợ unary minus; không dùng expression evaluator built-in.

## 3. Key observations / Nhận xét quan trọng

### Multi-digit numbers

Build number bằng:

```java
number = number * 10 + (c - '0');
```

### Commit number at operator boundaries

Khi gặp `+` hoặc `-`:

```java
result += sign * number;
number = 0;
sign = c == '+' ? 1 : -1;
```

### Parenthesis stores outer context

Trước `(`, `sign` có thể là `-1` trong `-(...)`, vì vậy phải lưu cả outer result lẫn sign.

## 4. Alternative approaches / Hướng khác

Recursive descent parser là một hướng rất sạch về grammar nhưng dùng recursion depth `O(n)` trong worst case và code nhiều hơn.

Có thể tokenize trước rồi parse, nhưng scan trực tiếp tránh tạo token list trung gian.

## 5. Optimal approach

1. Scan từng character.
2. Digit -> build `number`.
3. `+/-` -> commit current number, update sign.
4. `(` -> push current result, push current sign, reset inner context.
5. `)` -> commit current number, pop sign và previous result, combine.
6. Ignore spaces.
7. Sau loop commit final number.

## 6. Java solution overview

```java
int result = 0;
int number = 0;
int sign = 1;
Deque<Integer> stack = new ArrayDeque<>();

for (char c : s.toCharArray()) {
    if (Character.isDigit(c)) {
        number = number * 10 + (c - '0');
    } else if (c == '+') {
        result += sign * number;
        number = 0;
        sign = 1;
    } else if (c == '-') {
        result += sign * number;
        number = 0;
        sign = -1;
    } else if (c == '(') {
        stack.push(result);
        stack.push(sign);
        result = 0;
        sign = 1;
    } else if (c == ')') {
        result += sign * number;
        number = 0;
        result *= stack.pop();
        result += stack.pop();
    }
}

return result + sign * number;
```

## 7. Code explanation / Giải thích code

Stack push order là:

```text
push previousResult
push signBeforeParenthesis
```

nên khi `)`:

```text
stack.pop() -> sign
stack.pop() -> previousResult
```

Điều này xử lý đúng cả unary minus trước parenthesis như `-(2+3)`.

Spaces không làm thay đổi state nên chỉ cần bỏ qua.

## 8. Dry run

Expression:

```text
1-(2+3)
```

Sau `1-`:

```text
result = 1
sign = -1
```

Gặp `(`:

```text
stack = [-1, 1]   // top first conceptually
inner result = 0
inner sign = 1
```

Evaluate `2+3` -> inner result `5` khi gặp `)`.

Combine:

```text
5 * (-1) + 1 = -4
```

## 9. Time and space complexity

```text
Time: O(n)
Space: O(n)
```

Mỗi character được đọc một lần. Stack depth phụ thuộc nesting depth và có thể tuyến tính.

## 10. Why the algorithm is correct / Vì sao đúng

Trong mỗi parenthesis level, invariant là:

> `result` bằng tổng của các completed terms trong level hiện tại; `number` là number chưa commit; `sign` là hệ số `+1/-1` áp dụng cho `number`.

`+/-` commit đúng current term và đặt sign cho term kế. `(` lưu đầy đủ outer context rồi evaluate inner expression độc lập. `)` hoàn tất inner level và thay toàn bộ parenthesized expression bằng một term có value `outerSign * innerResult`, cộng vào `outerResult`.

Do mọi parenthesis context được restore đúng và mỗi term được commit đúng một lần, final result là giá trị của toàn expression.

## 11. Edge cases

- Chỉ một number.
- Leading/trailing spaces.
- Unary minus: `-1`.
- Unary minus trước parentheses: `-(2+3)`.
- Nested parentheses.
- Nhiều chữ số.
- Kết quả âm.

## 12. Common mistakes / Lỗi thường gặp

- Quên commit final number sau loop.
- Không reset `number` sau operator hoặc `)`.
- Chỉ lưu previous result mà quên sign trước `(`.
- Push/pop outer context sai order.
- Không hỗ trợ unary minus.
- Cố dùng operator-precedence stack phức tạp dù bài chỉ có `+/-`.

## 13. Pattern recognition / Khi nào tái sử dụng

Pattern **running result + context stack** phù hợp với expression có nested parentheses và operator đơn giản. Với grammar phức tạp hơn (`*`, `/`, precedence, functions), nên chuyển sang recursive descent hoặc operator stack/Shunting Yard.

## 14. Vocabulary and algorithmic terminology

- **expression parsing**: phân tích biểu thức.
- **running result**: kết quả tích lũy.
- **unary minus**: dấu trừ một ngôi.
- **parenthesis context**: trạng thái của level ngoài parentheses.
- **nesting depth**: độ sâu lồng parentheses.
- **commit a term**: đưa term hiện tại vào running result.
