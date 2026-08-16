# 74. Search a 2D Matrix — Solution

## 1. Core idea / Intuition
Xem ma trận như một sorted array ảo theo row-major và binary search trực tiếp trên index ảo.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần `O(log(m*n))`, không scan từng hàng.

## 3. Key observations / Nhận xét quan trọng
Vị trí ảo `p` ánh xạ sang row `p/n`, col `p%n`.

## 4. Alternative approaches / Các hướng khác
Binary search chọn hàng rồi binary search trong hàng vẫn logarithmic nhưng phức tạp hơn; flatten ảo gọn hơn.

## 5. Optimal approach / Hướng tối ưu
Inclusive binary search `[0,m*n-1]`, so sánh value tại virtual midpoint với target.

## 6. Java solution overview
```java
class Solution {
  public boolean searchMatrix(int[][] a,int target){
    int m=a.length,n=a[0].length,l=0,r=m*n-1;
    while(l<=r){int p=l+(r-l)/2,v=a[p/n][p%n];if(v==target)return true;if(v<target)l=p+1;else r=p-1;}
    return false;
  }
}
```

## 7. Code explanation / Giải thích code
Không cần tạo mảng flatten thật; phép chia và modulo chỉ tính tọa độ khi cần.

## 8. Dry run / Chạy thử
Target 3 được tìm bằng các midpoint row-major giống binary search một mảng thường.

## 9. Time and space complexity
O(log(m*n)) time, O(1) space.

## 10. Why the algorithm is correct / Vì sao đúng
Ordering giữa và trong các hàng đảm bảo row-major sequence tăng; binary search chuẩn trên sequence ảo vì vậy chính xác.

## 11. Edge cases
Một hàng, một cột, một phần tử, target ngoài range.

## 12. Common mistakes
Chỉ dựa vào row sort mà quên điều kiện giữa hàng; ánh xạ index sai.

## 13. Pattern recognition / Khi nào tái sử dụng
Khi cấu trúc 2D có total order tương thích row-major, có thể binary search mà không materialize.

## 14. Vocabulary
**row-major order**: thứ tự theo hàng; **virtual index**: index ảo; **matrix**: ma trận; **flatten**: làm phẳng.
