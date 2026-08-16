public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,2,3,2}, 3);
        test(new int[]{0,1,0,1,0,1,99}, 99);
        test(new int[]{-7}, -7);
        test(new int[]{-2,-2,-2,-7}, -7);
        test(new int[]{Integer.MIN_VALUE,5,5,5}, Integer.MIN_VALUE);
        System.out.println("PASS 137 Single Number II");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().singleNumber(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
