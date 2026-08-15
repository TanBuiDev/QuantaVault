public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,8,6,2,5,4,8,3,7}, 49);
        test(new int[]{1,1}, 1);
        test(new int[]{5,5,5,5}, 15);
        test(new int[]{1,2,3,4,5}, 6);
        test(new int[]{0,2,0,4,0}, 4);
        System.out.println("PASS 11 Container With Most Water");
    }

    private static void test(int[] height, int expected) {
        int actual = new Solution().maxArea(height);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
