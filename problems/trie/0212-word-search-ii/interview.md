# Interview Preparation / Chuẩn bị phỏng vấn — 212. Word Search II

## 1. 30-second solution pitch

**Q (EN):** Can you summarize your solution?

**Q (VI):** Bạn có thể tóm tắt lời giải không?

### Short answer (EN)
I build a Trie from all words and run DFS from every board cell, following only Trie prefixes.

### Trả lời ngắn (VI)
Tôi build Trie từ toàn bộ từ rồi DFS từ mỗi ô, chỉ đi theo các prefix còn tồn tại trong Trie.

### Standard answer (EN)
A separate DFS for every word repeats prefix work, so I store all words in one Trie. During board DFS, each character moves to the matching Trie child; if that child is missing, I stop the branch immediately. When I reach a Trie terminal word, I add it once and clear the marker. I also prune exhausted Trie branches.

### Trả lời chuẩn (VI)
Chạy DFS riêng cho từng từ sẽ lặp prefix, nên tôi lưu tất cả từ trong một Trie. Khi DFS board, mỗi ký tự đi sang child tương ứng; nếu không có child thì dừng nhánh ngay. Khi gặp terminal word, tôi thêm một lần và clear marker. Tôi cũng prune các nhánh Trie đã hết tác dụng.

## 2. Core approach questions

**Q (EN):** Why do you need a Trie instead of a HashSet of words?

**Q (VI):** Vì sao cần Trie thay vì chỉ dùng HashSet chứa các từ?

### Short answer (EN)
A Trie tells me whether the current board path is still a valid prefix, so I can prune early.

### Trả lời ngắn (VI)
Trie cho biết path hiện tại còn là prefix hợp lệ hay không để cắt nhánh sớm.

### Standard answer (EN)
A HashSet can tell me whether a complete string is a word, but it does not efficiently tell me whether any target word starts with the current path. Trie nodes represent prefixes directly, which is exactly the pruning information DFS needs.

### Trả lời chuẩn (VI)
HashSet chỉ cho biết chuỗi hoàn chỉnh có phải target hay không, nhưng không hiệu quả để kiểm tra có target nào bắt đầu bằng path hiện tại. Trie biểu diễn prefix trực tiếp nên phù hợp để prune DFS.

## 3. Why / correctness questions

**Q (EN):** Why does Trie pruning not miss a valid word?

**Q (VI):** Vì sao prune theo Trie không làm bỏ sót từ hợp lệ?

### Short answer (EN)
If the current path is not a Trie prefix, no target word can extend that path.

### Trả lời ngắn (VI)
Nếu path hiện tại không phải Trie prefix thì không target nào có thể mở rộng từ path đó.

### Standard answer (EN)
Every target word is inserted into the Trie. Therefore every prefix of a target word also exists as a Trie path. If a board path has no matching Trie child, it cannot be a prefix of any target, so stopping that branch is safe.

### Trả lời chuẩn (VI)
Mọi target đều được insert vào Trie nên mọi prefix của target cũng tồn tại trong Trie. Nếu board path không có Trie child tương ứng thì nó không thể là prefix của target nào, nên dừng nhánh là an toàn.

## 4. Complexity questions

**Q (EN):** What is the worst-case complexity?

**Q (VI):** Độ phức tạp tệ nhất là gì?

### Short answer (EN)
Building the Trie is `O(W)`, and the board search is bounded by about `O(m*n*4^L)` in the worst case.

### Trả lời ngắn (VI)
Build Trie là `O(W)`, còn tìm kiếm trên board tệ nhất khoảng `O(m*n*4^L)`.

### Standard answer (EN)
`W` is the total number of characters in all words and `L` is the maximum word length. The theoretical DFS bound is exponential in `L`, but Trie prefix pruning and branch removal make the practical search much smaller.

### Trả lời chuẩn (VI)
`W` là tổng số ký tự của mọi từ và `L` là độ dài từ lớn nhất. Giới hạn lý thuyết của DFS tăng theo cấp số mũ của `L`, nhưng Trie pruning và xóa nhánh đã cạn giúp giảm rất nhiều trong thực tế.

## 5. Edge-case questions

