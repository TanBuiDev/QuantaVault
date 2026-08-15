public class TestSolution {
    public static void main(String[] args) {
        test(new String[]{"2","1","+","3","*"}, 9);
        test(new String[]{"4","13","5","/","+"}, 6);
        test(new String[]{"10","6","9","3","+","-11","*","/","*","17","+","5","+"}, 22);
        test(new String[]{"5","2","-"}, 3);
        test(new String[]{"-7","3","/"}, -2);
        test(new String[]{"42"}, 42);
        System.out.println("PASS 150 Evaluate Reverse Polish Notation");
    }

    private static void test(String[] tokens, int expected) {
        int actual = new Solution().evalRPN(tokens);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
