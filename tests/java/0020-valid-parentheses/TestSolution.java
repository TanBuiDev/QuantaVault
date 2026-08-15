public class TestSolution {
    public static void main(String[] args) {
        test("()", true);
        test("()[]{}", true);
        test("(]", false);
        test("([])", true);
        test("([)]", false);
        test("]", false);
        test("(((", false);
        test("{[()()]}", true);
        System.out.println("PASS 20 Valid Parentheses");
    }

    private static void test(String s, boolean expected) {
        boolean actual = new Solution().isValid(s);
        if (actual != expected) {
            throw new AssertionError(
                "input=" + s + " expected=" + expected + " actual=" + actual
            );
        }
    }
}
