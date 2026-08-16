public class TestSolution {
    public static void main(String[] args){
        int[][] m={{1,3,5,7},{10,11,16,20},{23,30,34,60}};
        test(m,3,true);test(m,13,false);test(new int[][]{{1}},1,true);test(new int[][]{{1}},2,false);
        System.out.println("PASS 74 Search a 2D Matrix");
    }
    static void test(int[][] m,int t,boolean e){boolean a=new Solution().searchMatrix(m,t);if(a!=e)throw new AssertionError();}
}
