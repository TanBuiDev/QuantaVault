# Hints / Gợi ý — 211. Design Add and Search Words Data Structure

## Hint 1

**EN:** Store added words in a trie so common prefixes share nodes.

**VI:** Lưu các word trong trie để các prefix chung dùng chung node.

## Hint 2

**EN:** Searching a normal letter follows exactly one child, but `'.'` means you may need to try every existing child.

**VI:** Khi search chữ thường chỉ đi theo một child; còn `'.'` buộc bạn có thể phải thử mọi child hiện có.

## Hint 3

**EN:** Use DFS over the trie for search. The search succeeds only when all query characters are consumed and the current node marks the end of a complete word.

**VI:** Dùng DFS trên trie. Search chỉ thành công khi đã dùng hết query và node hiện tại đánh dấu kết thúc một word hoàn chỉnh.
