import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> lastSeen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            Integer previous = lastSeen.get(nums[i]);
            if (previous != null && i - previous <= k) {
                return true;
            }
            lastSeen.put(nums[i], i);
        }

        return false;
    }
}
