public class TestSolution {
    public static void main(String[] args) {
        test(7, new int[]{2,3,1,2,4,3}, 2);
        test(4, new int[]{1,4,4}, 1);
        test(11, new int[]{1,1,1,1,1,1,1,1}, 0);
        test(8, new int[]{8}, 1);
        test(15, new int[]{1,2,3,4,5}, 5);
        System.out.println("PASS 209 Minimum Size Subarray Sum");
    }

    private static void test(int target, int[] nums, int expected) {
        int actual = new Solution().minSubArrayLen(target, nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
