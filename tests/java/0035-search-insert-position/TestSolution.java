public class TestSolution {
    public static void main(String[] args){
        test(new int[]{1,3,5,6},5,2);test(new int[]{1,3,5,6},2,1);test(new int[]{1,3,5,6},7,4);test(new int[]{1,3,5,6},0,0);test(new int[]{1},1,0);
        System.out.println("PASS 35 Search Insert Position");
    }
    static void test(int[] a,int t,int e){int x=new Solution().searchInsert(a,t);if(x!=e)throw new AssertionError("expected="+e+" actual="+x);}
}
