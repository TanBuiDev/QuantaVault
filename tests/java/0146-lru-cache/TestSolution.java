public class TestSolution {
    public static void main(String[] args) {
        example();
        capacityOne();
        getRefreshesRecency();
        updateRefreshesRecency();
        updateDoesNotGrowSize();
        System.out.println("PASS 146 LRU Cache");
    }

    private static void example() {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(2, 2);
        assertEquals(1, cache.get(1));
        cache.put(3, 3);
        assertEquals(-1, cache.get(2));
        cache.put(4, 4);
        assertEquals(-1, cache.get(1));
        assertEquals(3, cache.get(3));
        assertEquals(4, cache.get(4));
    }

    private static void capacityOne() {
        LRUCache cache = new LRUCache(1);
        cache.put(1, 10);
        assertEquals(10, cache.get(1));
        cache.put(2, 20);
        assertEquals(-1, cache.get(1));
        assertEquals(20, cache.get(2));
    }

    private static void getRefreshesRecency() {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(2, 2);
        assertEquals(1, cache.get(1));
        cache.put(3, 3);
        assertEquals(-1, cache.get(2));
        assertEquals(1, cache.get(1));
    }

    private static void updateRefreshesRecency() {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(2, 2);
        cache.put(1, 10);
        cache.put(3, 3);
        assertEquals(-1, cache.get(2));
        assertEquals(10, cache.get(1));
        assertEquals(3, cache.get(3));
    }

    private static void updateDoesNotGrowSize() {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(1, 5);
        assertEquals(5, cache.get(1));
        cache.put(2, 2);
        assertEquals(5, cache.get(1));
        assertEquals(2, cache.get(2));
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }
}
