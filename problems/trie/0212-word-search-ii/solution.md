# Solution / Lời giải — 212. Word Search II

## 1. Core idea / Trực giác

Nếu chạy bài Word Search riêng cho từng từ, rất nhiều DFS sẽ lặp lại cùng các prefix. Ta gom toàn bộ `words` vào một **Trie**, rồi DFS board một lần theo các prefix còn hợp lệ trong Trie.

## 2. Requirement recap / Tóm tắt yêu cầu

- Di chuyển chỉ theo 4 hướng: trên, dưới, trái, phải.
- Một ô không được dùng hai lần trong cùng một path.
- Cần trả tất cả từ trong `words` xuất hiện trên board.
- `words` có thể rất lớn, tới `3 * 10^4`, nên cần tránh tìm từng từ độc lập.

## 3. Key observations / Nhận xét quan trọng

- Trie chia sẻ prefix giữa nhiều từ.
- Nếu path hiện tại không có node tương ứng trong Trie, nhánh DFS đó chắc chắn không thể tạo ra từ hợp lệ.
- Lưu nguyên `word` ở terminal node giúp tránh phải dựng lại chuỗi khi tìm thấy.
- Sau khi tìm một từ, đặt `node.word = null` để không thêm trùng.

## 4. Naive approach / Cách ngây thơ

Với mỗi từ, chạy DFS Word Search trên toàn board. Điều này có thể lặp lại cùng prefix hàng nghìn lần và rất tốn kém khi `words.length` lớn.

## 5. Optimal approach / Cách tối ưu

1. Build Trie từ toàn bộ `words`.
2. Bắt đầu DFS từ mỗi ô.
3. Chỉ tiếp tục nếu ký tự hiện tại tồn tại trong nhánh Trie tương ứng.
4. Mark ô bằng `#` trong lúc đang dùng để ngăn reuse.
5. Khi gặp terminal node, add từ vào result và clear terminal marker.
6. Sau khi backtrack, nếu một Trie node không còn word và không còn child, prune nó khỏi parent.

## 6. Java solution overview

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    private static class TrieNode {
        private final TrieNode[] children = new TrieNode[26];
        private String word;
    }

    public List<String> findWords(char[][] board, String[] words) {
        TrieNode root = buildTrie(words);
        List<String> result = new ArrayList<>();

        for (int row = 0; row < board.length; row++) {
            for (int col = 0; col < board[0].length; col++) {
                dfs(board, row, col, root, result);
            }
        }

        return result;
    }

    private TrieNode buildTrie(String[] words) {
        TrieNode root = new TrieNode();

        for (String word : words) {
            TrieNode node = root;
            for (int i = 0; i < word.length(); i++) {
                int index = word.charAt(i) - 'a';
                if (node.children[index] == null) {
                    node.children[index] = new TrieNode();
                }
                node = node.children[index];
            }
            node.word = word;
        }

        return root;
    }

    private void dfs(char[][] board, int row, int col, TrieNode parent, List<String> result) {
        if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
            return;
        }

        char letter = board[row][col];
        if (letter == '#') {
            return;
        }

        int index = letter - 'a';
        TrieNode node = parent.children[index];
        if (node == null) {
            return;
        }

        if (node.word != null) {
            result.add(node.word);
            node.word = null;
        }

        board[row][col] = '#';
        dfs(board, row - 1, col, node, result);
        dfs(board, row + 1, col, node, result);
        dfs(board, row, col - 1, node, result);
        dfs(board, row, col + 1, node, result);
        board[row][col] = letter;

        if (node.word == null && hasNoChildren(node)) {
            parent.children[index] = null;
        }
    }

    private boolean hasNoChildren(TrieNode node) {
        for (TrieNode child : node.children) {
            if (child != null) {
                return false;
            }
        }
        return true;
    }
}
```

## 7. Code explanation / Giải thích code

`buildTrie` chia sẻ prefix giữa các từ. `dfs` vừa đi trên board vừa đi xuống Trie. Board cell được tạm thay bằng `#` để đánh dấu visited rồi phục hồi khi quay lui. Việc prune node rỗng giảm các lần DFS vô ích về sau.

## 8. Dry run

Với board ví dụ và Trie chứa `oath`, `pea`, `eat`, `rain`:

- Bắt đầu tại `o`, Trie có prefix `o` → DFS tiếp tục `o -> a -> t -> h` và tìm thấy `oath`.
- Terminal `oath` được clear để không add lại.
- Bắt đầu tại `e`, nhánh `e -> a -> t` tìm thấy `eat`.
- Những path như `p...` hoặc `r...` nhanh chóng dừng khi board không thể tiếp tục đúng Trie prefix.

## 9. Complexity / Độ phức tạp

Gọi `W` là tổng số ký tự trong `words`, `L` là độ dài từ lớn nhất:

- Build Trie: `O(W)`.
- Worst-case board search: `O(m * n * 4^L)`; thực tế Trie pruning giảm mạnh nhiều nhánh.
- Space: `O(W)` cho Trie + `O(L)` recursion, không tính output.

## 10. Why it is correct / Vì sao đúng

DFS duyệt mọi path hợp lệ trên board nhưng chỉ giữ các path đồng thời là prefix của ít nhất một từ trong Trie. Vì mọi từ cần tìm đều nằm trong Trie, bất kỳ board path tạo thành một từ sẽ đi tới đúng terminal node và được thêm vào kết quả. Mark visited đảm bảo một ô không bị reuse trong cùng path.

## 11. Edge cases / Trường hợp biên

- Board `1 x 1`.
- Nhiều từ chia sẻ prefix, ví dụ `a`, `ab`, `abc`.
- Một từ có thể xuất hiện theo nhiều path nhưng chỉ được trả một lần.
- Không từ nào tồn tại trên board.

## 12. Common mistakes / Lỗi thường gặp

- Chạy Word Search riêng cho từng từ.
- Quên phục hồi board cell sau DFS.
- Không clear terminal marker nên trả duplicate.
- Prune node quá sớm khi nó vẫn còn child hoặc vẫn chứa một word chưa được thu thập.

## 13. Pattern recognition / Khi nào dùng lại

Kết hợp **Trie + DFS/Backtracking** rất hữu ích khi cần tìm nhiều pattern chuỗi cùng lúc trong một không gian trạng thái và các pattern chia sẻ prefix.

## 14. Vocabulary / Từ vựng

- **prefix pruning**: cắt nhánh theo tiền tố
- **terminal node**: node kết thúc một từ
- **shared prefix**: tiền tố dùng chung
- **visited cell**: ô đã dùng trong path hiện tại
- **prune exhausted branch**: loại nhánh không còn từ chưa tìm thấy
