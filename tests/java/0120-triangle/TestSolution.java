import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(Arrays.asList(
            Arrays.asList(2),
            Arrays.asList(3,4),
            Arrays.asList(6,5,7),
            Arrays.asList(4,1,8,3)
        ), 11);
        test(Arrays.asList(Arrays.asList(-10)), -10);
        test(Arrays.asList(Arrays.asList(1), Arrays.asList(2,3)), 3);
        test(Arrays.asList(
            Arrays.asList(-1),
            Arrays.asList(2,3),
            Arrays.asList(1,-1,-3)
        ), -1);
        System.out.println("PASS 120 Triangle");
    }

    private static void test(List<List<Integer>> triangle, int expected) {
        int actual = new Solution().minimumTotal(triangle);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
