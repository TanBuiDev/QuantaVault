# Solution / Lời giải — 212. Word Search II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Word Search II nếu chạy Word Search riêng cho từng word sẽ lặp lại cùng grid prefixes rất nhiều. Trie gộp words theo prefix để một DFS board có thể đồng thời theo dõi tất cả words còn khả năng match.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Bottleneck là W lần DFS. Build trie của words; từ mỗi board cell, đi trie child tương ứng. Nếu trie không có child, cả nhóm words có prefix đó bị prune cùng lúc.

**State / invariant / data structure cần hiểu trước code.** DFS state là board cell + TrieNode của prefix đã match; board mark ngăn reuse cell. Trie node có word/end marker để emit khi path tạo word; có thể clear marker để tránh duplicate output.

**Dry run mental theo implementation.** Với words oath,pea,eat,rain, start board 'o' chỉ follow trie child o; path o-a-t-h tới terminal emit oath. Start 'e' có thể follow e-a-t emit eat; branches không có trie prefix dừng sớm.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là DFS mọi word riêng, quên unmark board, hoặc emit cùng word nhiều lần. Khi nào dùng: nhiều pattern searches chia sẻ prefixes trên cùng search space thường kết hợp trie + backtracking.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Build one trie for all words, then backtrack on the board. The trie prunes any board path that is not a dictionary prefix, shares prefix work across words, and terminal nodes store the full word for direct output.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    private static class TrieNode {
        private final TrieNode[] children = new TrieNode[26];

        // Storing the complete word at terminal nodes avoids rebuilding the path
        // into a String every time DFS reaches a dictionary word.
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

        // If the current board path is not a prefix of ANY dictionary word,
        // the trie lets us prune the entire DFS branch immediately.
        if (node == null) {
            return;
        }

        if (node.word != null) {
            result.add(node.word);

            // The same word may be reachable from many board paths; clearing it
            // after first output deduplicates without a separate result HashSet.
            node.word = null;
        }

        // In-place marker enforces the rule that one board cell cannot be reused
        // inside the current path; restoration makes the cell available to siblings.
        board[row][col] = '#';
        dfs(board, row - 1, col, node, result);
        dfs(board, row + 1, col, node, result);
        dfs(board, row, col - 1, node, result);
        dfs(board, row, col + 1, node, result);
        board[row][col] = letter;

        // Once this trie node is neither a remaining word nor a prefix of one,
        // removing it is safe and prunes the same dead prefix in future board starts.
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

## 3. Correctness

DFS explores exactly simple board paths while the trie allows only prefixes of remaining words. Reaching `node.word` proves a complete dictionary word exists on the current path. Clearing terminal words prevents duplicate output, and pruning an empty trie leaf cannot remove any unfound word.

## 4. Complexity

Trie build is proportional to total dictionary characters. Board search is backtracking with strong trie-prefix pruning; worst-case exponential in word length, with `O(total trie nodes + path depth)` auxiliary storage excluding output.
