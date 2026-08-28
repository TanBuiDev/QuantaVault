import java.util.ArrayList;
import java.util.List;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int mergedStart = newInterval[0];
        int mergedEnd = newInterval[1];

        // end < mergedStart nghĩa là interval nằm hoàn toàn bên trái. Dùng strict <
        // vì chạm endpoint vẫn được tính là overlap và phải chuyển sang phase merge.
        while (i < intervals.length && intervals[i][1] < mergedStart) {
            result.add(intervals[i]);
            i++;
        }

        // mergedEnd có thể mở rộng trong loop, nên một interval không overlap trực tiếp
        // newInterval ban đầu vẫn có thể overlap với union đã được mở rộng trước đó.
        while (i < intervals.length && intervals[i][0] <= mergedEnd) {
            mergedStart = Math.min(mergedStart, intervals[i][0]);
            mergedEnd = Math.max(mergedEnd, intervals[i][1]);
            i++;
        }

        // Khi loop dừng, interval kế tiếp bắt đầu sau mergedEnd; vì input sorted,
        // không interval tương lai nào còn có thể nối vào merged block.
        result.add(new int[]{mergedStart, mergedEnd});

        while (i < intervals.length) {
            result.add(intervals[i]);
            i++;
        }

        return result.toArray(new int[result.size()][]);
    }
}
