public class TestSolution {
    public static void main(String[] args) {
        test("1 + 1", 2);
        test(" 2-1 + 2 ", 3);
        test("(1+(4+5+2)-3)+(6+8)", 23);
        test("-1 + 2", 1);
        test("-(2 + 3) + 10", 5);
        test("1-(2-(3-(4-5)))", 3);
        test("123 + (45 - 6)", 162);
        test("0", 0);
        System.out.println("PASS 224 Basic Calculator");
    }

    private static void test(String expression, int expected) {
        int actual = new Solution().calculate(expression);
        if (actual != expected) {
            throw new AssertionError(
                "expression=" + expression + " expected=" + expected + " actual=" + actual
            );
        }
    }
}
