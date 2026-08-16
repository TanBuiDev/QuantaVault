public class TestSolution {
    public static void main(String[] args){test(new int[]{-2,1,-3,4,-1,2,1,-5,4},6);test(new int[]{1},1);test(new int[]{5,4,-1,7,8},23);test(new int[]{-5,-2,-7},-2);System.out.println("PASS 53 Maximum Subarray");}
    static void test(int[] a,int e){int x=new Solution().maxSubArray(a);if(x!=e)throw new AssertionError("expected="+e+" actual="+x);}
}
