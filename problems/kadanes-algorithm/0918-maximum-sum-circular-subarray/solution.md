# 918. Maximum Sum Circular Subarray — Solution

## 1. Core idea / Intuition
Tính đồng thời max subarray, min subarray và total. Circular maximum là `max(maxSum, total-minSum)`, trừ trường hợp toàn âm.

## 2. Requirement recap / Tóm tắt yêu cầu
Subarray phải không rỗng và không dùng phần tử quá một lần.

## 3. Key observations / Nhận xét quan trọng
Một wrapped subarray tương đương toàn mảng bỏ đi một contiguous minimum subarray ở giữa.

## 4. Alternative approaches / Các hướng khác
Duplicate array + window/monotonic queue phức tạp hơn. Hai Kadane passes có thể gộp trong một vòng.

## 5. Optimal approach / Hướng tối ưu
Maintain current/global max and min Kadane plus total. Nếu `maxSum < 0`, trả maxSum; ngược lại lấy max của non-wrap và wrap.

## 6. Java solution overview
```java
class Solution {
  public int maxSubarraySumCircular(int[] nums){
    int total=0,curMax=0,max=Integer.MIN_VALUE,curMin=0,min=Integer.MAX_VALUE;
    for(int x:nums){curMax=Math.max(x,curMax+x);max=Math.max(max,curMax);curMin=Math.min(x,curMin+x);min=Math.min(min,curMin);total+=x;}
    return max<0?max:Math.max(max,total-min);
  }
}
```

## 7. Code explanation / Giải thích code
Kadane max xử lý non-wrap; Kadane min xác định phần giữa nên loại trong trường hợp wrap.

## 8. Dry run / Chạy thử
`[5,-3,5]`: max non-wrap=7, min=-3, total=7, wrap=10.

## 9. Time and space complexity
O(n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Mọi circular subarray hoặc không qua boundary, hoặc là complement của một contiguous subarray. Trường hợp thứ hai tối đa khi complement bị loại có tổng nhỏ nhất. All-negative được tách để bảo đảm subarray không rỗng.

## 11. Edge cases
All-negative, one element, best non-wrap, best wrap.

## 12. Common mistakes
Dùng `total-minSum` khi all-negative; cho phép empty subarray; quên min Kadane.

## 13. Pattern recognition / Khi nào tái sử dụng
Circular max/min thường biến thành total trừ complement cực trị.

## 14. Vocabulary
**circular array**: mảng vòng; **wrap**: vòng qua boundary; **complement**: phần bù; **Kadane's algorithm**: thuật toán Kadane.
