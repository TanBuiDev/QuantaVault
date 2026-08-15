public class TestSolution {
    public static void main(String[] args) {
        test("the sky is blue", "blue is sky the");
        test("  hello world  ", "world hello");
        test("a good   example", "example good a");
        test("   Java   ", "Java");
        test("  a1   B2 c3 ", "c3 B2 a1");
        System.out.println("PASS 151 Reverse Words in a String");
    }

    private static void test(String s, String expected) {
        String actual = new Solution().reverseWords(s);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
