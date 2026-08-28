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
            // Chỉ value không có predecessor mới là đầu một maximal sequence.
            // Nếu expand từ mọi value, một dãy dài sẽ bị quét lặp và thành O(n^2).
            if (!values.contains(value - 1)) {
                int current = value;
                int length = 1;

                // Vì mỗi sequence chỉ được mở rộng từ đầu duy nhất của nó,
                // mỗi distinct value tham gia một expansion tối đa một lần amortized.
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
