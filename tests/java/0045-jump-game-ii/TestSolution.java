public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,3,1,1,4}, 2);
        test(new int[]{2,3,0,1,4}, 2);
        test(new int[]{0}, 0);
        test(new int[]{4,1,1,1,1}, 1);
        test(new int[]{1,1,1,1}, 3);
        test(new int[]{1,2,3,4,5}, 3);
        System.out.println("PASS 45 Jump Game II");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().jump(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
