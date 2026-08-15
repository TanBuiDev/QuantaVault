import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new String[]{"This","is","an","example","of","text","justification."}, 16,
                List.of("This    is    an", "example  of text", "justification.  "));
        test(new String[]{"What","must","be","acknowledgment","shall","be"}, 16,
                List.of("What   must   be", "acknowledgment  ", "shall be        "));
        test(new String[]{"longword","a","b"}, 8,
                List.of("longword", "a b     "));
        test(new String[]{"a","b","c","dddd"}, 6,
                List.of("a  b c", "dddd  "));
        test(new String[]{"hello"}, 8,
                List.of("hello   "));
        System.out.println("PASS 68 Text Justification");
    }

    private static void test(String[] words, int width, List<String> expected) {
        List<String> actual = new Solution().fullJustify(words, width);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual
                    + " words=" + Arrays.toString(words));
        }
        for (String line : actual) {
            if (line.length() != width) {
                throw new AssertionError("wrong line width: '" + line + "'");
            }
        }
    }
}
