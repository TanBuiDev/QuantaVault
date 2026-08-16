# Solution / Lời giải — 208. Implement Trie (Prefix Tree)

## 1. Core idea / Trực giác

Trie lưu các word theo từng ký tự. Mỗi edge tương ứng với một chữ cái và các word có chung prefix sẽ dùng chung đoạn đầu của cây.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần hỗ trợ ba operation chính: insert một word, kiểm tra exact word, và kiểm tra prefix. `search` phải phân biệt giữa "đường đi tồn tại" và "có word kết thúc tại node đó".

## 3. Key observations / Nhận xét quan trọng

- Input chỉ dùng `a-z`, nên mỗi node có thể dùng `Node[26]`.
- `index = ch - 'a'`.
- `isWord` đánh dấu node kết thúc của một word hoàn chỉnh.
- `startsWith` chỉ cần toàn bộ prefix path tồn tại, không quan tâm `isWord`.

## 4. Alternative approaches / Hướng khác

Có thể dùng `HashMap<Character, Node>` để tiết kiệm child slot khi trie rất sparse hoặc alphabet lớn. Với alphabet cố định 26 chữ, array đơn giản và truy cập nhanh hơn.

## 5. Optimal approach / Cách tiếp cận tối ưu

- `insert`: đi qua từng character; thiếu child thì tạo node mới; cuối cùng đặt `isWord = true`.
- `search`: tìm node của toàn bộ word rồi trả `node != null && node.isWord`.
- `startsWith`: tìm node của prefix rồi chỉ cần `node != null`.

## 6. Java solution overview

Class LeetCode-compatible là `Trie`. `Node` được khai báo `static` bên trong và chứa `Node[] children = new Node[26]` cùng boolean `isWord`.

## 7. Code explanation

Helper `findNode` gom logic traversal dùng chung cho `search` và `startsWith`, tránh lặp code. `insert` tạo node lazily khi cần.

## 8. Dry run

Insert `"apple"`:

`root -> a -> p -> p -> l -> e`, sau đó node `e` có `isWord = true`.

- `search("apple")` → đến node `e`, `isWord = true`.
- `search("app")` → đến node `p`, nhưng `isWord = false`.
- `startsWith("app")` → path tồn tại nên true.

## 9. Time and space complexity

Gọi `L` là độ dài input operation.

- `insert`: `O(L)`
- `search`: `O(L)`
- `startsWith`: `O(L)`
- Space tổng: `O(total inserted characters)` trong worst case khi các word không chia sẻ prefix.

## 10. Why the algorithm is correct / Vì sao đúng

Mỗi path từ root tương ứng chính xác với một prefix. `insert` tạo đầy đủ path của word và đánh dấu endpoint. Vì vậy `findNode(x)` tồn tại khi và chỉ khi `x` là prefix của ít nhất một word đã insert; thêm điều kiện `isWord` giúp `search` đúng với exact word.

## 11. Edge cases

- Một word là prefix của word khác.
- Insert cùng word nhiều lần.
- Nhiều word chia sẻ prefix dài.
- Search một prefix chưa từng được insert thành word.

## 12. Common mistakes / Lỗi thường gặp

- Không có `isWord`, khiến prefix bị nhầm thành exact word.
- Tạo child array sai index.
- `startsWith` kiểm tra `isWord` dù không cần.
- Tạo toàn bộ 26 node con trước thay vì lazy allocation.

## 13. Pattern recognition / Khi nào tái sử dụng

Trie phù hợp với prefix lookup, autocomplete, dictionary search, routing theo chuỗi và các bài cần chia sẻ prefix giữa nhiều string.

## 14. Vocabulary

- **trie / prefix tree**: cây tiền tố
- **child reference**: tham chiếu node con
- **prefix lookup**: truy vấn tiền tố
- **endpoint marker**: cờ đánh dấu kết thúc word
- **shared prefix**: tiền tố dùng chung
