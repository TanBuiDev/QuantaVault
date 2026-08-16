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
        test(new int[]{2,4,3}, new int[]{5,6,4}, new int[]{7,0,8});
        test(new int[]{0}, new int[]{0}, new int[]{0});
        test(new int[]{9,9,9,9,9,9,9}, new int[]{9,9,9,9}, new int[]{8,9,9,9,0,0,0,1});
        test(new int[]{5}, new int[]{5}, new int[]{0,1});
        test(new int[]{9,9,9}, new int[]{1}, new int[]{0,0,0,1});
        test(new int[]{1,8}, new int[]{0}, new int[]{1,8});
        System.out.println("PASS 2 Add Two Numbers");
    }

    private static void test(int[] a, int[] b, int[] expected) {
        ListNode actualHead = new Solution().addTwoNumbers(build(a), build(b));
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
        for (ListNode current = head; current != null; current = current.next) {
            length++;
        }

        int[] values = new int[length];
        int index = 0;
        for (ListNode current = head; current != null; current = current.next) {
            values[index++] = current.val;
        }
        return values;
    }
}
