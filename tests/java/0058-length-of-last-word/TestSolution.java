public class TestSolution {
    public static void main(String[] args) {
        test("Hello World", 5);
        test("   fly me   to   the moon  ", 4);
        test("luffy is still joyboy", 6);
        test("Java", 4);
        test("a   ", 1);
        System.out.println("PASS 58 Length of Last Word");
    }

    private static void test(String s, int expected) {
        int actual = new Solution().lengthOfLastWord(s);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
