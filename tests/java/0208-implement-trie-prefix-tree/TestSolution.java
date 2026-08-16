public class TestSolution {
    public static void main(String[] args) {
        example();
        sharedPrefix();
        duplicateInsert();
        System.out.println("PASS 208 Implement Trie (Prefix Tree)");
    }

    private static void example() {
        Trie trie = new Trie();
        trie.insert("apple");
        assertTrue(trie.search("apple"));
        assertFalse(trie.search("app"));
        assertTrue(trie.startsWith("app"));
        trie.insert("app");
        assertTrue(trie.search("app"));
    }

    private static void sharedPrefix() {
        Trie trie = new Trie();
        trie.insert("app");
        trie.insert("apple");
        trie.insert("apex");
        assertTrue(trie.search("app"));
        assertFalse(trie.search("appl"));
        assertTrue(trie.startsWith("ap"));
        assertFalse(trie.startsWith("aq"));
    }

    private static void duplicateInsert() {
        Trie trie = new Trie();
        trie.insert("cat");
        trie.insert("cat");
        assertTrue(trie.search("cat"));
        assertTrue(trie.startsWith("ca"));
    }

    private static void assertTrue(boolean value) {
        if (!value) {
            throw new AssertionError("expected true");
        }
    }

    private static void assertFalse(boolean value) {
        if (value) {
            throw new AssertionError("expected false");
        }
    }
}
