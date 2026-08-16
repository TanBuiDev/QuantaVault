import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test("leetcode", Arrays.asList("leet","code"), true);
        test("applepenapple", Arrays.asList("apple","pen"), true);
        test("catsandog", Arrays.asList("cats","dog","sand","and","cat"), false);
        test("aaaa", Arrays.asList("a"), true);
        test("cars", Arrays.asList("car","ca","rs"), true);
        test("aaaaaaa", Arrays.asList("aaaa","aaa"), true);
        System.out.println("PASS 139 Word Break");
    }

    private static void test(String s, java.util.List<String> words, boolean expected) {
        boolean actual = new Solution().wordBreak(s, words);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
