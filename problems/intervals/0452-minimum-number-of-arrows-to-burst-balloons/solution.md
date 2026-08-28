# 452. Minimum Number of Arrows to Burst Balloons — Solution

## 1. Core idea / Intuition

Mỗi balloon là interval `[xstart,xend]`. Greedy chuẩn là **sort theo xend tăng dần**. Với balloon chưa được cover kết thúc sớm nhất, nếu cần arrow mới thì đặt tại chính `xend`: đây là điểm xa nhất sang phải vẫn chắc chắn bắn được balloon đó, đồng thời giữ cơ hội cover nhiều balloon sau nhất.

## 2. Optimal Java solution

```java
import java.util.Arrays;

class Solution {
    public int findMinArrowShots(int[][] points) {
        // Earliest end là balloon hạn chế nhất. Chọn arrow tại end đó là điểm
        // xa nhất sang phải vẫn chắc chắn burst nó, giữ tối đa cơ hội cover suffix.
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

        int arrows = 1;
        int arrowX = points[0][1];

        for (int i = 1; i < points.length; i++) {
            // Endpoint inclusive: start == arrowX vẫn được arrow hiện tại cover.
            // Chỉ khi start vượt arrowX mới bắt buộc mở một group/arrow mới.
            if (points[i][0] > arrowX) {
                arrows++;
                arrowX = points[i][1];
            }
        }

        return arrows;
    }
}
```

## 3. Why sort by end

Balloon có end nhỏ nhất sẽ hết vùng hợp lệ sớm nhất. Nếu ta chưa cover nó, mọi lời giải đều phải đặt một arrow trong interval của nó. Dịch một arrow hợp lệ sang chính earliest end không làm mất balloon hiện tại và đặt arrow xa phải nhất có thể cho các interval sau.

## 4. Dry run

`[[10,16],[2,8],[1,6],[7,12]]` sort theo end thành `[[1,6],[2,8],[7,12],[10,16]]`. Arrow tại `6` cover hai interval đầu; `[7,12]` buộc arrow mới tại `12`, arrow đó cover `[10,16]`. Kết quả `2`.

## 5. Correctness

Exchange argument cho thấy tồn tại lời giải tối ưu đặt arrow đầu tại earliest end. Sau đó mọi interval chứa `arrowX` được cover miễn phí; interval đầu có `start > arrowX` không thể dùng arrow cũ và bắt buộc cần arrow mới. Áp dụng lặp cho suffix cho số arrow tối thiểu.

## 6. Complexity

```text
Time: O(n log n)
```

Sort chi phối; greedy state ngoài sort là `O(1)`.

## 7. Common mistakes

- Sort theo start rồi dùng cùng greedy.
- Comparator `a[1]-b[1]` có thể overflow.
- Dùng `start >= arrowX`, sai vì endpoints inclusive.
- Cập nhật `arrowX` khi interval vẫn được cover.
