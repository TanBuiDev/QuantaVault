import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3,4}, new int[]{24,12,8,6});
        test(new int[]{-1,1,0,-3,3}, new int[]{0,0,9,0,0});
        test(new int[]{2,5}, new int[]{5,2});
        test(new int[]{0,4,0}, new int[]{0,0,0});
        test(new int[]{-1,-2,-3,-4}, new int[]{-24,-12,-8,-6});
        System.out.println("PASS 238 Product of Array Except Self");
    }

    private static void test(int[] nums, int[] expected) {
        int[] actual = new Solution().productExceptSelf(nums);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }
}
