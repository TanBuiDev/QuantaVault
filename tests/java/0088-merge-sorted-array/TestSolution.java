import java.util.Arrays;

public class TestSolution {
    private static void assertArrayEquals(int[] expected, int[] actual) {
        if (!Arrays.equals(expected, actual)) {
            throw new AssertionError(
                "expected=" + Arrays.toString(expected) +
                " actual=" + Arrays.toString(actual)
            );
        }
    }

    private static void run(int[] nums1, int m, int[] nums2, int n, int[] expected) {
        new Solution().merge(nums1, m, nums2, n);
        assertArrayEquals(expected, nums1);
    }

    public static void main(String[] args) {
        run(new int[]{1,2,3,0,0,0}, 3, new int[]{2,5,6}, 3,
            new int[]{1,2,2,3,5,6});
        run(new int[]{1}, 1, new int[]{}, 0, new int[]{1});
        run(new int[]{0}, 0, new int[]{1}, 1, new int[]{1});
        run(new int[]{4,5,6,0,0,0}, 3, new int[]{1,2,3}, 3,
            new int[]{1,2,3,4,5,6});
        run(new int[]{1,2,2,0,0,0}, 3, new int[]{2,2,3}, 3,
            new int[]{1,2,2,2,2,3});
        System.out.println("PASS 88 Merge Sorted Array");
    }
}
