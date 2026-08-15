# 221. Maximal Square — Interview Preparation / Chuẩn bị phỏng vấn

File này dùng để luyện cách giải thích thuật toán sau khi đã hiểu `solution.md`. Các câu hỏi là practice questions dựa trên recurrence, correctness, complexity và edge cases; không phải thống kê tần suất phỏng vấn.

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

### Pitch (EN)

> I use dynamic programming where each state represents the side length of the largest all-1 square ending at the current cell. If the current cell is `1`, the state is one plus the minimum of the top, left, and top-left diagonal states. If it is `0`, the state is zero. I keep the maximum side length and return its square. I compress the DP table to one row, so the complexity is O(mn) time and O(n) extra space.

### Pitch (VI)

> Tôi dùng dynamic programming, trong đó mỗi trạng thái là độ dài cạnh lớn nhất của hình vuông toàn `1` có góc dưới-phải tại ô hiện tại. Nếu ô hiện tại là `1`, trạng thái bằng một cộng minimum của top, left và diagonal. Nếu là `0`, trạng thái bằng `0`. Tôi giữ cạnh lớn nhất rồi bình phương để lấy diện tích. Bảng DP được nén còn một hàng nên thời gian là O(mn) và bộ nhớ phụ là O(n).

## 2. Core practice question — Explain the DP state

**Q (EN):** What does your DP state represent?

**Q (VI):** Trạng thái DP của bạn biểu diễn điều gì?

### Short answer (EN)

> It is the side length of the largest all-1 square whose bottom-right corner is the current cell.

### Trả lời ngắn (VI)

> Nó là độ dài cạnh lớn nhất của hình vuông toàn `1` có góc dưới-phải tại ô hiện tại.

### Standard answer (EN)

> I define the state by a fixed bottom-right corner. This makes the transition local: for a `1` cell, I only need the states directly above, directly left, and diagonally up-left. The maximum of all states gives the largest side length anywhere in the matrix.

### Trả lời chuẩn (VI)

> Tôi cố định góc dưới-phải cho mỗi trạng thái. Nhờ vậy transition chỉ phụ thuộc vào ba trạng thái lân cận: trên, trái và chéo trên-trái. Maximum của mọi trạng thái chính là cạnh lớn nhất trong toàn ma trận.

## 3. Common reasoning check — Why take the minimum?

**Q (EN):** Why do you take the minimum of the three neighboring states?

**Q (VI):** Tại sao phải lấy minimum của ba trạng thái lân cận?

### Short answer (EN)

> A larger square needs support from all three directions, so the smallest neighbor is the bottleneck.

### Trả lời ngắn (VI)

> Hình vuông lớn hơn cần cả ba phía cùng hỗ trợ, nên hàng xóm nhỏ nhất là bottleneck.

### Standard answer (EN)

> Suppose the current cell is `1`. To build a square of side `k`, the top, left, and top-left regions must each support a square of at least side `k - 1`. If one of them is smaller, that missing area prevents us from forming the larger square. Therefore the maximum valid side is one plus the minimum of the three values.

### Trả lời chuẩn (VI)

> Giả sử ô hiện tại là `1`. Muốn tạo square cạnh `k`, cả vùng trên, trái và chéo trên-trái đều phải hỗ trợ ít nhất cạnh `k - 1`. Chỉ cần một vùng nhỏ hơn thì phần thiếu đó ngăn ta tạo square lớn hơn. Vì vậy cạnh tối đa bằng một cộng minimum của ba giá trị.

## 4. Common reasoning check — What happens on a zero cell?

**Q (EN):** Why must the DP value become zero when the current cell is `0`?

**Q (VI):** Vì sao trạng thái DP phải bằng `0` khi ô hiện tại là `0`?

### Short answer (EN)

> No all-1 square can end at a cell containing `0`.

### Trả lời ngắn (VI)

> Không hình vuông toàn `1` nào có thể kết thúc tại một ô chứa `0`.

### Standard answer (EN)

