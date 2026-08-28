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
