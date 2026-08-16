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
        run(new int[]{1,1,2}, 2, new int[]{1,2});
        run(new int[]{0,0,1,1,1,2,2,3,3,4}, 5, new int[]{0,1,2,3,4});
        run(new int[]{7}, 1, new int[]{7});
        run(new int[]{2,2,2,2}, 1, new int[]{2});
        run(new int[]{-3,-1,0,4}, 4, new int[]{-3,-1,0,4});
        System.out.println("PASS 26 Remove Duplicates from Sorted Array");
    }
}