> The state describes a square that includes the current cell as its bottom-right corner. If that cell is `0`, every such candidate square contains a zero, so its valid side length is zero. Resetting the state is also important in the rolling-array implementation because stale values from the previous row must not survive.

### Trả lời chuẩn (VI)

> Trạng thái mô tả một square bắt buộc chứa ô hiện tại ở góc dưới-phải. Nếu ô đó là `0`, mọi candidate đều chứa `0`, nên side length hợp lệ bằng `0`. Việc reset cũng ngăn giá trị cũ của previous row bị giữ lại trong rolling array.

## 5. Core practice question — Explain the rolling array

**Q (EN):** How do you reduce the space from O(mn) to O(n)?

**Q (VI):** Bạn giảm bộ nhớ từ O(mn) xuống O(n) như thế nào?

### Short answer (EN)

> I keep one DP row and save the overwritten top value in a variable so it becomes the diagonal value for the next column.

### Trả lời ngắn (VI)

> Tôi giữ một hàng DP và lưu giá trị top cũ vào một biến để dùng làm diagonal cho cột kế tiếp.

### Standard answer (EN)

> Before updating `dp[j]`, it still stores the value from the previous row, so it is the top state. `dp[j - 1]` has already been updated in the current row, so it is the left state. I store the old `dp[j]` in `top`, and after processing the cell I assign `diagonal = top`. That preserves all three values needed for the next transition.

### Trả lời chuẩn (VI)

> Trước khi update, `dp[j]` vẫn là trạng thái của previous row nên chính là top. `dp[j - 1]` đã được update ở current row nên là left. Tôi lưu `dp[j]` cũ vào `top`, rồi sau khi xử lý ô hiện tại gán `diagonal = top`. Như vậy ba giá trị cần cho transition kế tiếp đều được bảo toàn.

### Deep answer (EN)

> The in-place row update changes the meaning of the array as we scan: indices before `j` belong to the current row, while indices at or after `j` still belong to the previous row. The extra `diagonal` variable bridges the one value that would otherwise be lost by overwriting.

### Trả lời sâu (VI)

> Khi scan, ý nghĩa của mảng thay đổi theo vị trí: các index trước `j` đã thuộc current row, còn từ `j` trở đi vẫn thuộc previous row. Biến `diagonal` giữ đúng giá trị duy nhất sẽ bị mất do overwrite.

## 6. Complexity questions / Câu hỏi độ phức tạp

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

> O(mn) time and O(n) extra space.

### Trả lời ngắn (VI)

> O(mn) thời gian và O(n) bộ nhớ phụ.

### Standard answer (EN)

> I visit each of the `m * n` cells exactly once and do constant work per cell, so the time complexity is O(mn). The rolling DP array has `n + 1` integers and I use only a few scalar variables, so the extra space complexity is O(n).

### Trả lời chuẩn (VI)

> Tôi duyệt mỗi trong `m * n` ô đúng một lần và mỗi ô chỉ làm O(1) công việc, nên time là O(mn). Rolling DP có `n + 1` phần tử cùng vài biến scalar, nên extra space là O(n).

## 7. Edge-case questions / Câu hỏi trường hợp biên

**Q (EN):** What result do you get for a matrix containing only zeros?

**Q (VI):** Kết quả là gì nếu ma trận chỉ chứa `0`?

### Short answer (EN)

> Every DP state stays zero, so the returned area is zero.

### Trả lời ngắn (VI)

> Mọi trạng thái DP đều bằng `0`, nên diện tích trả về là `0`.

### Standard answer (EN)

> Each zero cell resets its state to zero, so `maxSide` is never increased. The final result is `0 * 0 = 0`, which matches the fact that there is no all-1 square.

### Trả lời chuẩn (VI)

> Mỗi ô `0` reset state về `0`, vì vậy `maxSide` không tăng. Kết quả cuối là `0`, đúng vì không có square toàn `1`.

## 8. Alternative-approach and trade-off questions / Hướng khác và đánh đổi

