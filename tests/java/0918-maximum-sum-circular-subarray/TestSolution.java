public class TestSolution {
    public static void main(String[] args){test(new int[]{1,-2,3,-2},3);test(new int[]{5,-3,5},10);test(new int[]{-3,-2,-3},-2);test(new int[]{3,-1,2,-1},4);test(new int[]{1},1);System.out.println("PASS 918 Maximum Sum Circular Subarray");}
    static void test(int[] a,int e){int x=new Solution().maxSubarraySumCircular(a);if(x!=e)throw new AssertionError("expected="+e+" actual="+x);}
}
