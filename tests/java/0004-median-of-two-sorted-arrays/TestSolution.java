public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,3}, new int[]{2}, 2.0);
        test(new int[]{1,2}, new int[]{3,4}, 2.5);
        test(new int[]{}, new int[]{1}, 1.0);
        test(new int[]{0,0}, new int[]{0,0}, 0.0);
        test(new int[]{1}, new int[]{2,3,4,5}, 3.0);
        System.out.println("PASS 4 Median of Two Sorted Arrays");
    }

    private static void test(int[] a, int[] b, double expected) {
        double actual = new Solution().findMedianSortedArrays(a, b);
        if (Math.abs(actual - expected) > 1e-9) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
