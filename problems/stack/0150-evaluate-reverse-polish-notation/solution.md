# 150. Evaluate Reverse Polish Notation — Solution

## 1. Core idea / Intuition

RPN đặt operator sau operands. Khi gặp operator, hai intermediate results gần nhất trên stack chính là operands cần consume.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int evalRPN(String[] tokens) {
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
                    // Operand pop order là bắt buộc: top là right operand vì RPN
                    // đã push left trước right; đảo thứ tự sẽ sai cho - và /.
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
                    // Java int division truncate toward zero đúng contract của đề.
                    stack.push(left / right);
                    break;
                }
                default:
                    // Exact switch token giúp số âm như "-11" đi vào parseInt,
                    // không bị nhầm với subtraction operator "-".
                    stack.push(Integer.parseInt(token));
            }
        }

        // Valid RPN expression reduce toàn bộ intermediate values về đúng một result.
        return stack.pop();
    }
}
```

## 3. Correctness

Invariant: stack chứa đúng các sub-expression hoàn chỉnh trong prefix chưa được operator phía sau consume. Number tạo một sub-expression; operator thay hai sub-expression gần nhất bằng kết quả của chúng. Expression hợp lệ kết thúc với đúng một value.

## 4. Complexity

```text
Time: O(n)
Space: O(n)
```

## 5. Common mistakes

- Đảo left/right cho `-` và `/`.
- Nhầm negative number với operator.
- Không push intermediate result lại stack.
