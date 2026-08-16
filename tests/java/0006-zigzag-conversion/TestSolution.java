public class TestSolution {
    public static void main(String[] args) {
        test("PAYPALISHIRING", 3, "PAHNAPLSIIGYIR");
        test("PAYPALISHIRING", 4, "PINALSIGYAHRPI");
        test("A", 1, "A");
        test("ABC", 5, "ABC");
        test("ABCDE", 2, "ACEBD");
        System.out.println("PASS 6 Zigzag Conversion");
    }

    private static void test(String s, int rows, String expected) {
        String actual = new Solution().convert(s, rows);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
