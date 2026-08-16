public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{4,5,6,7,0,1,2},0,4);
        test(new int[]{4,5,6,7,0,1,2},3,-1);
        test(new int[]{1},0,-1);
        test(new int[]{1},1,0);
        test(new int[]{5,1,3},5,0);
        System.out.println("PASS 33 Search in Rotated Sorted Array");
    }
    private static void test(int[] nums,int target,int expected){
        int actual=new Solution().search(nums,target);
        if(actual!=expected) throw new AssertionError("expected="+expected+" actual="+actual);
    }
}
