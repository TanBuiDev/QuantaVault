public class TestSolution {
    public static void main(String[] args) {
        test(new String[]{"flower","flow","flight"}, "fl");
        test(new String[]{"dog","racecar","car"}, "");
        test(new String[]{"alone"}, "alone");
        test(new String[]{"abc","","ab"}, "");
        test(new String[]{"interview","inter","internet"}, "inter");
        System.out.println("PASS 14 Longest Common Prefix");
    }

    private static void test(String[] strs, String expected) {
        String actual = new Solution().longestCommonPrefix(strs);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
