public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,0,2}, 5);
        test(new int[]{1,2,2}, 4);
        test(new int[]{5}, 1);
        test(new int[]{1,2,3,4}, 10);
        test(new int[]{4,3,2,1}, 10);
        test(new int[]{1,3,4,5,2}, 11);
        test(new int[]{1,2,2,1}, 6);
        System.out.println("PASS 135 Candy");
    }

    private static void test(int[] ratings, int expected) {
        int actual = new Solution().candy(ratings);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
