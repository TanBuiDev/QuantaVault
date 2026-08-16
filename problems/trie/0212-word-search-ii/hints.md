# Hints / Gợi ý — 212. Word Search II

## Hint 1

**EN:** Running a full Word Search DFS separately for every word repeats the same prefix work many times.

**VI:** Chạy DFS kiểu Word Search riêng cho từng từ sẽ lặp lại việc tìm cùng các prefix rất nhiều lần.

## Hint 2

**EN:** Store all words in a Trie. During board DFS, stop immediately when the current board path is not a Trie prefix.

**VI:** Lưu toàn bộ từ trong Trie. Khi DFS trên board, dừng ngay nếu đường đi hiện tại không còn là prefix trong Trie.

## Hint 3

**EN:** Store the complete word at terminal Trie nodes. When found, add it once and clear that terminal marker; optionally prune Trie branches that no longer contain any unfound word.

**VI:** Lưu nguyên từ ở node kết thúc của Trie. Khi tìm thấy, thêm một lần rồi xóa marker đó; có thể prune các nhánh Trie không còn chứa từ chưa tìm thấy.
