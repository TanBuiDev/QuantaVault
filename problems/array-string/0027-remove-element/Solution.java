class Solution {
    public int removeElement(int[] nums, int val) {
        int write = 0;

        for (int num : nums) {
            if (num != val) {
                nums[write++] = num;
            }
        }

        return write;
    }
}
