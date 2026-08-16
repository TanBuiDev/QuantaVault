# 108. Convert Sorted Array to Binary Search Tree — Solution

## 1. Core idea / Intuition
Chọn midpoint của mỗi sorted interval làm root, rồi recurse hai nửa. Inorder được giữ tự nhiên và kích thước hai nửa chênh tối đa một.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần BST có đúng các giá trị input và height-balanced.

## 3. Key observations / Nhận xét quan trọng
Sorted order tương ứng trực tiếp với inorder traversal của BST. Midpoint đảm bảo cân bằng kích thước.

## 4. Alternative approaches / Các hướng khác
Insert tuần tự vào BST tạo cây lệch. Tự cân bằng bằng AVL/Red-Black là quá phức tạp so với việc tận dụng sorted array.

## 5. Optimal approach / Hướng tối ưu
`build(left,right)`: nếu rỗng trả null; chọn `mid`, tạo node, recurse `[left,mid-1]` và `[mid+1,right]`.

## 6. Java solution overview
```java
TreeNode build(int[] nums,int l,int r){
  if(l>r)return null;
  int m=l+(r-l)/2;
  TreeNode root=new TreeNode(nums[m]);
  root.left=build(nums,l,m-1);
  root.right=build(nums,m+1,r);
  return root;
}
```

## 7. Code explanation / Giải thích code
Mỗi array element trở thành đúng một TreeNode; các interval không chồng lấp.

## 8. Dry run / Chạy thử
`[-10,-3,0,5,9]`: midpoint 0 làm root, hai nửa size 2 được chia tiếp thành balanced subtrees.

## 9. Time and space complexity
O(n) time; O(log n) recursion stack cho balanced tree, không tính output nodes.

## 10. Why the algorithm is correct / Vì sao đúng
Induction trên interval: hai recursive calls tạo BST đúng cho hai nửa sorted; mọi giá trị trái < root < mọi giá trị phải, nên root là BST đúng. Hai nửa có size chênh tối đa một ở mỗi split, nên subtree heights chênh tối đa một.

## 11. Edge cases
Một phần tử, hai phần tử, odd/even length.

## 12. Common mistakes
Dùng endpoint thay midpoint; làm mất phần tử vì interval off-by-one; đòi hỏi một shape duy nhất dù nhiều đáp án hợp lệ.

## 13. Pattern recognition / Khi nào tái sử dụng
Sorted sequence + balanced tree thường giải bằng midpoint divide-and-conquer.

## 14. Vocabulary
**height-balanced**: cân bằng chiều cao; **inorder traversal**: duyệt trung thứ tự; **midpoint**: điểm giữa; **BST**: cây tìm kiếm nhị phân.
