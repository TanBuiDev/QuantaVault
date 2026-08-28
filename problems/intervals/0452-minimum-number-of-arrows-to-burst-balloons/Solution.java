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
