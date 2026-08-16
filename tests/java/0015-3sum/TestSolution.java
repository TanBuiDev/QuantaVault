import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{-1,0,1,2,-1,-4}, new int[][]{{-1,-1,2},{-1,0,1}});
        test(new int[]{0,1,1}, new int[][]{});
        test(new int[]{0,0,0}, new int[][]{{0,0,0}});
        test(new int[]{-2,0,0,2,2}, new int[][]{{-2,0,2}});
        test(new int[]{-4,-2,-2,-2,0,1,2,2,3,3,4,4,6,6}, new int[][]{{-4,-2,6},{-4,0,4},{-4,1,3},{-4,2,2},{-2,-2,4},{-2,0,2}});
        System.out.println("PASS 15 3Sum");
    }

    private static void test(int[] nums, int[][] expected) {
        List<List<Integer>> actual = new Solution().threeSum(nums);
        List<String> actualNormalized = normalize(actual);
        List<String> expectedNormalized = new ArrayList<>();
        for (int[] triple : expected) {
            int[] copy = triple.clone();
            Arrays.sort(copy);
            expectedNormalized.add(Arrays.toString(copy));
        }
        Collections.sort(expectedNormalized);

        if (!actualNormalized.equals(expectedNormalized)) {
            throw new AssertionError("expected=" + expectedNormalized + " actual=" + actualNormalized);
        }
    }

    private static List<String> normalize(List<List<Integer>> triples) {
        List<String> normalized = new ArrayList<>();
        for (List<Integer> triple : triples) {
            int[] values = new int[]{triple.get(0), triple.get(1), triple.get(2)};
            Arrays.sort(values);
            normalized.add(Arrays.toString(values));
        }
        Collections.sort(normalized);
        return normalized;
    }
}
