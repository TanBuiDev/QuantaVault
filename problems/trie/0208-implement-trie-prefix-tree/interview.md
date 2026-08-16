# Interview Preparation / Chuẩn bị phỏng vấn — 208. Implement Trie (Prefix Tree)

## 1. 30-second solution pitch

**Q (EN):** How would you implement the Trie?

**Q (VI):** Bạn sẽ cài đặt Trie như thế nào?

### Short answer (EN)

Each node has 26 child references and a boolean that marks the end of a complete word.

### Trả lời ngắn (VI)

Mỗi node có 26 child và một boolean đánh dấu kết thúc word hoàn chỉnh.

### Standard answer (EN)

I map each lowercase letter to an index from 0 to 25. Insert creates missing nodes along the word. Search follows the path and also checks the end-of-word flag, while startsWith only checks whether the path exists.

### Trả lời chuẩn (VI)

Tôi ánh xạ chữ thường về index 0–25. Insert tạo node còn thiếu. Search đi theo path và kiểm tra cờ end-of-word, còn startsWith chỉ cần path tồn tại.

## 2. Core approach questions

**Q (EN):** Why do you need an end-of-word flag?

**Q (VI):** Tại sao cần cờ end-of-word?

Short answer (EN): A valid prefix is not always a complete inserted word.

Trả lời ngắn (VI): Prefix hợp lệ không phải lúc nào cũng là word đã insert hoàn chỉnh.

Standard answer (EN): After inserting `apple`, the path for `app` exists. Without a flag, search could not distinguish `app` from the complete word `apple`.

Trả lời chuẩn (VI): Sau khi insert `apple`, path của `app` đã tồn tại. Không có cờ thì search không phân biệt được prefix `app` với word hoàn chỉnh.

## 3. Why / correctness questions

**Q (EN):** Why does following the character path correctly answer startsWith?

**Q (VI):** Vì sao chỉ cần đi theo character path là đủ cho startsWith?

Short answer (EN): Every created path comes from an inserted word.

Trả lời ngắn (VI): Mọi path được tạo đều xuất phát từ một word đã insert.

Standard answer (EN): Insert creates a path for every prefix of the word. Therefore, if all prefix characters can be followed from the root, at least one inserted word has that prefix.

Trả lời chuẩn (VI): Insert tạo path cho mọi prefix của word. Vì vậy nếu đi được hết các character của prefix từ root thì có ít nhất một word đã insert mang prefix đó.

## 4. Complexity questions

**Q (EN):** What is the complexity of each operation?

**Q (VI):** Độ phức tạp của mỗi operation là gì?

Short answer (EN): `O(L)` time for insert, search, and startsWith.

Trả lời ngắn (VI): `O(L)` cho insert, search và startsWith.

Standard answer (EN): We process each input character once. The total memory is proportional to the number of trie nodes created, which is at most the total number of inserted characters plus the root.

Trả lời chuẩn (VI): Mỗi character được xử lý một lần. Bộ nhớ tỷ lệ với số trie node được tạo, tối đa xấp xỉ tổng số character đã insert cộng root.

## 5. Edge-case questions

**Q (EN):** What happens if one word is a prefix of another?

**Q (VI):** Nếu một word là prefix của word khác thì sao?

Short answer (EN): Both share nodes, and each complete word has its own end flag.

Trả lời ngắn (VI): Hai word dùng chung node và mỗi endpoint hoàn chỉnh có cờ riêng.

Standard answer (EN): For example, after inserting `app` and `apple`, the node for the second `p` is marked as a word and still has a child path toward `apple`.

Trả lời chuẩn (VI): Ví dụ insert `app` và `apple`, node ở chữ `p` thứ hai vừa có `isWord = true` vừa tiếp tục có child dẫn đến `apple`.

## 6. Alternative approach and trade-off

**Q (EN):** Array children or HashMap children?

**Q (VI):** Nên dùng child array hay HashMap?

Short answer (EN): For fixed lowercase English letters, an array is simpler and fast.

Trả lời ngắn (VI): Với alphabet cố định a-z, array đơn giản và nhanh.

Standard answer (EN): An array gives constant direct indexing but reserves 26 references per node. A HashMap can save memory in sparse tries and supports larger alphabets, at the cost of hashing overhead.

Trả lời chuẩn (VI): Array cho direct index nhưng giữ 26 reference mỗi node. HashMap có thể tiết kiệm bộ nhớ khi sparse và hỗ trợ alphabet lớn hơn, đổi lại có hashing overhead.

## 7. Code walkthrough

**Q (EN):** What is the purpose of `findNode`?

**Q (VI):** `findNode` dùng để làm gì?

Short answer (EN): It centralizes traversal logic for search and startsWith.

Trả lời ngắn (VI): Nó gom logic traversal dùng chung cho search và startsWith.

Standard answer (EN): The helper returns the node reached after all characters, or null if any edge is missing. Search then checks the end flag; startsWith only checks non-null.

Trả lời chuẩn (VI): Helper trả node sau khi đi hết chuỗi hoặc null nếu thiếu edge. Search kiểm tra thêm end flag; startsWith chỉ kiểm tra khác null.

## 8. Follow-up variations

Likely follow-up: delete a word, count words with a prefix, support Unicode, or return autocomplete suggestions.

## 9. Common interviewer traps

Do not claim that an existing prefix path means the prefix was inserted as a complete word. Explain the role of the endpoint flag clearly.

## 10. Useful phrases and vocabulary

- “I use direct indexing because the alphabet is fixed.”
- “The end-of-word flag separates exact search from prefix search.”
- `prefix tree`, `child node`, `end marker`, `shared prefix`, `traversal`
