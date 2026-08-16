public class TestSolution {
    public static void main(String[] args) {
        test("11", "1", "100");
        test("1010", "1011", "10101");
        test("0", "0", "0");
        test("1111", "1", "10000");
        test("1", "111111", "1000000");
        System.out.println("PASS 67 Add Binary");
    }

    private static void test(String a, String b, String expected) {
        String actual = new Solution().addBinary(a, b);
        if (!actual.equals(expected)) {
            throw new AssertionError("a=" + a + " b=" + b + " expected=" + expected + " actual=" + actual);
        }
    }
}
