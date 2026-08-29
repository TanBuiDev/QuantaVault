# Solution / Lời giải — 149. Max Points on a Line

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Max Points on a Line: cố định một anchor point i, mọi point j trên cùng line qua i có cùng slope. Ta chỉ cần group các j theo slope canonical rồi lấy group lớn nhất cho từng anchor.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** So mọi triples O(n³) hoặc dùng floating slope dễ precision/vertical issues. Quan sát slope dy/dx có thể chuẩn hóa thành reduced integer pair bằng gcd và sign convention, dùng HashMap key.

**State / invariant / data structure cần hiểu trước code.** Với mỗi anchor, map[normalized(dy,dx)] là số points khác cùng direction line. Invariant các equivalent slopes reduce về cùng pair; vertical/horizontal và duplicate points cần convention rõ theo constraints.

**Dry run mental theo implementation.** Anchor (1,1), points (2,2),(3,3): deltas (1,1),(2,2) đều gcd-reduce (1,1), count2 plus anchor=3. Point (1,3) canonical vertical key khác.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng double slope hoặc không normalize dấu khiến (1,1) và(-1,-1) khác keys. Khi nào dùng: geometric collinearity/group-by-ratio nên canonicalize rational direction bằng gcd.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Fix one point as anchor and group every later point by its exact normalized slope relative to that anchor. The largest slope group plus the anchor is the largest line through it.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

For a fixed anchor, two distinct points lie on the same line through it iff their direction vectors are proportional. GCD reduction and sign normalization produce the same key exactly for proportional directions, so each map bucket is exactly one line through the anchor.

## 4. Complexity

`O(n² log C)` including GCD arithmetic on coordinate differences, `O(n)` map space per anchor.
