# Solution / Lời giải — 208. Implement Trie (Prefix Tree)

## 1. Core idea

Mỗi trie node đại diện một prefix; `children[ch-'a']` là edge sang prefix dài hơn một ký tự. `isWord` tách exact-word membership khỏi prefix existence.

## 2. Optimal Java solution

```java
class Trie {
    private static class Node {
        // Fixed lowercase alphabet lets every edge be addressed directly by ch-'a'
        // instead of hashing a character at each trie level.
        private final Node[] children = new Node[26];
        private boolean isWord;
    }

    private final Node root;

    public Trie() {
        root = new Node();
    }

    public void insert(String word) {
        Node node = root;

        for (char ch : word.toCharArray()) {
            int index = ch - 'a';

            if (node.children[index] == null) {
                node.children[index] = new Node();
            }

            node = node.children[index];
        }

        // Reaching a node only proves the prefix exists; this flag is what
        // distinguishes an inserted full word from a prefix shared by longer words.
        node.isWord = true;
    }

    public boolean search(String word) {
        Node node = findNode(word);
        return node != null && node.isWord;
    }

    public boolean startsWith(String prefix) {
        // Prefix existence does not require an end-of-word marker.
        return findNode(prefix) != null;
    }

    private Node findNode(String text) {
        Node node = root;

        for (char ch : text.toCharArray()) {
            int index = ch - 'a';
            node = node.children[index];

            // A missing edge means no inserted word has this entire prefix,
            // so both exact search and startsWith can stop immediately.
            if (node == null) {
                return null;
            }
        }

        return node;
    }
}
```

## 3. Correctness

Following trie edges consumes exactly the queried prefix. `search` additionally requires `isWord`, while `startsWith` only requires the path to exist, matching the two contracts exactly.

## 4. Complexity

Each operation is `O(L)` for text length `L`; storage is proportional to the number of trie nodes created.
