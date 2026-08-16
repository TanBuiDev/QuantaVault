import java.util.Arrays;

class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
    }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{1,4,3,2,5,2}, 3, new int[]{1,2,2,4,3,5});
        test(new int[]{2,1}, 2, new int[]{1,2});
        test(new int[]{}, 3, new int[]{});
        test(new int[]{1,0,-1}, 5, new int[]{1,0,-1});
        test(new int[]{5,6,7}, 5, new int[]{5,6,7});
        test(new int[]{3,1,3,2,3}, 3, new int[]{1,2,3,3,3});
        System.out.println("PASS 86 Partition List");
    }

    private static void test(int[] input, int x, int[] expected) {
        ListNode actualHead = new Solution().partition(build(input), x);
        int[] actual = toArray(actualHead, expected.length);
        if (!Arrays.equals(actual, expected)) {
            throw new AssertionError("expected=" + Arrays.toString(expected) + " actual=" + Arrays.toString(actual));
        }
    }

    private static ListNode build(int[] values) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (int value : values) {
            tail.next = new ListNode(value);
            tail = tail.next;
        }
        return dummy.next;
    }

    private static int[] toArray(ListNode head, int expectedLength) {
        int[] values = new int[expectedLength];
        int index = 0;
        ListNode current = head;
        while (current != null) {
            if (index >= expectedLength) {
                throw new AssertionError("output contains a cycle or extra nodes");
            }
            values[index++] = current.val;
            current = current.next;
        }
        if (index != expectedLength) {
            throw new AssertionError("output lost nodes");
        }
        return values;
    }
}
