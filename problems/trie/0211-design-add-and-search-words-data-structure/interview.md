# Interview Preparation / Chuẩn bị phỏng vấn — 211. Design Add and Search Words Data Structure

## 1. 30-second solution pitch

**Q (EN):** How would you design this data structure?

**Q (VI):** Bạn sẽ thiết kế data structure này như thế nào?

### Short answer (EN)

I store words in a trie. Adding is normal trie insertion, and search uses DFS so a dot can branch to any child.

### Trả lời ngắn (VI)

Tôi lưu word trong trie. Add là trie insertion bình thường, còn search dùng DFS để dấu chấm có thể branch sang bất kỳ child.

### Standard answer (EN)

Each trie node has 26 children and an end-of-word flag. For a normal search character I follow one child. For `.`, I recursively try every existing child. The match is valid only if the full pattern is consumed at an end-of-word node.

### Trả lời chuẩn (VI)

Mỗi trie node có 26 child và cờ end-of-word. Với chữ thường tôi đi theo một child; với `.` tôi recursively thử mọi child tồn tại. Match chỉ hợp lệ khi dùng hết pattern tại node kết thúc word.

## 2. Core approach questions

**Q (EN):** Why is a trie useful here?

**Q (VI):** Tại sao trie hữu ích?

Short answer (EN): It shares prefixes and lets search reject impossible branches early.

Trả lời ngắn (VI): Trie chia sẻ prefix và loại branch không thể match từ sớm.

Standard answer (EN): Instead of comparing the pattern with every stored word, the trie follows only prefixes that can still match. Wildcards branch only where child nodes actually exist.

Trả lời chuẩn (VI): Thay vì so pattern với mọi word, trie chỉ đi theo prefix còn khả năng match. Wildcard cũng chỉ branch ở child thực sự tồn tại.

## 3. Why / correctness questions

**Q (EN):** Why does DFS handle the dot correctly?

**Q (VI):** Vì sao DFS xử lý dấu chấm đúng?

Short answer (EN): A dot can match exactly one arbitrary letter, so trying every child enumerates every valid choice.

Trả lời ngắn (VI): Dấu chấm match đúng một chữ bất kỳ, nên thử mọi child chính là xét mọi lựa chọn hợp lệ.

Standard answer (EN): At each dot position, every existing outgoing trie edge is a legal character match. DFS explores all of them and returns true if any suffix can complete at a word endpoint.

Trả lời chuẩn (VI): Tại vị trí `.`, mọi outgoing edge đều là lựa chọn character hợp lệ. DFS duyệt toàn bộ và trả true nếu có suffix nào kết thúc tại endpoint.

## 4. Complexity questions

**Q (EN):** What is the worst-case search complexity?

**Q (VI):** Worst-case complexity của search là gì?

Short answer (EN): Without dots it is `O(L)`; with `D` dots, branching can approach `O(26^D * L)`.

Trả lời ngắn (VI): Không có dot là `O(L)`; với `D` dot, branching có thể gần `O(26^D * L)`.

Standard answer (EN): Each wildcard may branch over up to 26 children. The problem limits search queries to at most two dots, which keeps that branching bounded in practice.

Trả lời chuẩn (VI): Mỗi wildcard có thể branch tối đa 26 child. Đề giới hạn tối đa hai dấu chấm nên branching được kiểm soát trong thực tế.

## 5. Edge-case questions

**Q (EN):** Why must you check the end-of-word flag after consuming the query?

**Q (VI):** Tại sao phải kiểm tra end-of-word khi dùng hết query?

Short answer (EN): A path may exist only as a prefix of a longer stored word.

Trả lời ngắn (VI): Path có thể chỉ là prefix của word dài hơn.

Standard answer (EN): Search is an exact-length match. Reaching a trie node after the final query character is not enough unless that node represents a complete added word.

Trả lời chuẩn (VI): Search là exact-length match. Đi hết query đến một node chưa đủ; node đó phải đại diện cho word hoàn chỉnh đã add.

## 6. Alternative approach and trade-off

**Q (EN):** Why not store words in a HashSet?

**Q (VI):** Tại sao không chỉ dùng HashSet?

Short answer (EN): A HashSet handles exact search well but does not support wildcard matching efficiently.

Trả lời ngắn (VI): HashSet tốt cho exact search nhưng không hỗ trợ wildcard hiệu quả.

Standard answer (EN): For a wildcard query, a plain set would require generating many concrete strings or scanning stored words. The trie exposes only existing branches and shares prefixes.

Trả lời chuẩn (VI): Với wildcard, set thường phải sinh nhiều string cụ thể hoặc scan word. Trie chỉ mở các branch tồn tại và chia sẻ prefix.

## 7. Code walkthrough

**Q (EN):** What is the base case of the recursive search?

**Q (VI):** Base case của recursive search là gì?

Short answer (EN): When the index reaches the pattern length, return `node.isWord`.

Trả lời ngắn (VI): Khi index bằng pattern length, trả `node.isWord`.

Standard answer (EN): That base case means every pattern character has matched one trie edge. The endpoint flag then verifies that the path is a complete stored word, not merely a prefix.

Trả lời chuẩn (VI): Base case đó nghĩa là mọi pattern character đã match một trie edge. Endpoint flag xác nhận path là word hoàn chỉnh chứ không chỉ prefix.

## 8. Follow-up variations

Likely follow-up: support `*` matching zero or more characters, delete words, return all matching words, or optimize memory for a larger alphabet.

## 9. Common interviewer traps

Be explicit that `.` matches exactly one character. Also explain the difference between reaching a trie path and reaching a complete word endpoint.

## 10. Useful phrases and vocabulary

- “A wildcard creates a branching point in the trie.”
- “I only explore children that actually exist.”
- “The endpoint flag enforces an exact complete-word match.”
- `wildcard`, `recursive DFS`, `branch`, `endpoint`, `prefix`
