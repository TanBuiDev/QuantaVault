# 155. Min Stack — Solution

## 1. Core idea / Intuition

Để `getMin()` là `O(1)`, lưu một **minimum snapshot ở mỗi stack depth**. `values` giữ dữ liệu, `mins` giữ minimum của prefix stack tương ứng.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    private final Deque<Integer> values;
    private final Deque<Integer> mins;

    public MinStack() {
        values = new ArrayDeque<>();
        mins = new ArrayDeque<>();
    }

    public void push(int val) {
        values.push(val);

        // mins lưu minimum snapshot cho từng depth, không chỉ các minimum distinct.
        // Vì vậy duplicate minimum vẫn rollback đúng sau một lần pop.
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        // Hai stack luôn đồng bộ depth; pop snapshot cùng value khôi phục ngay
        // minimum của trạng thái trước mà không cần scan lại values.
        values.pop();
        mins.pop();
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        // Top của mins là aggregate minimum của toàn bộ values ở depth hiện tại.
        return mins.peek();
    }
}
```

## 3. Correctness

Invariant: hai stack cùng size và `mins` tại mỗi depth là minimum của toàn bộ `values` tới depth đó. Push tạo snapshot `min(val, previousMin)`; pop cả hai rollback đúng state trước. Vì thế `mins.peek()` luôn là minimum hiện tại.

## 4. Complexity

Mọi operation `push/pop/top/getMin` đều `O(1)`, tổng space `O(n)`.

## 5. Common mistakes

- Scan values trong `getMin()`.
- Chỉ dùng một biến min không rollback được.
- Quên duplicate minimum.
- Pop values nhưng không pop mins.
