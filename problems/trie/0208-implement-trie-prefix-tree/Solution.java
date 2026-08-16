class Trie {
    private static class Node {
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

        node.isWord = true;
    }

    public boolean search(String word) {
        Node node = findNode(word);
        return node != null && node.isWord;
    }

    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    private Node findNode(String text) {
        Node node = root;

        for (char ch : text.toCharArray()) {
            int index = ch - 'a';
            node = node.children[index];

            if (node == null) {
                return null;
            }
        }

        return node;
    }
}
