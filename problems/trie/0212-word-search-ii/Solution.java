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
