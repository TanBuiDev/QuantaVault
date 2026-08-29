# 155. Min Stack — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Min Stack phải trả minimum O(1) dù pop có thể xóa chính minimum. Chỉ một biến min không biết minimum trước đó để khôi phục, nên cần lưu lịch sử min song song với values.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Mỗi getMin scan stack là O(n). Quan sát tại mỗi depth ta có thể lưu min của prefix stack tới depth đó; pop đồng thời loại value và min snapshot tương ứng.

**State / invariant / data structure cần hiểu trước code.** Có thể dùng hai stacks hoặc mỗi entry chứa (value,minSoFar). Invariant top min stack luôn bằng minimum của toàn bộ value stack hiện tại, kể cả duplicates của minimum.

**Dry run mental theo implementation.** Dry run push -2,0,-3: min snapshots -2,-2,-3; getMin=-3; pop -3 đồng thời pop snapshot, top min trở lại -2 ngay O(1).

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ push min khi nhỏ hơn chứ không xử lý duplicate min đúng. Khi nào dùng: stack cần aggregate query O(1) thường lưu aggregate-so-far cùng mỗi depth.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
