public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,2,1}, 1);
        test(new int[]{4,1,2,1,2}, 4);
        test(new int[]{1}, 1);
        test(new int[]{-1,4,4}, -1);
        test(new int[]{0,7,7}, 0);
        System.out.println("PASS 136 Single Number");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().singleNumber(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