**Q (EN):** How do you avoid returning the same word twice?

**Q (VI):** Làm sao tránh trả cùng một từ hai lần?

### Short answer (EN)
After adding a terminal word, I set the Trie node's `word` field to null.

### Trả lời ngắn (VI)
Sau khi thêm terminal word, tôi đặt `word` của Trie node thành `null`.

### Standard answer (EN)
The same word can appear through multiple board paths. Clearing the terminal marker after the first discovery preserves prefix children for longer words but prevents later paths from adding the same word again.

### Trả lời chuẩn (VI)
Cùng một từ có thể xuất hiện theo nhiều board path. Clear terminal marker sau lần đầu vẫn giữ child cho các từ dài hơn nhưng ngăn các path sau add trùng.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not run Word Search once per word?

**Q (VI):** Vì sao không chạy Word Search riêng cho từng từ?

### Short answer (EN)
Because with up to 30,000 words it repeats the same board-prefix search too many times.

### Trả lời ngắn (VI)
Vì có tới 30.000 từ nên cách đó lặp cùng việc tìm prefix trên board quá nhiều lần.

### Standard answer (EN)
Per-word DFS is simple but scales poorly with a large dictionary. Trie search shares prefix work across all words, which is the key optimization for this problem.

### Trả lời chuẩn (VI)
DFS từng từ đơn giản nhưng scale kém khi dictionary lớn. Trie cho phép chia sẻ việc tìm prefix giữa nhiều từ, đây là tối ưu quan trọng nhất của bài.

## 7. Code walkthrough questions

**Q (EN):** Why do you temporarily replace a board cell with `#`?

**Q (VI):** Vì sao tạm thay board cell bằng `#`?

### Short answer (EN)
It marks the cell as used in the current DFS path.

### Trả lời ngắn (VI)
Nó đánh dấu ô đã được dùng trong DFS path hiện tại.

### Standard answer (EN)
A word cannot reuse the same board cell. I mark the current cell before exploring neighbors and restore its original character afterward, so sibling paths can use it again.

### Trả lời chuẩn (VI)
Một từ không được dùng lại cùng ô. Tôi mark ô trước khi đi neighbor và phục hồi ký tự sau đó để các nhánh anh em vẫn có thể dùng ô này.

## 8. Follow-up variations

**Q (EN):** What if the alphabet were much larger than 26 letters?

**Q (VI):** Nếu alphabet lớn hơn nhiều so với 26 chữ cái thì sao?

### Short answer (EN)
I would replace the fixed child array with a map.

### Trả lời ngắn (VI)
Tôi sẽ thay mảng child cố định bằng map.

### Standard answer (EN)
For lowercase English letters, an array of size 26 is fast and simple. With a sparse or large alphabet, a HashMap per Trie node would avoid allocating many unused child slots.

### Trả lời chuẩn (VI)
Với chữ thường tiếng Anh, mảng 26 phần tử nhanh và đơn giản. Với alphabet lớn hoặc sparse, HashMap ở mỗi Trie node sẽ tránh cấp phát nhiều child không dùng.

## 9. Common interviewer traps

**Q (EN):** Can you prune a Trie node immediately after finding a word?

**Q (VI):** Có thể prune Trie node ngay khi tìm thấy một từ không?

### Short answer (EN)
Not always. The node may still have children for longer words sharing that prefix.

### Trả lời ngắn (VI)
Không phải lúc nào cũng được. Node có thể vẫn có child cho các từ dài hơn dùng chung prefix.

### Standard answer (EN)
I only remove a node from its parent when its terminal word is already cleared and it has no remaining children. Otherwise pruning could delete a longer target word.

### Trả lời chuẩn (VI)
Tôi chỉ xóa node khỏi parent khi terminal word đã clear và node không còn child. Nếu không, prune có thể xóa mất target dài hơn.

## 10. Useful phrases and vocabulary

- **prefix pruning** — cắt nhánh theo prefix
- **terminal word** — từ được lưu ở node kết thúc
- **shared prefix** — prefix dùng chung
- **mark and restore** — đánh dấu rồi phục hồi
- **exhausted Trie branch** — nhánh Trie không còn từ cần tìm
