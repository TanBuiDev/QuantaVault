public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3,1}, 3, true);
        test(new int[]{1,0,1,1}, 1, true);
        test(new int[]{1,2,3,1,2,3}, 2, false);
        test(new int[]{1,1}, 0, false);
        test(new int[]{99,1,2,3,1}, 3, true);
        System.out.println("PASS 219 Contains Duplicate II");
    }

    private static void test(int[] nums, int k, boolean expected) {
        boolean actual = new Solution().containsNearbyDuplicate(nums, k);
        if (actual != expected) {
            throw new AssertionError("k=" + k + " expected=" + expected + " actual=" + actual);
        }
    }
}
