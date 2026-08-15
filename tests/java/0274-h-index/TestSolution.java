public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3,0,6,1,5}, 3);
        test(new int[]{1,3,1}, 1);
        test(new int[]{0,0,0}, 0);
        test(new int[]{100}, 1);
        test(new int[]{5,5,5,5,5}, 5);
        test(new int[]{0,1,3,5,6}, 3);
        System.out.println("PASS 274 H-Index");
    }

    private static void test(int[] citations, int expected) {
        int actual = new Solution().hIndex(citations);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
