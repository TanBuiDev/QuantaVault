import java.util.ArrayList;
import java.util.List;

class Node {
    int val;
    Node next;
    Node random;

    Node(int val) {
        this.val = val;
    }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{7,13,11,10,1}, new Integer[]{null,0,4,2,0});
        test(new int[]{1,2}, new Integer[]{1,1});
        test(new int[]{3,3,3}, new Integer[]{null,0,null});
        test(new int[]{}, new Integer[]{});
        test(new int[]{5}, new Integer[]{0});
        test(new int[]{1,2,3}, new Integer[]{null,null,null});
        System.out.println("PASS 138 Copy List with Random Pointer");
    }

    private static void test(int[] values, Integer[] randomIndexes) {
        Node[] original = build(values, randomIndexes);
        Node head = original.length == 0 ? null : original[0];
        Node copyHead = new Solution().copyRandomList(head);
        List<Node> copied = collect(copyHead, values.length);

        if (copied.size() != values.length) {
            throw new AssertionError("wrong copied length: " + copied.size());
        }

        for (int i = 0; i < values.length; i++) {
            Node copy = copied.get(i);
            if (copy == original[i]) {
                throw new AssertionError("node " + i + " was not deeply copied");
            }
            if (copy.val != values[i]) {
                throw new AssertionError("wrong value at " + i);
            }

            Node expectedNext = i + 1 < values.length ? copied.get(i + 1) : null;
            if (copy.next != expectedNext) {
                throw new AssertionError("wrong copied next at " + i);
            }

            Integer randomIndex = randomIndexes[i];
            Node expectedRandom = randomIndex == null ? null : copied.get(randomIndex);
            if (copy.random != expectedRandom) {
                throw new AssertionError("wrong copied random at " + i);
            }

            Node expectedOriginalNext = i + 1 < values.length ? original[i + 1] : null;
            if (original[i].next != expectedOriginalNext) {
                throw new AssertionError("original next not restored at " + i);
            }
            Node expectedOriginalRandom = randomIndex == null ? null : original[randomIndex];
            if (original[i].random != expectedOriginalRandom) {
                throw new AssertionError("original random changed at " + i);
            }
        }
    }

    private static Node[] build(int[] values, Integer[] randomIndexes) {
        Node[] nodes = new Node[values.length];
        for (int i = 0; i < values.length; i++) {
            nodes[i] = new Node(values[i]);
            if (i > 0) {
                nodes[i - 1].next = nodes[i];
            }
        }
        for (int i = 0; i < values.length; i++) {
            Integer randomIndex = randomIndexes[i];
            nodes[i].random = randomIndex == null ? null : nodes[randomIndex];
        }
        return nodes;
    }

    private static List<Node> collect(Node head, int expectedLength) {
        List<Node> nodes = new ArrayList<>();
        Node current = head;
        while (current != null) {
            nodes.add(current);
            if (nodes.size() > expectedLength) {
                throw new AssertionError("copied next pointers contain a cycle");
            }
            current = current.next;
        }
        return nodes;
    }
}
