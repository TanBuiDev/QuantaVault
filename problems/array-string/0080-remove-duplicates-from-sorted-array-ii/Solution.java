class Solution {
    public int removeDuplicates(int[] nums) {
        int write = 0;

        for (int num : nums) {
            if (write < 2 || num != nums[write - 2]) {
                nums[write++] = num;
            }
        }

        return write;
    }
}
