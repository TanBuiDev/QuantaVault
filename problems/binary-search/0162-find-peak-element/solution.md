# 162. Find Peak Element — Solution

## 1. Core idea / Intuition
Binary search theo hướng của slope. Khi `nums[mid] < nums[mid+1]`, đi phải; ngược lại giữ mid và đi trái.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần bất kỳ peak nào trong O(log n).

## 3. Key observations / Nhận xét quan trọng
Vì ngoài biên là `-∞` và adjacent khác nhau, đi theo hướng tăng cuối cùng phải dẫn tới một peak.

## 4. Alternative approaches / Các hướng khác
Linear scan O(n) không đạt yêu cầu.

## 5. Optimal approach / Hướng tối ưu
Binary search interval `[left,right]`, so sánh mid với mid+1 và giữ nửa chắc chắn chứa peak.

## 6. Java solution overview
```java
class Solution {
  public int findPeakElement(int[] nums) {
    int l=0,r=nums.length-1;
    while(l<r){
      int m=l+(r-l)/2;
      if(nums[m]<nums[m+1]) l=m+1; else r=m;
    }
    return l;
  }
}
```

## 7. Code explanation / Giải thích code
Nhánh xuống dùng `right=mid` vì mid vẫn có thể là peak.

## 8. Dry run / Chạy thử
`[1,2,3,1]`: slope ở mid tăng nên đi phải, sau đó slope giảm và hội tụ tại index 2.

## 9. Time and space complexity
O(log n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Mỗi comparison cho một hướng mà tại đó, do boundary `-∞`, chuỗi tăng không thể kéo dài mãi mà không gặp peak. Interval luôn giữ ít nhất một peak và thu nhỏ đến một index.

## 11. Edge cases
Một phần tử; peak ở đầu; peak ở cuối; nhiều peak.

## 12. Common mistakes
Đọc `mid+1` khi dùng loop sai; dùng `right=mid-1` và bỏ mất mid.

## 13. Pattern recognition / Khi nào tái sử dụng
Slope binary search dùng khi chỉ cần một local optimum.

## 14. Vocabulary
**peak**: đỉnh; **slope**: độ dốc; **local maximum**: cực đại cục bộ; **converge**: hội tụ.
