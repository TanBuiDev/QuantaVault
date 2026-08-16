import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,2,3}, new int[]{1,2,4});
        test(new int[]{4,3,2,1}, new int[]{4,3,2,2});
        test(new int[]{9}, new int[]{1,0});
        test(new int[]{1,9,9}, new int[]{2,0,0});
        test(new int[]{9,9,9}, new int[]{1,0,0,0});
        System.out.println("PASS 66 Plus One");
    }

    private static void test(int[] digits, int[] expected) {
        int[] actual = new Solution().plusOne(digits);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }
}
