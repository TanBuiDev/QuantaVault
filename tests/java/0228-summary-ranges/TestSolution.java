import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{0,1,2,4,5,7}, Arrays.asList("0->2","4->5","7"));
        test(new int[]{0,2,3,4,6,8,9}, Arrays.asList("0","2->4","6","8->9"));
        test(new int[]{}, Arrays.asList());
        test(new int[]{2147483646,2147483647}, Arrays.asList("2147483646->2147483647"));
        test(new int[]{-2,-1,1}, Arrays.asList("-2->-1","1"));
        System.out.println("PASS 228 Summary Ranges");
    }

    private static void test(int[] nums, List<String> expected) {
        List<String> actual = new Solution().summaryRanges(nums);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
