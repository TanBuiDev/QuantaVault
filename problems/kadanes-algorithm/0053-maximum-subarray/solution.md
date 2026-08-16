# 53. Maximum Subarray — Solution

## 1. Core idea / Intuition
Kadane giữ tổng tốt nhất của subarray kết thúc đúng tại vị trí hiện tại; nếu prefix trước làm tổng xấu đi thì bỏ prefix đó và bắt đầu mới.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần maximum sum của một non-empty contiguous subarray.

## 3. Key observations / Nhận xét quan trọng
State chỉ phụ thuộc state trước và phần tử hiện tại, nên không cần DP array.

## 4. Alternative approaches / Các hướng khác
Brute force O(n²); divide-and-conquer O(n log n) đáp ứng follow-up nhưng chậm hơn Kadane.

## 5. Optimal approach / Hướng tối ưu
Khởi tạo `current=best=nums[0]`, sau đó cập nhật `current=max(x,current+x)` và `best=max(best,current)`.

## 6. Java solution overview
```java
class Solution {
  public int maxSubArray(int[] nums){
    int current=nums[0],best=nums[0];
    for(int i=1;i<nums.length;i++){current=Math.max(nums[i],current+nums[i]);best=Math.max(best,current);}
    return best;
  }
}
```

## 7. Code explanation / Giải thích code
`current` luôn là best sum kết thúc tại i; `best` là global maximum của các state đó.

## 8. Dry run / Chạy thử
Trong ví dụ đầu, state tốt nhất đạt 6 trên `[4,-1,2,1]`.

## 9. Time and space complexity
O(n) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Mọi subarray kết thúc tại i hoặc bắt đầu ở i hoặc nối một subarray kết thúc tại i-1. Chọn tốt nhất giữa hai khả năng tạo recurrence chính xác; maximum qua mọi i là đáp án toàn cục.

## 11. Edge cases
Một phần tử, toàn âm, toàn dương.

## 12. Common mistakes
Khởi tạo bằng 0 và vô tình cho phép empty subarray; chỉ cộng khi positive mà bỏ all-negative case.

## 13. Pattern recognition / Khi nào tái sử dụng
Kadane dùng cho contiguous optimum khi state “best ending here” có recurrence cục bộ.

## 14. Vocabulary
**contiguous subarray**: mảng con liên tiếp; **maximum sum**: tổng lớn nhất; **recurrence**: công thức truy hồi; **Kadane**: thuật toán Kadane.
