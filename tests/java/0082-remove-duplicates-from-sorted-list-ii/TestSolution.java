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
        test(new int[]{1,2,3,3,4,4,5}, new int[]{1,2,5});
        test(new int[]{1,1,1,2,3}, new int[]{2,3});
        test(new int[]{}, new int[]{});
        test(new int[]{1,1,2,2}, new int[]{});
        test(new int[]{1,2,3,4,4}, new int[]{1,2,3});
        test(new int[]{-2,-1,0,1}, new int[]{-2,-1,0,1});
        System.out.println("PASS 82 Remove Duplicates from Sorted List II");
    }

    private static void test(int[] input, int[] expected) {
        ListNode actualHead = new Solution().deleteDuplicates(build(input));
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
        int i = 0;
        for (ListNode node = head; node != null; node = node.next) {
            values[i++] = node.val;
        }
        return values;
    }
}
