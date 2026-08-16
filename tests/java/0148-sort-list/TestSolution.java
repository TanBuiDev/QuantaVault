import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{4,2,1,3}, new int[]{1,2,3,4});
        test(new int[]{-1,5,3,4,0}, new int[]{-1,0,3,4,5});
        test(new int[]{}, new int[]{});
        test(new int[]{2,1}, new int[]{1,2});
        test(new int[]{3,3,1,2,2}, new int[]{1,2,2,3,3});
        System.out.println("PASS 148 Sort List");
    }
    static void test(int[] input, int[] expected) {
        ListNode head = build(input);
        ListNode result = new Solution().sortList(head);
        int[] actual = toArray(result, expected.length + 1);
        if (!Arrays.equals(actual, expected)) throw new AssertionError(Arrays.toString(actual));
    }
    static ListNode build(int[] a){ListNode d=new ListNode(),t=d;for(int x:a){t.next=new ListNode(x);t=t.next;}return d.next;}
    static int[] toArray(ListNode n,int limit){int len=0;for(ListNode p=n;p!=null;p=p.next){if(++len>limit)throw new AssertionError("cycle");}int[] a=new int[len];for(int i=0;n!=null;i++,n=n.next)a[i]=n.val;return a;}
}
