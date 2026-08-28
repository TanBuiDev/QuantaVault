class Solution {
    public int rob(int[] nums) {
        // prevOne = optimum for houses processed so far; prevTwo = optimum before
        // the immediately previous house. Only these two states are needed.
        int prevTwo = 0;
        int prevOne = 0;

        for (int money : nums) {
            // For current house, either skip it and keep prevOne, or rob it and
            // combine its money with prevTwo because adjacent houses cannot both be robbed.
            int current = Math.max(prevOne, prevTwo + money);
            prevTwo = prevOne;
            prevOne = current;
        }

        return prevOne;
    }
}
