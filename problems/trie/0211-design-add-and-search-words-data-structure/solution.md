# Solution / Lời giải — 211. Design Add and Search Words Data Structure

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** WordDictionary giống Trie nhưng search pattern có '.' nghĩa là bất kỳ một ký tự. Với literal char ta đi đúng một child; với '.' ta phải thử mọi child hiện có tại vị trí đó.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Regex trên toàn word list sẽ scan nhiều strings. Trie chia sẻ prefixes; wildcard chỉ branch tại các node relevant, và branch có thể fail sớm nếu suffix không tồn tại.

**State / invariant / data structure cần hiểu trước code.** DFS search(node,index) nghĩa là prefix pattern[0..index) đã match path tới node. Literal giữ một branch; '.' recurse all non-null children; index==len chỉ true nếu node.isWord.

**Dry run mental theo implementation.** Sau add bad,dad,mad, search '.ad': tại root '.' thử b,d,m branches; mỗi branch suffix a->d tồn tại và terminal true nên return true ngay branch đầu hợp lệ.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là '.' match nhiều hơn/ít hơn đúng một char hoặc base case bỏ isWord. Khi nào dùng: trie search với single-position wildcard là DFS branching only at wildcard positions.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
