public class TestSolution {
    public static void main(String[] args) {
        test(3749, "MMMDCCXLIX");
        test(58, "LVIII");
        test(1994, "MCMXCIV");
        test(1, "I");
        test(9, "IX");
        test(3999, "MMMCMXCIX");
        System.out.println("PASS 12 Integer to Roman");
    }

    private static void test(int num, String expected) {
        String actual = new Solution().intToRoman(num);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
