public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{100,4,200,1,3,2}, 4);
        test(new int[]{0,3,7,2,5,8,4,6,0,1}, 9);
        test(new int[]{1,0,1,2}, 3);
        test(new int[]{}, 0);
        test(new int[]{-2,-3,-1,5}, 3);
        System.out.println("PASS 128 Longest Consecutive Sequence");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().longestConsecutive(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
