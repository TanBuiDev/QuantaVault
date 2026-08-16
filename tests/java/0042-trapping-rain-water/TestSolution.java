public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}, 6);
        test(new int[]{4,2,0,3,2,5}, 9);
        test(new int[]{0,1,2,3}, 0);
        test(new int[]{3,0,3}, 3);
        test(new int[]{5,2,1,2,1,5}, 14);
        test(new int[]{1}, 0);
        System.out.println("PASS 42 Trapping Rain Water");
    }

    private static void test(int[] height, int expected) {
        int actual = new Solution().trap(height);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
