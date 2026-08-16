public class TestSolution {
    public static void main(String[] args) {
        RandomizedSet set = new RandomizedSet();
        assertTrue(set.insert(1));
        assertFalse(set.remove(2));
        assertTrue(set.insert(2));

        for (int i = 0; i < 100; i++) {
            int value = set.getRandom();
            if (value != 1 && value != 2) {
                throw new AssertionError("getRandom returned value outside set: " + value);
            }
        }

        assertTrue(set.remove(1));
        assertFalse(set.insert(2));
        assertEquals(2, set.getRandom());

        RandomizedSet swapSet = new RandomizedSet();
        assertTrue(swapSet.insert(10));
        assertTrue(swapSet.insert(20));
        assertTrue(swapSet.insert(30));
        assertTrue(swapSet.remove(20));
        assertTrue(swapSet.remove(10));
        assertEquals(30, swapSet.getRandom());
        assertTrue(swapSet.remove(30));
        assertFalse(swapSet.remove(30));

        System.out.println("PASS 380 Insert Delete GetRandom O(1)");
    }

    private static void assertTrue(boolean value) {
        if (!value) throw new AssertionError("expected true");
    }

    private static void assertFalse(boolean value) {
        if (value) throw new AssertionError("expected false");
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) throw new AssertionError("expected=" + expected + " actual=" + actual);
    }
}
