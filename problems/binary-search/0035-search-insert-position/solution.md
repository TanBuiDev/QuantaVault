# 35. Search Insert Position — Solution

## 1. Core idea / Intuition
Đây chính là lower bound: index đầu tiên có `nums[i] >= target`.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần tìm vị trí tồn tại hoặc vị trí chèn trong O(log n).

## 3. Key observations / Nhận xét quan trọng
Insertion position có thể bằng `nums.length`, nên half-open binary search rất tự nhiên.

## 4. Alternative approaches / Các hướng khác
Linear scan O(n) không đạt yêu cầu.

## 5. Optimal approach / Hướng tối ưu
Binary search `[left,right)`; nếu `nums[mid] < target` thì `left=mid+1`, ngược lại `right=mid`.

## 6. Java solution overview
```java
class Solution {
  public int searchInsert(int[] nums,int target){
    int l=0,r=nums.length;
    while(l<r){int m=l+(r-l)/2;if(nums[m]<target)l=m+1;else r=m;}
    return l;
  }
}
```

## 7. Code explanation / Giải thích code
`left` hội tụ về phần tử đầu tiên không nhỏ hơn target, hoặc `n` nếu mọi phần tử nhỏ hơn.

## 8. Dry run / Chạy thử
`[1,3,5,6]`, target 2 hội tụ tại index 1.

## 9. Time and space complexity
O(log n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Invariant giữ mọi index trước left chắc chắn `< target`, còn answer luôn nằm trong `[left,right]`. Khi interval rỗng, left là lower bound duy nhất.

## 11. Edge cases
Target nhỏ hơn tất cả, lớn hơn tất cả, bằng phần tử đầu/cuối.

## 12. Common mistakes
Không cho phép answer bằng n; trộn inclusive và half-open updates.

## 13. Pattern recognition / Khi nào tái sử dụng
Lower bound dùng cho insert position và nhiều boundary search khác.

## 14. Vocabulary
**insert position**: vị trí chèn; **lower bound**: cận dưới; **distinct**: phân biệt; **half-open interval**: khoảng nửa mở.
