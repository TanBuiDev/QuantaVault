import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n <= 2) {
            return n;
        }

        int answer = 2;

        for (int i = 0; i < n; i++) {
            Map<String, Integer> count = new HashMap<>();
            int localMax = 0;

            for (int j = i + 1; j < n; j++) {
                int dy = points[j][1] - points[i][1];
                int dx = points[j][0] - points[i][0];

                int g = gcd(Math.abs(dy), Math.abs(dx));
                if (g != 0) {
                    dy /= g;
                    dx /= g;
                }

                if (dx == 0) {
                    dy = 1;
                } else if (dy == 0) {
                    dx = 1;
                } else if (dx < 0) {
                    dx = -dx;
                    dy = -dy;
                }

                String key = dy + "/" + dx;
                int value = count.getOrDefault(key, 0) + 1;
                count.put(key, value);
                localMax = Math.max(localMax, value);
            }

            answer = Math.max(answer, localMax + 1);
        }

        return answer;
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = a % b;
            a = b;
            b = temp;
        }
        return a;
    }
}
