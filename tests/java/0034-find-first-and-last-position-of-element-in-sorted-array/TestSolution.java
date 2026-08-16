import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{5,7,7,8,8,10}, 8, new int[]{3,4});
        test(new int[]{5,7,7,8,8,10}, 6, new int[]{-1,-1});
        test(new int[]{}, 0, new int[]{-1,-1});
        test(new int[]{2,2,2}, 2, new int[]{0,2});
        test(new int[]{1}, 1, new int[]{0,0});
        System.out.println("PASS 34 Find First and Last Position");
    }

    private static void test(int[] nums, int target, int[] expected) {
        int[] actual = new Solution().searchRange(nums, target);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }
}
