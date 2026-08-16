import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{-10,-3,0,5,9});
        test(new int[]{1});
        test(new int[]{1,2});
        test(new int[]{1,2,3,4,5,6});
        System.out.println("PASS 108 Convert Sorted Array to BST");
    }
    static void test(int[] nums) {
        TreeNode root = new Solution().sortedArrayToBST(nums);
        List<Integer> values = new ArrayList<>();
        inorder(root, values);
        int[] actual = values.stream().mapToInt(Integer::intValue).toArray();
        if (!Arrays.equals(actual, nums)) throw new AssertionError(Arrays.toString(actual));
        checkHeight(root);
    }
    static void inorder(TreeNode n,List<Integer> out){if(n==null)return;inorder(n.left,out);out.add(n.val);inorder(n.right,out);}
    static int checkHeight(TreeNode n){if(n==null)return 0;int l=checkHeight(n.left),r=checkHeight(n.right);if(Math.abs(l-r)>1)throw new AssertionError("unbalanced");return 1+Math.max(l,r);}
}
