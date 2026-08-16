import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,7,11}, new int[]{2,4,6}, 3, List.of(List.of(1,2), List.of(1,4), List.of(1,6)));
        test(new int[]{1,1,2}, new int[]{1,2,3}, 2, List.of(List.of(1,1), List.of(1,1)));
        test(new int[]{-2,-1}, new int[]{-3,4}, 3, List.of(List.of(-2,-3), List.of(-1,-3), List.of(-2,4)));
        System.out.println("PASS 373 Find K Pairs with Smallest Sums");
    }

    private static void test(int[] a, int[] b, int k, List<List<Integer>> expected) {
        List<List<Integer>> actual = new Solution().kSmallestPairs(a, b, k);
        if (!actual.equals(expected)) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
