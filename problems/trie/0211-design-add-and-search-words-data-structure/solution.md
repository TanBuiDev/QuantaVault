# Solution / Lời giải — 211. Design Add and Search Words Data Structure

## 1. Core idea

Insertion is ordinary trie traversal. Search becomes DFS only at `.`: a literal follows one edge, while wildcard branches over all existing children.

## 2. Optimal Java solution

```java
class WordDictionary {
    private static class Node {
        private final Node[] children = new Node[26];
        private boolean isWord;
    }

    private final Node root;

    public WordDictionary() {
        root = new Node();
    }

    public void addWord(String word) {
        Node node = root;

        for (char ch : word.toCharArray()) {
            int index = ch - 'a';

            if (node.children[index] == null) {
                node.children[index] = new Node();
            }

            node = node.children[index];
        }

        node.isWord = true;
    }

    public boolean search(String word) {
        return search(word, 0, root);
    }

    private boolean search(String word, int index, Node node) {
        if (index == word.length()) {
            // Matching every character is not enough if we stopped at a prefix;
            // the trie node must correspond to a complete inserted word.
            return node.isWord;
        }

        char ch = word.charAt(index);

        if (ch != '.') {
            Node child = node.children[ch - 'a'];
            return child != null && search(word, index + 1, child);
        }

        // '.' represents exactly one arbitrary character, so the search state
        // branches to every existing child and succeeds if ANY branch finishes.
        for (Node child : node.children) {
            if (child != null && search(word, index + 1, child)) {
                return true;
            }
        }

        return false;
    }
}
```

## 3. Correctness

Each recursive state represents all inserted words matching the already-consumed pattern prefix. A literal preserves only its matching edge; `.` explores every one-character continuation. At the end, `isWord` enforces exact length and full-word membership.

## 4. Complexity

`addWord` is `O(L)`. Search is `O(L)` without wildcards and can branch exponentially in the number of wildcards in the worst case, bounded by trie contents.
