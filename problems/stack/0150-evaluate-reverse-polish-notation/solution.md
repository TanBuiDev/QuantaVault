# 150. Evaluate Reverse Polish Notation — Solution

## 1. Core idea / Intuition

RPN đặt operator **sau** operands, nên khi gặp operator thì hai operand cần thiết đã nằm trong các intermediate results gần nhất. Stack mô hình hóa chính xác điều đó.

- Number -> parse và push.
- Operator -> pop `right`, pop `left`, tính `left op right`, push result.
- Sau khi xử lý hết token, stack còn đúng một value là answer.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần evaluate `+`, `-`, `*`, `/`; phép chia integer truncate toward zero; input luôn hợp lệ và intermediate results fit signed 32-bit.

## 3. Key observations / Nhận xét quan trọng

### Operand order

Với token operator:

```java
int right = stack.pop();
int left = stack.pop();
```

Phải tính `left - right` hoặc `left / right`, không được đảo thứ tự.

### Java division already matches the contract

Với `int`, Java integer division truncate toward zero, nên có thể dùng trực tiếp `/`.

### Negative numbers are operands

Token `"-11"` là number; chỉ token chính xác `"-"` mới là operator.

## 4. Alternative approaches / Hướng khác

Có thể dùng array `int[]` làm manual stack để giảm boxing. `Deque<Integer>` rõ ràng hơn cho interview và vẫn `O(n)`.

Recursive parsing từ cuối tokens cũng khả thi nhưng phức tạp hơn và dùng call stack.

## 5. Optimal approach

1. Tạo `Deque<Integer>`.
2. Với mỗi token:
   - nếu không phải operator -> `Integer.parseInt(token)` rồi push;
   - nếu là operator -> pop hai operand đúng order, apply operator, push result.
3. Return `stack.pop()`.

## 6. Java solution overview

```java
Deque<Integer> stack = new ArrayDeque<>();

for (String token : tokens) {
    switch (token) {
        case "+": {
            int right = stack.pop();
            int left = stack.pop();
            stack.push(left + right);
            break;
        }
        case "-": {
            int right = stack.pop();
            int left = stack.pop();
            stack.push(left - right);
            break;
        }
        case "*": {
            int right = stack.pop();
            int left = stack.pop();
            stack.push(left * right);
            break;
        }
        case "/": {
            int right = stack.pop();
            int left = stack.pop();
            stack.push(left / right);
            break;
        }
        default:
            stack.push(Integer.parseInt(token));
    }
}
return stack.pop();
```

## 7. Code explanation / Giải thích code

Stack luôn chứa results của những sub-expression đã evaluate nhưng chưa được một operator phía sau consume. Operator binary giảm stack size ròng đi `1`: pop hai, push một.

Dùng exact switch token giúp `"-11"` đi vào `default` và parse thành số âm thay vì nhầm với subtraction operator.

## 8. Dry run

```text
tokens = ["4","13","5","/","+"]
```

```text
4  -> [4]
13 -> [13,4]
5  -> [5,13,4]
/  -> right=5, left=13 -> push 2 -> [2,4]
+  -> right=2, left=4  -> push 6 -> [6]
```

Answer = `6`.

## 9. Time and space complexity

```text
Time: O(n)
Space: O(n)
```

Mỗi token được xử lý một lần. Worst case stack chứa nhiều operands trước khi operators reduce chúng.

## 10. Why the algorithm is correct / Vì sao đúng

Invariant sau mỗi prefix tokens:

> Stack chứa đúng các giá trị của những sub-expression hoàn chỉnh trong prefix nhưng chưa được dùng làm operand bởi operator tiếp theo.

Number tạo một sub-expression đơn nên push là đúng. Với operator, RPN đảm bảo hai sub-expression gần nhất chính là left/right operands của operator; pop hai, apply đúng order và push result thay thế chúng nên invariant tiếp tục đúng.

Input là một expression hợp lệ, nên sau token cuối chỉ còn một sub-expression: toàn bộ expression. Stack top vì vậy là answer.

## 11. Edge cases

- Chỉ một number.
- Subtraction nơi operand order quan trọng.
- Division âm truncate về zero.
- Negative number token.
- Deep chain nhiều operators.

## 12. Common mistakes / Lỗi thường gặp

- Đảo `left` và `right` cho `-` hoặc `/`.
- Nhầm negative number với operator.
- Dùng floating-point division rồi cast không cần thiết.
- Không push intermediate result trở lại stack.
- Dùng queue thay vì stack.

## 13. Pattern recognition / Khi nào tái sử dụng

Operand stack xuất hiện trong postfix evaluation, expression parsing, calculator problems, compiler/interpreter evaluation và các bài nơi operator consume các kết quả gần nhất.

## 14. Vocabulary and algorithmic terminology

- **Reverse Polish Notation / postfix notation**: ký pháp hậu tố.
- **operand**: toán hạng.
- **operator**: toán tử.
- **intermediate result**: kết quả trung gian.
- **truncate toward zero**: cắt phần thập phân theo hướng về `0`.
- **operand order**: thứ tự toán hạng.
