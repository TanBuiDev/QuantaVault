import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> lastSeen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            Integer previous = lastSeen.get(nums[i]);

            // Chỉ latest occurrence cần giữ: nếu latest đã cách quá k thì mọi
            // occurrence cũ hơn còn xa hơn, nên không thể tạo pair hợp lệ với i.
            if (previous != null && i - previous <= k) {
                return true;
            }

            // Overwrite bằng index mới nhất để tối thiểu hóa distance cho các lần gặp sau.
            lastSeen.put(nums[i], i);
        }

        return false;
    }
}
