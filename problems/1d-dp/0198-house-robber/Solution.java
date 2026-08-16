class Solution {
    public int rob(int[] nums) {
        int prevTwo = 0;
        int prevOne = 0;

        for (int money : nums) {
            int current = Math.max(prevOne, prevTwo + money);
            prevTwo = prevOne;
            prevOne = current;
        }

        return prevOne;
    }
}
