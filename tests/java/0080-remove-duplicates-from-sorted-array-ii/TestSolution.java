import java.util.Arrays;

public class TestSolution {
    private static void run(int[] nums, int expectedK, int[] expectedPrefix) {
        int k = new Solution().removeDuplicates(nums);
        if (k != expectedK) {
            throw new AssertionError("expected k=" + expectedK + " actual=" + k);
        }
        int[] actual = Arrays.copyOf(nums, k);
        if (!Arrays.equals(expectedPrefix, actual)) {
            throw new AssertionError(
                "expected=" + Arrays.toString(expectedPrefix) +
                " actual=" + Arrays.toString(actual)
            );
        }
    }

    public static void main(String[] args) {
        run(new int[]{1,1,1,2,2,3}, 5, new int[]{1,1,2,2,3});
        run(new int[]{0,0,1,1,1,1,2,3,3}, 7, new int[]{0,0,1,1,2,3,3});
        run(new int[]{5}, 1, new int[]{5});
        run(new int[]{2,2,2,2,2}, 2, new int[]{2,2});
        run(new int[]{-2,-2,0,0,3}, 5, new int[]{-2,-2,0,0,3});
        System.out.println("PASS 80 Remove Duplicates from Sorted Array II");
    }
}
