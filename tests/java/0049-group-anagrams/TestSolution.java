import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new String[]{"eat","tea","tan","ate","nat","bat"}, new String[][]{{"bat"},{"nat","tan"},{"ate","eat","tea"}});
        test(new String[]{""}, new String[][]{{""}});
        test(new String[]{"a"}, new String[][]{{"a"}});
        test(new String[]{"ab","ba","ab"}, new String[][]{{"ab","ab","ba"}});
        System.out.println("PASS 49 Group Anagrams");
    }

    private static void test(String[] input, String[][] expected) {
        List<List<String>> actual = new Solution().groupAnagrams(input);
        List<String> actualNormalized = normalize(actual);
        List<List<String>> expectedGroups = new ArrayList<>();
        for (String[] group : expected) {
            List<String> list = new ArrayList<>();
            Collections.addAll(list, group);
            expectedGroups.add(list);
        }
        List<String> expectedNormalized = normalize(expectedGroups);
        if (!actualNormalized.equals(expectedNormalized)) {
            throw new AssertionError("expected=" + expectedNormalized + " actual=" + actualNormalized);
        }
    }

    private static List<String> normalize(List<List<String>> groups) {
        List<String> normalized = new ArrayList<>();
        for (List<String> group : groups) {
            List<String> copy = new ArrayList<>(group);
            Collections.sort(copy);
            normalized.add(String.join("|", copy));
        }
        Collections.sort(normalized);
        return normalized;
    }
}
