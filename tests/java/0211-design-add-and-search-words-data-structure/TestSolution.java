public class TestSolution {
    public static void main(String[] args) {
        example();
        wildcardPositions();
        prefixIsNotWord();
        wrongLength();
        System.out.println("PASS 211 Design Add and Search Words Data Structure");
    }

    private static void example() {
        WordDictionary dictionary = new WordDictionary();
        dictionary.addWord("bad");
        dictionary.addWord("dad");
        dictionary.addWord("mad");
        assertFalse(dictionary.search("pad"));
        assertTrue(dictionary.search("bad"));
        assertTrue(dictionary.search(".ad"));
        assertTrue(dictionary.search("b.."));
    }

    private static void wildcardPositions() {
        WordDictionary dictionary = new WordDictionary();
        dictionary.addWord("code");
        dictionary.addWord("cope");
        assertTrue(dictionary.search(".ode"));
        assertTrue(dictionary.search("c.de"));
        assertTrue(dictionary.search("co.e"));
        assertTrue(dictionary.search("...."));
    }

    private static void prefixIsNotWord() {
        WordDictionary dictionary = new WordDictionary();
        dictionary.addWord("apple");
        assertFalse(dictionary.search("app"));
        assertTrue(dictionary.search("a...."));
        assertTrue(dictionary.search("....."));
    }

    private static void wrongLength() {
        WordDictionary dictionary = new WordDictionary();
        dictionary.addWord("cat");
        assertFalse(dictionary.search(".."));
        assertFalse(dictionary.search("...."));
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