**Q (EN):** Why not keep a full 2D DP table?

**Q (VI):** Vì sao không giữ toàn bộ bảng DP 2D?

### Short answer (EN)

> A 2D table is correct and simpler to visualize, but it uses O(mn) space while each transition only needs the previous row and current-row left value.

### Trả lời ngắn (VI)

> Bảng 2D đúng và dễ hình dung hơn, nhưng dùng O(mn) bộ nhớ trong khi transition chỉ cần previous row và left của current row.

### Standard answer (EN)

> I would often explain the 2D recurrence first because it makes correctness clear. Then I optimize the implementation to one row after observing that no state depends on rows older than the previous one. This keeps the same O(mn) time while reducing auxiliary space to O(n).

### Trả lời chuẩn (VI)

> Tôi thường giải thích recurrence 2D trước vì dễ chứng minh. Sau đó quan sát rằng không state nào cần hàng cũ hơn previous row, nên nén implementation còn một hàng mà vẫn giữ O(mn) time và giảm space xuống O(n).

## 9. Code walkthrough questions / Câu hỏi walkthrough code

**Q (EN):** Why do you store `top` before writing `dp[j]`?

**Q (VI):** Tại sao phải lưu `top` trước khi ghi đè `dp[j]`?

### Short answer (EN)

> Because the old `dp[j]` is needed as the diagonal value for the next column.

### Trả lời ngắn (VI)

> Vì `dp[j]` cũ sẽ trở thành diagonal cần dùng cho cột kế tiếp.

### Standard answer (EN)

> At column `j`, the old `dp[j]` is the previous-row value directly above the current cell. After I update the current cell, I move one column right, and that old top value becomes the previous-row, previous-column diagonal. If I overwrite it without saving it, the next transition is incorrect.

### Trả lời chuẩn (VI)

> Ở cột `j`, `dp[j]` cũ là ô top thuộc previous row. Khi chuyển sang cột `j + 1`, giá trị đó trở thành diagonal của ô mới. Nếu overwrite mà không lưu thì transition kế tiếp sẽ sai.

## 10. Follow-up variations / Biến thể mở rộng

**Q (EN):** Could you reduce the extra space further when the matrix has many more columns than rows?

**Q (VI):** Có thể giảm bộ nhớ hơn nữa nếu số cột lớn hơn số hàng rất nhiều không?

### Short answer (EN)

> Yes. With a symmetric implementation, I can roll over the smaller dimension and use O(min(m, n)) space.

### Trả lời ngắn (VI)

> Có. Nếu viết implementation đối xứng theo hàng/cột, ta có thể rolling theo chiều nhỏ hơn và dùng O(min(m, n)) space.

### Standard answer (EN)

> The recurrence itself is symmetric in the grid directions, but the current implementation scans rows and stores one value per column, so it uses O(n). If memory were critical and the matrix were very wide, I could transpose the logical iteration or choose the smaller dimension for the DP array, giving O(min(m, n)) auxiliary space.

### Trả lời chuẩn (VI)

> Recurrence có tính đối xứng, nhưng implementation hiện tại scan theo hàng nên lưu một state cho mỗi cột và dùng O(n). Nếu memory quan trọng và ma trận rất rộng, có thể đổi hướng iteration hoặc chọn chiều nhỏ hơn cho DP array để đạt O(min(m, n)).

## 11. Common interviewer traps / Bẫy thường gặp

- Returning the maximum side length instead of its area.
- Taking the maximum neighbor instead of the minimum.
- Forgetting to reset a rolling state on a `0` cell.
- Losing the old top value before it becomes the next diagonal.
- Describing `dp[j - 1]` as previous-row left after it has already been updated.

## 12. Useful phrases and vocabulary / Cụm từ hữu ích

```text
largest square ending at the current cell
bottom-right corner
three neighboring states
the minimum is the bottleneck
rolling DP array
save the overwritten value
time complexity is O(mn)
extra space is O(n)
return the square of the maximum side length
```
