public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3,1}, 4);
        test(new int[]{2,7,9,3,1}, 12);
        test(new int[]{5}, 5);
        test(new int[]{0,0,0}, 0);
        test(new int[]{2,1,1,2}, 4);
        test(new int[]{10,1,1,10}, 20);
        System.out.println("PASS 198 House Robber");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().rob(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
