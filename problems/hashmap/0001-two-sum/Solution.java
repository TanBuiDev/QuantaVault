import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            // Lookup trước insert để map chỉ chứa các index < i; nhờ đó nếu tìm thấy
            // complement thì hai phần tử chắc chắn khác index, kể cả khi nums[i] == complement.
            Integer partnerIndex = seen.get(complement);
            if (partnerIndex != null) {
                return new int[]{partnerIndex, i};
            }

            // Current value chỉ trở thành candidate cho các phần tử phía sau.
            // Overwrite duplicate là an toàn vì đề chỉ cần một pair và index mới vẫn hợp lệ.
            seen.put(nums[i], i);
        }

        throw new IllegalStateException("No solution");
    }
}
