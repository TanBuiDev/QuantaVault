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
        test(new int[]{1,2,3,4,5}, 2, new int[]{2,1,4,3,5});
        test(new int[]{1,2,3,4,5}, 3, new int[]{3,2,1,4,5});
        test(new int[]{1,2,3}, 1, new int[]{1,2,3});
        test(new int[]{1,2,3,4}, 4, new int[]{4,3,2,1});
        test(new int[]{1,2,3,4,5,6}, 3, new int[]{3,2,1,6,5,4});
        test(new int[]{1,2,3,4,5,6,7}, 3, new int[]{3,2,1,6,5,4,7});
        System.out.println("PASS 25 Reverse Nodes in k-Group");
    }

    private static void test(int[] input, int k, int[] expected) {
        ListNode actualHead = new Solution().reverseKGroup(build(input), k);
        int[] actual = toArray(actualHead, input.length);
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
            throw new AssertionError("output lost nodes: expected length=" + expectedLength + " actual=" + index);
        }
        return values;
    }
}
