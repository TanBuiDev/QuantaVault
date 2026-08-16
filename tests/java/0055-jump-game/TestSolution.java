public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{2,3,1,1,4}, true);
        test(new int[]{3,2,1,0,4}, false);
        test(new int[]{0}, true);
        test(new int[]{1,1,1,1}, true);
        test(new int[]{5,0,0,0,0}, true);
        test(new int[]{2,0,0,1}, false);
        System.out.println("PASS 55 Jump Game");
    }

    private static void test(int[] nums, boolean expected) {
        boolean actual = new Solution().canJump(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
