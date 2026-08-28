import java.util.HashMap;
import java.util.Map;

class LRUCache {
    private static class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> cache;
    private final Node head;
    private final Node tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);

        // Sentinels đảm bảo mọi real node luôn có cả prev và next, nên remove/add
        // dùng cùng một pointer formula cho cả LRU/MRU mà không cần null edge cases.
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = cache.get(key);
        if (node == null) {
            return -1;
        }

        // Successful get là một lần sử dụng, nên recency phải được refresh.
        moveToMostRecent(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = cache.get(key);
        if (node != null) {
            node.value = value;

            // Update existing key không tăng size nhưng vẫn là recent access.
            moveToMostRecent(node);
            return;
        }

        Node added = new Node(key, value);
        cache.put(key, added);
        addBeforeTail(added);

        if (cache.size() > capacity) {
            // List invariant là head <-> LRU ... MRU <-> tail, nên head.next
            // luôn là victim duy nhất cần evict khi capacity vừa bị vượt.
            Node lru = head.next;
            remove(lru);
            cache.remove(lru.key);
        }
    }

    private void moveToMostRecent(Node node) {
        remove(node);
        addBeforeTail(node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addBeforeTail(Node node) {
        // Ngay trước tail là MRU position; four pointer writes splice node vào
        // mà không cần scan list, giữ get/put ở average O(1).
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
    }
}
