class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
    }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3, 2, 0, -4}, 1, true);
        test(new int[]{1, 2}, 0, true);
        test(new int[]{1}, -1, false);
        test(new int[]{}, -1, false);
        test(new int[]{7}, 0, true);
        test(new int[]{1, 1, 1, 1}, -1, false);
        test(new int[]{1, 2, 3, 4, 5, 6}, 4, true);
        System.out.println("PASS 141 Linked List Cycle");
    }

    private static void test(int[] values, int pos, boolean expected) {
        ListNode head = build(values, pos);
        boolean actual = new Solution().hasCycle(head);
        if (actual != expected) {
            throw new AssertionError("pos=" + pos + " expected=" + expected + " actual=" + actual);
        }
    }

    private static ListNode build(int[] values, int pos) {
        if (values.length == 0) {
            return null;
        }

        ListNode[] nodes = new ListNode[values.length];
        for (int i = 0; i < values.length; i++) {
            nodes[i] = new ListNode(values[i]);
            if (i > 0) {
                nodes[i - 1].next = nodes[i];
            }
        }

        if (pos >= 0) {
            nodes[nodes.length - 1].next = nodes[pos];
        }
        return nodes[0];
    }
}
