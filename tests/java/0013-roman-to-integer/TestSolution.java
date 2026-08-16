public class TestSolution {
    public static void main(String[] args) {
        test("III", 3);
        test("LVIII", 58);
        test("MCMXCIV", 1994);
        test("IV", 4);
        test("MMMCMXCIX", 3999);
        System.out.println("PASS 13 Roman to Integer");
    }

    private static void test(String s, int expected) {
        int actual = new Solution().romanToInt(s);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
