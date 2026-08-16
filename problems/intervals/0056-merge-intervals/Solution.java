import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int currentStart = intervals[0][0];
        int currentEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            int nextStart = intervals[i][0];
            int nextEnd = intervals[i][1];

            if (nextStart <= currentEnd) {
                currentEnd = Math.max(currentEnd, nextEnd);
            } else {
                merged.add(new int[]{currentStart, currentEnd});
                currentStart = nextStart;
                currentEnd = nextEnd;
            }
        }

        merged.add(new int[]{currentStart, currentEnd});
        return merged.toArray(new int[merged.size()][]);
    }
}
