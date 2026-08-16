import java.util.Arrays;

public class TestSolution {
    public static void main(String[] args){
        test(new int[][]{{1,4,5},{1,3,4},{2,6}},new int[]{1,1,2,3,4,4,5,6});
        test(new int[][]{},new int[]{});test(new int[][]{{}},new int[]{});test(new int[][]{{-2,1},{-3,4}},new int[]{-3,-2,1,4});
        System.out.println("PASS 23 Merge k Sorted Lists");
    }
    static void test(int[][] values,int[] expected){ListNode[] lists=new ListNode[values.length];for(int i=0;i<values.length;i++)lists[i]=build(values[i]);ListNode r=new Solution().mergeKLists(lists);int[] actual=toArray(r,expected.length+1);if(!Arrays.equals(actual,expected))throw new AssertionError(Arrays.toString(actual));}
    static ListNode build(int[] a){ListNode d=new ListNode(0),t=d;for(int x:a){t.next=new ListNode(x);t=t.next;}return d.next;}
    static int[] toArray(ListNode n,int limit){int len=0;for(ListNode p=n;p!=null;p=p.next){if(++len>limit)throw new AssertionError("cycle");}int[] a=new int[len];for(int i=0;n!=null;i++,n=n.next)a[i]=n.val;return a;}
}
