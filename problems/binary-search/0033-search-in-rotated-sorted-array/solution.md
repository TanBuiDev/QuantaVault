# 33. Search in Rotated Sorted Array — Solution

## 1. Core idea / Intuition
Mỗi bước binary search xác định nửa trái hay nửa phải đang sorted, rồi dùng range của nửa sorted để quyết định giữ nửa nào.

## 2. Requirement recap / Tóm tắt yêu cầu
Tìm target trong rotated sorted unique array với O(log n).

## 3. Key observations / Nhận xét quan trọng
Nếu `nums[left] <= nums[mid]`, nửa trái sorted; ngược lại nửa phải sorted.

## 4. Alternative approaches / Các hướng khác
Linear scan O(n) không đạt yêu cầu.

## 5. Optimal approach / Hướng tối ưu
Binary search inclusive; khi một nửa sorted, kiểm tra target có nằm trong interval giá trị của nó để loại nửa còn lại.

## 6. Java solution overview
```java
class Solution {
  public int search(int[] nums, int target) {
    int l=0,r=nums.length-1;
    while(l<=r){
      int m=l+(r-l)/2;
      if(nums[m]==target) return m;
      if(nums[l]<=nums[m]){
        if(nums[l]<=target && target<nums[m]) r=m-1; else l=m+1;
      } else {
        if(nums[m]<target && target<=nums[r]) l=m+1; else r=m-1;
      }
    }
    return -1;
  }
}
```

## 7. Code explanation / Giải thích code
Unique values cho phép phân biệt chắc chắn nửa sorted bằng comparison endpoint.

## 8. Dry run / Chạy thử
Với `[4,5,6,7,0,1,2]`, target 0, mid=7 cho thấy nửa trái sorted nhưng target không nằm trong đó nên chuyển sang phải.

## 9. Time and space complexity
O(log n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Ở mỗi bước một nửa chắc chắn sorted; range test xác định chính xác liệu target có thể nằm trong nửa đó. Nửa bị loại không thể chứa target, nên invariant được giữ đến khi tìm thấy hoặc interval rỗng.

## 11. Edge cases
Single element, no rotation, target at pivot, absent target.

## 12. Common mistakes
Dùng inequality sai ở boundary; giả định luôn nửa trái sorted.

## 13. Pattern recognition / Khi nào tái sử dụng
Rotated sorted arrays thường giải bằng “find the sorted half”.

## 14. Vocabulary
**rotated array**: mảng xoay; **sorted half**: nửa đã sort; **pivot**: điểm xoay; **inclusive interval**: khoảng đóng.
