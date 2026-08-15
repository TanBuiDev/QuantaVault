# 149. Max Points on a Line — Solution

## 1. Core idea / Intuition

Cố định từng điểm `i` làm anchor. Với mọi điểm `j > i`, đường thẳng qua hai điểm được xác định bởi slope:

```text
dy = yj - yi
dx = xj - xi
```

Không dùng `double`, vì hai slope toán học bằng nhau có thể khác nhau do precision. Ta rút gọn `(dy, dx)` bằng GCD và chuẩn hóa dấu để tạo key duy nhất.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần số điểm lớn nhất cùng trên một straight line. Các điểm là duy nhất, nên không phải xử lý duplicate coordinates.

## 3. Key observations / Nhận xét quan trọng

- Với một anchor, mọi line qua anchor tương ứng một normalized slope.
- `(2,4)` và `(1,2)` phải cùng key.
- `(-1,-2)` cũng phải canonicalize về cùng direction.
- Vertical line dùng một key cố định như `(1,0)`; horizontal line dùng `(0,1)`.

## 4. Alternative approaches / Các hướng khác

Brute force chọn hai điểm rồi scan toàn bộ điểm để kiểm tra collinear có thể lên tới `O(n^3)`. Anchor + HashMap giảm xuống `O(n^2)` và đủ cho `n <= 300`.

## 5. Optimal approach / Hướng tối ưu

Với mỗi anchor:

1. Tạo `Map<String,Integer>`.
2. Với mỗi điểm sau anchor, tính `dy`, `dx`.
3. Normalize bằng GCD và dấu.
4. Tăng count cho slope key.
5. `localMax + 1` là số điểm trên line tốt nhất qua anchor.

## 6. Java solution overview

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxPoints(int[][] points) {
        int n = points.length;
        if (n <= 2) return n;
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
```

## 7. Code explanation / Giải thích code

Map count không tính anchor, nên khi một slope xuất hiện `k` lần thì line đó có `k + 1` điểm. GCD làm pair nguyên tối giản; canonical sign đảm bảo cùng geometric slope dùng cùng key.

## 8. Dry run / Chạy thử

Với `[[1,1],[2,2],[3,3]]`, anchor `[1,1]` tạo hai vector `(1,1)` và `(2,2)`, cả hai normalize thành `(1,1)`, count bằng `2`; cộng anchor cho kết quả `3`.

## 9. Time and space complexity

```text
Time:  O(n^2)
Space: O(n)
```

Mỗi anchor có tối đa `n-1` slope keys.

## 10. Why the algorithm is correct / Vì sao đúng

Một tập điểm collinear bất kỳ có một điểm sớm nhất theo index; khi điểm đó làm anchor, mọi điểm còn lại trong tập tạo cùng normalized slope và được map đếm chung. Ngược lại, các điểm được đếm chung dưới cùng normalized slope với anchor đều có cùng tỷ lệ `dy/dx`, nên nằm trên cùng một line. Lấy maximum qua mọi anchor vì vậy cho đáp án toàn cục.

## 11. Edge cases

- Một hoặc hai điểm.
- Vertical line.
- Horizontal line.
- Negative slope.
- Nhiều line khác nhau qua cùng anchor.

## 12. Common mistakes

- Dùng `double` làm slope key.
- Không rút gọn slope bằng GCD.
- Không canonicalize dấu.
- Quên cộng anchor vào local slope count.

## 13. Pattern recognition / Khi nào tái sử dụng

Anchor + normalized ratio hữu ích khi nhóm các cặp theo direction/rate mà floating-point representation không đáng tin cậy.

## 14. Vocabulary

- **straight line**: đường thẳng
- **slope**: hệ số góc
- **anchor point**: điểm neo
- **greatest common divisor (GCD)**: ước chung lớn nhất
- **normalize**: chuẩn hóa
- **collinear**: thẳng hàng
