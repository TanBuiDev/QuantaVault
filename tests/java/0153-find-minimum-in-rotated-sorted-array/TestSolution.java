public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3,4,5,1,2}, 1);
        test(new int[]{4,5,6,7,0,1,2}, 0);
        test(new int[]{11,13,15,17}, 11);
        test(new int[]{2,1}, 1);
        test(new int[]{1}, 1);
        System.out.println("PASS 153 Find Minimum in Rotated Sorted Array");
    }

    private static void test(int[] nums, int expected) {
        int actual = new Solution().findMin(nums);
        if (actual != expected) throw new AssertionError("expected=" + expected + " actual=" + actual);
    }
}
