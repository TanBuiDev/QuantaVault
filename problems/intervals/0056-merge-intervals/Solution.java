import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Sort theo start biến overlap vốn có thể nằm xa nhau trong input thành
        // quan hệ cục bộ với current merged interval khi sweep từ trái sang phải.
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int currentStart = intervals[0][0];
        int currentEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int nextStart = intervals[i][0];
            int nextEnd = intervals[i][1];

            if (nextStart <= currentEnd) {
                // Interval mới đã nối vào current group; phải lấy max vì nó có thể
                // nằm hoàn toàn bên trong current interval và không được làm end co lại.
                currentEnd = Math.max(currentEnd, nextEnd);
            } else {
                // Vì các start phía sau đều >= nextStart > currentEnd, current group
                // không thể overlap với bất kỳ interval tương lai nào nên đã final.
                merged.add(new int[]{currentStart, currentEnd});
                currentStart = nextStart;
                currentEnd = nextEnd;
            }
        }

        // Group cuối không có một gap phía sau để trigger nhánh flush trong loop.
        merged.add(new int[]{currentStart, currentEnd});
        return merged.toArray(new int[merged.size()][]);
    }
}
