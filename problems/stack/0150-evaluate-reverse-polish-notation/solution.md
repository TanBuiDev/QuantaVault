# 150. Evaluate Reverse Polish Notation — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Reverse Polish Notation đặt operator sau operands, nên khi gặp số ta chưa tính; khi gặp operator, hai giá trị gần nhất trên stack chính là right và left operands của phép toán đó.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Parse thành expression tree là thừa. Quan sát postfix order đã encode precedence/parentheses, stack chỉ cần giữ các subexpression values chưa được operator bên ngoài consume.

**State / invariant / data structure cần hiểu trước code.** Stack invariant: sau mỗi token, mỗi phần tử là giá trị của một subexpression hoàn chỉnh thuộc prefix. Với operator, pop b trước rồi a, push a op b; thứ tự đặc biệt quan trọng cho '-' và '/'.

**Dry run mental theo implementation.** Dry run ['2','1','+','3','*']: push2,1; '+' pop b=1,a=2 push3; push3; '*' pop3,3 push9; stack cuối [9].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tính b-a thay a-b hoặc integer division semantics. Khi nào dùng: postfix evaluation và nhiều expression-machine tasks là stack of partial results.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
