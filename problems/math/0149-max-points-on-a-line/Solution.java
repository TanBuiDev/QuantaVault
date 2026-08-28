import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n <= 2) {
            return n;
        }

        int answer = 2;

        // Fix each point as an anchor. Points sharing a line through this anchor
        // have exactly the same normalized direction vector (dy, dx).
        for (int i = 0; i < n; i++) {
            Map<String, Integer> count = new HashMap<>();
            int localMax = 0;

            for (int j = i + 1; j < n; j++) {
                int dy = points[j][1] - points[i][1];
                int dx = points[j][0] - points[i][0];

                // Divide by gcd so proportional vectors such as (2,4) and (1,2)
                // receive the same representation.
                int g = gcd(Math.abs(dy), Math.abs(dx));
                if (g != 0) {
                    dy /= g;
                    dx /= g;
                }

                // Canonicalize vertical, horizontal, and sign direction so the same
                // geometric slope never receives two keys such as 1/-2 and -1/2.
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

            // Slope counts contain the OTHER points; add the fixed anchor itself.
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
