import java.util.Arrays;

public class TestSolution {
    private static void run(int[] nums, int val, int expectedK, int[] expectedPrefix) {
        int k = new Solution().removeElement(nums, val);
        if (k != expectedK) {
            throw new AssertionError("expected k=" + expectedK + " actual=" + k);
        }
        int[] actualPrefix = Arrays.copyOf(nums, k);
        if (!Arrays.equals(expectedPrefix, actualPrefix)) {
            throw new AssertionError(
                "expected prefix=" + Arrays.toString(expectedPrefix) +
                " actual=" + Arrays.toString(actualPrefix)
            );
        }
    }

    public static void main(String[] args) {
        run(new int[]{3,2,2,3}, 3, 2, new int[]{2,2});
        run(new int[]{0,1,2,2,3,0,4,2}, 2, 5, new int[]{0,1,3,0,4});
        run(new int[]{}, 1, 0, new int[]{});
        run(new int[]{7,7,7}, 7, 0, new int[]{});
        run(new int[]{1,2,3}, 9, 3, new int[]{1,2,3});
        System.out.println("PASS 27 Remove Element");
    }
}
