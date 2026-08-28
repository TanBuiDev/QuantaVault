# 57. Insert Interval — Solution

## 1. Core idea / Intuition

Vì `intervals` đã **sorted theo start** và **không overlap**, ta không cần sort lại. Chỉ cần scan một lần theo ba phase:

1. Add tất cả interval nằm hoàn toàn trước `newInterval`.
2. Merge tất cả interval overlap với `newInterval` thành một interval duy nhất.
3. Add phần còn lại nằm hoàn toàn sau interval đã merge.

## 2. Key observations

Phase 1 dùng `end < mergedStart`, không dùng `<=`, vì touching endpoint phải merge. Trong phase overlap, điều kiện phải so với `mergedEnd` đang thay đổi chứ không chỉ end ban đầu của `newInterval`.

## 3. Optimal Java solution

```java
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
```

## 4. Dry run

Với `[[1,2],[3,5],[6,7],[8,10],[12,16]]` và `[4,8]`, phase 1 giữ `[1,2]`; phase 2 mở `[4,8]` thành `[3,10]`; phase 3 giữ `[12,16]`.

## 5. Correctness

Phase 1 chỉ output interval chắc chắn ở trái. Phase 2 duy trì union chính xác của new interval và toàn bộ overlap block. Khi phase 2 dừng, sorted order chứng minh mọi interval còn lại đều ở phải. Vì vậy output vẫn sorted, non-overlapping và có union chính xác.

## 6. Complexity

```text
Time: O(n)
Space: O(n) including output
```

Mỗi interval được xét tối đa một lần; ngoài output state là `O(1)`.

## 7. Common mistakes

- Sort lại input dù không cần.
- Dùng `<=` ở phase 1.
- Chỉ so overlap với `newInterval` ban đầu.
- Add merged interval nhiều lần.
- Quên input rỗng.
