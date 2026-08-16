# 52. N-Queens II — Solution / Lời giải

## 1. Core idea / Intuition
Dùng `backtracking` theo từng hàng. Vì mỗi hàng chỉ đặt đúng một hậu, ta chỉ cần thử các cột chưa xung đột với cột và hai đường chéo đã dùng.

## 2. Requirement recap / Tóm tắt yêu cầu
Không cần dựng các bàn cờ; chỉ cần đếm số cấu hình hợp lệ.

## 3. Key observations / Nhận xét quan trọng
- Hai hậu cùng cột xung đột.
- Hai ô cùng đường chéo chính có cùng `row - col`.
- Hai ô cùng đường chéo phụ có cùng `row + col`.

## 4. Alternative approach
Kiểm tra toàn bộ các cặp hậu sau mỗi lần đặt sẽ tốn thêm thời gian. Ta nên duy trì trạng thái xung đột trực tiếp.

## 5. Optimal approach
Tại hàng `row`, thử từng `col`. Nếu ba cấu trúc đánh dấu đều chưa dùng, đặt hậu, recurse sang hàng sau rồi undo.

## 6. Java solution overview
Ba mảng boolean cho `columns`, `diag1`, `diag2` cho phép kiểm tra và cập nhật trong `O(1)`.

## 7. Code explanation
```java
class Solution {
    public int totalNQueens(int n) {
        return search(0, n, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1]);
    }

    private int search(int row, int n, boolean[] columns, boolean[] diag1, boolean[] diag2) {
        if (row == n) {
            return 1;
        }
        int count = 0;
        for (int col = 0; col < n; col++) {
            int d1 = row - col + n - 1;
            int d2 = row + col;
            if (columns[col] || diag1[d1] || diag2[d2]) {
                continue;
            }
            columns[col] = diag1[d1] = diag2[d2] = true;
            count += search(row + 1, n, columns, diag1, diag2);
            columns[col] = diag1[d1] = diag2[d2] = false;
        }
        return count;
    }
}
```

## 8. Dry run
Với `n = 4`, chọn một cột cho hàng 0, đánh dấu cột và hai đường chéo, rồi tiếp tục. Mọi nhánh xung đột bị cắt ngay. Có đúng 2 nhánh đi tới hàng 4.

## 9. Time and space complexity
Worst-case search thường được mô tả là `O(n!)` nhờ constraint mỗi hàng/cột. Bộ nhớ phụ là `O(n)` cho recursion và các mảng đánh dấu.

## 10. Why the algorithm is correct
Mỗi recursive level đặt đúng một hậu trên một hàng mới. Ba bảng đánh dấu đảm bảo hậu mới không tấn công hậu cũ. Thuật toán thử mọi cột hợp lệ ở mỗi hàng nên liệt kê đủ mọi cấu hình hợp lệ và đếm mỗi cấu hình một lần.

## 11. Edge cases
`n = 1` có đúng một lời giải.

## 12. Common mistakes
- Quên offset cho `row - col`.
- Không undo trạng thái sau recursion.
- Đếm cấu hình trước khi đã đặt đủ `n` hậu.

## 13. Pattern recognition
Mẫu `row-by-row constraint backtracking` phù hợp với các bài placement có giới hạn cột/đường chéo.

## 14. Vocabulary
`queen placement`, `main diagonal`, `anti-diagonal`, `backtracking`, `constraint`, `pruning`.
