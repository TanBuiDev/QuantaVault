import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            Integer partnerIndex = seen.get(complement);
            if (partnerIndex != null) {
                return new int[]{partnerIndex, i};
            }
            seen.put(nums[i], i);
        }

        throw new IllegalStateException("No solution");
    }
}
