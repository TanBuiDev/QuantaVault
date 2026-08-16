# 79. Word Search — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I run DFS/backtracking from every cell. When a cell matches the current character, I mark it used in-place, explore four neighbors for the next character, then restore the cell. This checks every legal path without reusing a cell.

**VI:** Tôi chạy DFS/backtracking từ mọi ô. Khi ô khớp ký tự hiện tại, tôi đánh dấu đã dùng ngay trên bảng, thử bốn ô lân cận cho ký tự tiếp theo, rồi khôi phục ô. Cách này xét mọi đường đi hợp lệ mà không dùng lại ô.

## 2. Core approach questions
**Q (EN):** What is the recursive state?

**Q (VI):** Trạng thái đệ quy là gì?

### Short answer (EN)
`(row, col, index)`, where `index` is the position in `word` that must match the current cell.

### Trả lời ngắn (VI)
`(row, col, index)`, trong đó `index` là vị trí trong `word` cần khớp tại ô hiện tại.

### Standard answer (EN)
The DFS state identifies the current board cell and the next character to match. From a matching state, recurse to the four orthogonal neighbors with `index + 1`.

### Trả lời chuẩn (VI)
Trạng thái DFS xác định ô hiện tại và ký tự tiếp theo cần khớp. Nếu khớp, ta đệ quy sang bốn ô kề với `index + 1`.

## 3. Correctness questions
**Q (EN):** Why does backtracking find every valid word path?

**Q (VI):** Vì sao backtracking tìm được mọi đường đi hợp lệ?

### Short answer (EN)
Every valid path starts at some cell and repeatedly chooses one of four legal neighbors, and the DFS enumerates exactly those choices.

### Trả lời ngắn (VI)
Mọi đường đi hợp lệ bắt đầu ở một ô và liên tục chọn một trong bốn ô kề hợp lệ; DFS xét đầy đủ các lựa chọn đó.

### Standard answer (EN)
The outer loops try every possible start. At each matched prefix, DFS explores every unused orthogonal neighbor. Marking prevents illegal reuse, and restoring preserves all choices for other branches.

### Trả lời chuẩn (VI)
Hai vòng lặp thử mọi điểm bắt đầu. Với mỗi prefix đã khớp, DFS thử mọi ô kề chưa dùng. Đánh dấu ngăn dùng lại ô trái luật, còn khôi phục giúp các nhánh khác vẫn xét được ô đó.

## 4. Complexity questions
**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là gì?

### Short answer (EN)
Usually `O(m*n*3^L)` time and `O(L)` recursion space, where `L = word.length`.

### Trả lời ngắn (VI)
Thường là `O(m*n*3^L)` thời gian và `O(L)` stack đệ quy, với `L = word.length`.

### Standard answer (EN)
There are `m*n` starting cells. After the first move, the path normally has at most three forward choices because the previous cell is marked used. A looser bound `O(m*n*4^L)` is also acceptable.

### Trả lời chuẩn (VI)
Có `m*n` điểm bắt đầu. Sau bước đầu, mỗi bước thường tối đa ba hướng vì ô vừa đi qua đã bị đánh dấu. Cận lỏng `O(m*n*4^L)` cũng chấp nhận được.

## 5. Edge-case questions
**Q (EN):** Why must the board cell be restored before returning?

**Q (VI):** Vì sao phải khôi phục ô trước khi trả về?

### Short answer (EN)
Because the same cell may be needed by another candidate path.

### Trả lời ngắn (VI)
Vì ô đó có thể cần được dùng trong một đường đi ứng viên khác.

### Standard answer (EN)
The temporary mark belongs only to the current recursion path. Restoring maintains the backtracking invariant and leaves the input unchanged for subsequent starts.

### Trả lời chuẩn (VI)
Dấu tạm chỉ thuộc đường đệ quy hiện tại. Khôi phục giữ invariant của backtracking và đảm bảo input không bị thay đổi cho các điểm bắt đầu sau.

## 6. Follow-up questions
**Q (EN):** How can you prune more aggressively on a larger board?

**Q (VI):** Có thể cắt tỉa mạnh hơn thế nào khi bảng lớn?

### Short answer (EN)
Check character frequencies first and consider searching from the rarer end of the word.

### Trả lời ngắn (VI)
Kiểm tra tần suất ký tự trước và cân nhắc tìm từ đầu hiếm hơn của từ.

### Standard answer (EN)
If the board lacks enough copies of any required character, fail immediately. Also, if the last character is rarer than the first, reverse the word so fewer starting cells launch DFS.

### Trả lời chuẩn (VI)
Nếu bảng không đủ số lượng của bất kỳ ký tự cần thiết nào thì dừng ngay. Ngoài ra, nếu ký tự cuối hiếm hơn ký tự đầu, có thể đảo từ để giảm số điểm bắt đầu DFS.
