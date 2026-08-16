import java.util.HashSet;
import java.util.Set;

class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> values = new HashSet<>();
        for (int value : nums) {
            values.add(value);
        }

        int best = 0;
        for (int value : values) {
            if (!values.contains(value - 1)) {
                int current = value;
                int length = 1;

                while (values.contains(current + 1)) {
                    current++;
                    length++;
                }

                best = Math.max(best, length);
            }
        }

        return best;
    }
}
