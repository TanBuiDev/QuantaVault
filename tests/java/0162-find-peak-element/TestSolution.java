public class TestSolution {
    public static void main(String[] args) {
        testExact(new int[]{1,2,3,1},2);
        testPeak(new int[]{1,2,1,3,5,6,4});
        testExact(new int[]{1},0);
        testExact(new int[]{1,2,3,4},3);
        testExact(new int[]{4,3,2,1},0);
        System.out.println("PASS 162 Find Peak Element");
    }
    private static void testExact(int[] nums,int expected){int a=new Solution().findPeakElement(nums);if(a!=expected)throw new AssertionError();}
    private static void testPeak(int[] nums){int i=new Solution().findPeakElement(nums);int l=i==0?Integer.MIN_VALUE:nums[i-1];int r=i==nums.length-1?Integer.MIN_VALUE:nums[i+1];if(nums[i]<=l||nums[i]<=r)throw new AssertionError("not a peak: "+i);}
}
