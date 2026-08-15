public class TestSolution {
    private static void run(int[] nums, int expected) {
        int actual = new Solution().majorityElement(nums);
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }

    public static void main(String[] args) {
        run(new int[]{3,2,3}, 3);
        run(new int[]{2,2,1,1,1,2,2}, 2);
        run(new int[]{7}, 7);
        run(new int[]{-1,-1,2,-1,3,-1,-1}, -1);
        run(new int[]{4,1,4,2,4,3,4}, 4);
        run(new int[]{5,1,5,2,5,3,5,5,4}, 5);
        System.out.println("PASS 169 Majority Element");
    }
}
