public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3,2,1,5,6,4}, 2, 5);
        test(new int[]{3,2,3,1,2,4,5,5,6}, 4, 4);
        test(new int[]{2,2,2}, 2, 2);
        test(new int[]{-1,-5,-3}, 1, -1);
        test(new int[]{5,4,3,2,1}, 5, 1);
        System.out.println("PASS 215 Kth Largest Element in an Array");
    }

    private static void test(int[] nums, int k, int expected) {
        int actual = new Solution().findKthLargest(nums, k);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
