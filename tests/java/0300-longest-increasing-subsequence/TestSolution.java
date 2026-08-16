public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{10,9,2,5,3,7,101,18}, 4);
        test(new int[]{0,1,0,3,2,3}, 4);
        test(new int[]{7,7,7,7,7,7,7}, 1);
        test(new int[]{5,4,3,2,1}, 1);
        test(new int[]{1,2,3,4,5}, 5);
        test(new int[]{-2,-1,-1,0,2}, 4);
        System.out.println("PASS 300 Longest Increasing Subsequence");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().lengthOfLIS(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
