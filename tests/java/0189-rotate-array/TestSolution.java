import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3,4,5,6,7}, 3, new int[]{5,6,7,1,2,3,4});
        test(new int[]{-1,-100,3,99}, 2, new int[]{3,99,-1,-100});
        test(new int[]{1,2,3}, 0, new int[]{1,2,3});
        test(new int[]{1,2,3,4}, 4, new int[]{1,2,3,4});
        test(new int[]{1,2,3,4,5}, 7, new int[]{4,5,1,2,3});
        test(new int[]{9}, 100, new int[]{9});
        System.out.println("PASS 189 Rotate Array");
    }

    private static void test(int[] nums, int k, int[] expected) {
        new Solution().rotate(nums, k);
        if (!Arrays.equals(nums, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(nums));
        }
    }
}
