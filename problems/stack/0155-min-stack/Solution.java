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
