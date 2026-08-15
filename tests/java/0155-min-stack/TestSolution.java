public class TestSolution {
    public static void main(String[] args) {
        example();
        duplicateMinimum();
        decreasingValues();
        integerBoundaries();
        System.out.println("PASS 155 Min Stack");
    }

    private static void example() {
        MinStack stack = new MinStack();
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        assertEquals(-3, stack.getMin());
        stack.pop();
        assertEquals(0, stack.top());
        assertEquals(-2, stack.getMin());
    }

    private static void duplicateMinimum() {
        MinStack stack = new MinStack();
        stack.push(2);
        stack.push(1);
        stack.push(1);
        assertEquals(1, stack.getMin());
        stack.pop();
        assertEquals(1, stack.getMin());
        stack.pop();
        assertEquals(2, stack.getMin());
    }

    private static void decreasingValues() {
        MinStack stack = new MinStack();
        stack.push(3);
        stack.push(2);
        stack.push(1);
        assertEquals(1, stack.getMin());
        assertEquals(1, stack.top());
        stack.pop();
        assertEquals(2, stack.getMin());
    }

    private static void integerBoundaries() {
        MinStack stack = new MinStack();
        stack.push(Integer.MIN_VALUE);
        stack.push(Integer.MAX_VALUE);
        assertEquals(Integer.MIN_VALUE, stack.getMin());
        assertEquals(Integer.MAX_VALUE, stack.top());
        stack.pop();
        assertEquals(Integer.MIN_VALUE, stack.getMin());
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
