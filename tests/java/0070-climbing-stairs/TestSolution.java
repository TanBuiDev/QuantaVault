public class TestSolution {
    public static void main(String[] args) {
        test(1, 1);
        test(2, 2);
        test(3, 3);
        test(5, 8);
        test(10, 89);
        test(45, 1836311903);
        System.out.println("PASS 70 Climbing Stairs");
    }

    private static void test(int n, int expected) {
        int actual = new Solution().climbStairs(n);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
