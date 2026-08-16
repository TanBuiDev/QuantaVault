import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,7,11,15}, 9, new int[]{1,2});
        test(new int[]{2,3,4}, 6, new int[]{1,3});
        test(new int[]{-1,0}, -1, new int[]{1,2});
        test(new int[]{1,2,3,4,4,9}, 8, new int[]{4,5});
        test(new int[]{-10,-3,0,2,8}, -1, new int[]{2,4});
        System.out.println("PASS 167 Two Sum II");
    }

    private static void test(int[] numbers, int target, int[] expected) {
        int[] actual = new Solution().twoSum(numbers, target);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }
}
