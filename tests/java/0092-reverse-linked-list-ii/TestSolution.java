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
        test(new int[]{1,2,3,4,5}, 2, 4, new int[]{1,4,3,2,5});
        test(new int[]{5}, 1, 1, new int[]{5});
        test(new int[]{1,2,3,4}, 1, 3, new int[]{3,2,1,4});
        test(new int[]{1,2,3,4}, 2, 4, new int[]{1,4,3,2});
        test(new int[]{1,2,3}, 1, 3, new int[]{3,2,1});
        test(new int[]{1,2,3}, 2, 2, new int[]{1,2,3});
        System.out.println("PASS 92 Reverse Linked List II");
    }

    private static void test(int[] values, int left, int right, int[] expected) {
        ListNode actualHead = new Solution().reverseBetween(build(values), left, right);
        int[] actual = toArray(actualHead);
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

    private static int[] toArray(ListNode head) {
        int length = 0;
        for (ListNode node = head; node != null; node = node.next) {
            length++;
        }
        int[] values = new int[length];
        int index = 0;
        for (ListNode node = head; node != null; node = node.next) {
            values[index++] = node.val;
        }
        return values;
    }
}
