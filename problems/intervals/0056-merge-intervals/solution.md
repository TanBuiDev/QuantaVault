# 56. Merge Intervals — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Sau khi sort intervals theo start, nếu interval mới bắt đầu trước hoặc tại end của interval đang merge thì chúng overlap; nếu start lớn hơn end, không interval tương lai nào có thể nối ngược lại vì starts chỉ tăng.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** So mọi cặp và merge lặp là rối và O(n²). Sorting tạo thứ tự để quyết định overlap chỉ bằng currentEnd; mỗi interval được merge một lần vào accumulator.

**State / invariant / data structure cần hiểu trước code.** current=[start,end] là union của một run intervals overlap đã thấy. Invariant mọi interval trước current đã được output và kết thúc trước current.start; current bao phủ toàn bộ run chưa flush.

**Dry run mental theo implementation.** Dry run [[1,3],[2,6],[8,10],[15,18]]: [1,3] gặp [2,6] overlap -> [1,6]; [8,10] tách nên flush [1,6], rồi các interval sau tương tự.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là sort theo end nhưng dùng logic start đơn giản, hoặc dùng < thay <= khi endpoint chạm nhau vẫn overlap. Khi nào dùng: interval union thường sort by start rồi sweep.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Intuition

Nếu các interval đang ở thứ tự bất kỳ, một interval có thể overlap với một interval nằm rất xa trong input. Vì vậy bước quan trọng nhất là **sort theo điểm bắt đầu**. Sau khi sort, ta scan một lần từ trái sang phải và duy trì interval đã merge hiện tại.

Với current interval `[currentStart, currentEnd]` và interval kế tiếp `[nextStart, nextEnd]`:

- nếu `nextStart <= currentEnd`, chúng overlap, nên mở rộng `currentEnd = max(currentEnd, nextEnd)`;
- nếu `nextStart > currentEnd`, current interval đã kết thúc chắc chắn và có thể đưa vào answer.

## 2. Requirement recap / Tóm tắt yêu cầu

Ta phải trả về các interval không overlap nhau nhưng bao phủ chính xác union của input. Hai interval chạm nhau tại endpoint cũng được xem là overlap.

## 3. Key observations / Nhận xét quan trọng

Sau khi sort theo `start`, nếu interval kế tiếp không overlap với current merged interval thì không interval nào phía sau có thể quay lại overlap current interval nữa. Khi overlap phải dùng `Math.max(currentEnd, nextEnd)` để xử lý nested interval.

## 4. Optimal Java solution

```java
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
```

## 5. Dry run

`[[1,3],[2,6],[8,10],[15,18]]` → merge `[1,3]` với `[2,6]` thành `[1,6]`, sau đó hai gap chốt lần lượt `[1,6]`, `[8,10]`, rồi flush `[15,18]`.

## 6. Correctness / Vì sao đúng

Invariant: `[currentStart,currentEnd]` là union đã merge của group liên tiếp cuối cùng trong prefix đã xử lý nhưng chưa output. Overlap mở rộng đúng union; gap chứng minh current group không thể được interval tương lai mở rộng do start đã sort. Flush cuối hoàn tất group còn lại.

## 7. Complexity

```text
Time: O(n log n)
Space: O(n) including output
```

Sort chi phối thời gian; sweep là `O(n)`.

## 8. Common mistakes

- Không sort trước khi sweep.
- Dùng `<` thay vì `<=` và bỏ touching endpoint.
- Gán `currentEnd = nextEnd` thay vì `max`.
- Quên flush group cuối.
- Dùng `a[0]-b[0]` thay `Integer.compare` trong miền có nguy cơ overflow.
