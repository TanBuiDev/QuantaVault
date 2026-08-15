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
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        values.pop();
        mins.pop();
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
