import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test("barfoothefoobarman", new String[]{"foo","bar"}, new int[]{0,9});
        test("wordgoodgoodgoodbestword", new String[]{"word","good","best","word"}, new int[]{});
        test("barfoofoobarthefoobarman", new String[]{"bar","foo","the"}, new int[]{6,9,12});
        test("wordgoodgoodgoodbestword", new String[]{"word","good","best","good"}, new int[]{8});
        test("aaaaaa", new String[]{"aa","aa"}, new int[]{0,1,2});
        System.out.println("PASS 30 Substring with Concatenation of All Words");
    }

    private static void test(String s, String[] words, int[] expected) {
        List<Integer> actual = new ArrayList<>(new Solution().findSubstring(s, words));
        Collections.sort(actual);
        List<Integer> expectedList = new ArrayList<>();
        for (int value : expected) expectedList.add(value);
        Collections.sort(expectedList);

        if (!actual.equals(expectedList)) {
            throw new AssertionError("expected=" + expectedList + " actual=" + actual);
        }
    }
}
