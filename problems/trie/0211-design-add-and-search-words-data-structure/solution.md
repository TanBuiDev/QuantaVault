# Solution / Lời giải — 211. Design Add and Search Words Data Structure

## 1. Core idea / Trực giác

Dùng **Trie** để lưu word. `addWord` giống insert trie thông thường. Điểm đặc biệt nằm ở `search`: ký tự thường đi theo đúng một branch, còn wildcard `'.'` có thể đi theo bất kỳ child nào, nên cần DFS/backtracking.

## 2. Requirement recap / Tóm tắt yêu cầu

`search` phải match **toàn bộ word**, không phải prefix. Dấu `.` đại diện cho đúng một ký tự bất kỳ.

## 3. Key observations / Nhận xét quan trọng

- Trie chia sẻ prefix giữa nhiều word.
- Với character thường, chỉ có tối đa một branch cần đi tiếp.
- Với `.`, cần thử mọi child không-null.
- Khi index bằng query length, chỉ trả true nếu node hiện tại có `isWord = true`.

## 4. Alternative approaches / Hướng khác

Có thể lưu tất cả word theo độ dài rồi scan từng candidate khi search. Cách này đơn giản nhưng mỗi query có thể phải so với rất nhiều word. Trie loại bỏ nhanh các prefix không thể match.

## 5. Optimal approach / Cách tiếp cận tối ưu

### addWord
Đi qua từng character, tạo child nếu thiếu và đánh dấu endpoint bằng `isWord`.

### search
Gọi DFS `(word, index, node)`:

1. Nếu `index == word.length()`, trả `node.isWord`.
2. Nếu character hiện tại khác `.`, đi đúng child tương ứng; child null → false.
3. Nếu là `.`, thử DFS trên từng child tồn tại; chỉ cần một branch true là trả true.

## 6. Java solution overview

`WordDictionary` chứa root `Node`. `Node` dùng `Node[26]` và `boolean isWord`. Recursive DFS có depth tối đa bằng word length, tối đa 25 theo constraint.

## 7. Code explanation

Wildcard branch duyệt `node.children`. Không cần clone state vì DFS chỉ đọc trie. Exact character branch sử dụng `ch - 'a'`.

## 8. Dry run

Sau khi add `"bad"`, `"dad"`, `"mad"`:

Search `".ad"`:

- index 0 là `.`, thử các child root.
- Branch `b`, `d`, `m` đều có thể được thử.
- Với branch `b`, tiếp tục `a` rồi `d`.
- Kết thúc query tại endpoint của `"bad"` với `isWord = true` → trả true.

## 9. Time and space complexity

Gọi `L` là word length và `D` là số wildcard dots.

- `addWord`: `O(L)`.
- `search` không wildcard: `O(L)`.
- `search` worst case: khoảng `O(26^D * L)` do wildcard branching; constraint giới hạn `D <= 2`.
- Space: `O(total inserted characters)` cho trie, cộng recursion stack `O(L)` mỗi search.

## 10. Why the algorithm is correct / Vì sao đúng

DFS xét đúng tập transition được phép bởi query. Với chữ thường, chỉ transition có cùng character là hợp lệ. Với `.`, mọi child đều hợp lệ nên DFS thử toàn bộ. Khi đã dùng hết query, `isWord` đảm bảo path tương ứng với một word đã add hoàn chỉnh. Vì vậy search trả true khi và chỉ khi tồn tại word match query.

## 11. Edge cases

- Query exact word.
- Wildcard ở đầu, giữa hoặc cuối.
- Query chỉ là prefix của word dài hơn.
- Nhiều word có cùng suffix nhưng prefix khác nhau.
- Query có độ dài khác tất cả word đã add.

## 12. Common mistakes / Lỗi thường gặp

- Khi gặp `.`, chỉ thử một child.
- Kết thúc query mà không kiểm tra `isWord`.
- Nhầm `.` với chuỗi có độ dài bất kỳ; thực tế nó match đúng một character.
- Dùng global mutable state cho DFS và quên reset.

## 13. Pattern recognition / Khi nào tái sử dụng

Kết hợp Trie + DFS khi search pattern có wildcard trên dictionary, autocomplete có pattern, hoặc cần branch theo nhiều character tại một vị trí.

## 14. Vocabulary

- **wildcard**: ký tự đại diện
- **branching**: phân nhánh
- **backtracking / DFS**: duyệt thử các branch
- **exact match**: khớp toàn bộ
- **endpoint**: node kết thúc word
