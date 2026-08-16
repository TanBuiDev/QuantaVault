public class TestSolution {
    public static void main(String[] args) {
        test(2, 0, new int[]{1,2,3}, new int[]{0,1,1}, 4);
        test(3, 0, new int[]{1,2,3}, new int[]{0,1,2}, 6);
        test(2, 0, new int[]{5}, new int[]{1}, 0);
        test(1, 2, new int[]{10,1}, new int[]{2,0}, 12);
        System.out.println("PASS 502 IPO");
    }

    private static void test(int k, int w, int[] p, int[] c, int expected) {
        int actual = new Solution().findMaximizedCapital(k, w, p, c);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
