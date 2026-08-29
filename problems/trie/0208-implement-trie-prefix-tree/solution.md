# Solution / Lời giải — 208. Implement Trie (Prefix Tree)

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Trie lưu nhiều words bằng cách chia sẻ prefix: apple và app cùng đi qua a->p->p, rồi chỉ apple đi tiếp l->e. Mỗi node đại diện một prefix, không phải một word hoàn chỉnh mặc định.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashSet giải exact search nhưng startsWith phải scan words. Quan sát prefix tree cho cả insert/search/prefix trong O(length): follow một child theo mỗi character.

**State / invariant / data structure cần hiểu trước code.** TrieNode children ánh xạ character->next prefix; isWord đánh dấu có word kết thúc đúng node đó. Invariant sau insert word, path characters tồn tại và only terminal node được mark isWord=true.

**Dry run mental theo implementation.** Insert apple tạo path a-p-p-l-e mark e. Insert app reuse a-p-p và mark second p. search app true sau insert thứ hai; startsWith ap true chỉ cần path, không cần terminal mark.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là coi node có children là word hoặc startsWith check isWord. Khi nào dùng: nhiều string operations theo prefix thường dùng trie để share prefix work.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
