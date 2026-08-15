import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,7,11,15}, 9, new int[]{0,1});
        test(new int[]{3,2,4}, 6, new int[]{1,2});
        test(new int[]{3,3}, 6, new int[]{0,1});
        test(new int[]{-3,4,3,90}, 0, new int[]{0,2});
        System.out.println("PASS 1 Two Sum");
    }

    private static void test(int[] nums, int target, int[] expected) {
        int[] actual = new Solution().twoSum(nums, target);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }
}
