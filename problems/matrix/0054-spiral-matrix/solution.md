# 54. Spiral Matrix — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Spiral traversal chỉ cần giữ bốn boundary top,bottom,left,right của rectangle chưa đọc. Mỗi vòng lấy top row, right column, bottom row và left column rồi co rectangle vào trong.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Mô phỏng direction với visited matrix hoạt động nhưng dùng extra space và nhiều turning logic. Quan sát các lớp hình chữ nhật được bóc lần lượt, nên bốn boundaries đủ mô tả toàn bộ phần chưa xử lý.

**State / invariant / data structure cần hiểu trước code.** Invariant: mọi cell ngoài [top..bottom]x[left..right] đã được output đúng một lần. Sau mỗi side, boundary tương ứng dịch vào; trước bottom/left pass phải check rectangle còn tồn tại.

**Dry run mental theo implementation.** Dry run 3x4: lấy row0, col3 từ row1..2, row2 ngược col2..0, col0 ngược row1; boundaries còn top=1,bottom=1,left=1,right=2 và lấy nốt [6,7].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là duplicate row/column ở rectangle một hàng hoặc một cột. Khi nào dùng: traversal theo concentric layers thường nén visited state thành moving boundaries.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Mô phỏng từng lớp bằng bốn boundary của phần ma trận chưa xử lý:

```text
top, bottom, left, right
```

Mỗi vòng đọc tối đa bốn cạnh rồi co boundary vào trong.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> answer = new ArrayList<>();
        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;

        // Rectangle [top..bottom] x [left..right] luôn là chính xác vùng chưa output.
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) {
                answer.add(matrix[top][c]);
            }
            top++;

            for (int r = top; r <= bottom; r++) {
                answer.add(matrix[r][right]);
            }
            right--;

            // Sau hai cạnh đầu, rectangle có thể đã co thành rỗng (single row).
            // Guard ngăn đọc bottom edge lần hai và tạo duplicate.
            if (top <= bottom) {
                for (int c = right; c >= left; c--) {
                    answer.add(matrix[bottom][c]);
                }
                bottom--;
            }

            // Tương tự với single column: chỉ đọc left edge nếu vẫn còn cột chưa xử lý.
            if (left <= right) {
                for (int r = bottom; r >= top; r--) {
                    answer.add(matrix[r][left]);
                }
                left++;
            }
        }

        return answer;
    }
}
```

## 3. Why the guards matter

Với single row, sau khi đọc top row thì `top > bottom`; nếu vẫn đọc bottom row sẽ duplicate. Tương tự single column cần guard trước left-column traversal.

## 4. Correctness

Invariant: trước mỗi vòng, rectangle `[top..bottom] x [left..right]` chứa chính xác các cell chưa output. Bốn traversal xuất các cell trên perimeter đúng clockwise order và boundary update loại đúng perimeter đó. Guards bảo đảm một degenerate perimeter không bị đọc hai lần. Khi rectangle rỗng, mọi cell đã xuất đúng một lần.

## 5. Complexity

Mỗi cell được đọc đúng một lần:

```text
Time: O(m*n)
Extra space: O(1) excluding output
```

## 6. Common mistakes

- Không guard bottom/left traversal.
- Update boundary sai thứ tự.
- Dùng visited matrix không cần thiết.
- Chỉ test square matrix mà quên rectangular/single-row/single-column.
