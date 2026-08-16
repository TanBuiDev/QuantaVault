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
        test(new int[]{1,2,4}, new int[]{1,3,4}, new int[]{1,1,2,3,4,4});
        test(new int[]{}, new int[]{}, new int[]{});
        test(new int[]{}, new int[]{0}, new int[]{0});
        test(new int[]{-2,5}, new int[]{}, new int[]{-2,5});
        test(new int[]{-5,-1,3}, new int[]{-4,0,2,7}, new int[]{-5,-4,-1,0,2,3,7});
        test(new int[]{1,1,2}, new int[]{1,1,3}, new int[]{1,1,1,1,2,3});
        System.out.println("PASS 21 Merge Two Sorted Lists");
    }

    private static void test(int[] a, int[] b, int[] expected) {
        ListNode actualHead = new Solution().mergeTwoLists(build(a), build(b));
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
        int[] result = new int[length];
        int i = 0;
        for (ListNode node = head; node != null; node = node.next) {
            result[i++] = node.val;
        }
        return result;
    }
}
