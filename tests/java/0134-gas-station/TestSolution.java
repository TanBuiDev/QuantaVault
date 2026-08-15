public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2}, 3);
        test(new int[]{2,3,4}, new int[]{3,4,3}, -1);
        test(new int[]{5}, new int[]{4}, 0);
        test(new int[]{2}, new int[]{3}, -1);
        test(new int[]{1,1,1,10}, new int[]{2,2,2,1}, 3);
        System.out.println("PASS 134 Gas Station");
    }

    private static void test(int[] gas, int[] cost, int expected) {
        int actual = new Solution().canCompleteCircuit(gas, cost);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
