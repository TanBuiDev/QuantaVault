# 452. Minimum Number of Arrows to Burst Balloons — Solution

## 1. Core idea / Intuition

Mỗi balloon là một interval `[xstart, xend]`. Một arrow tại `x` bắn vỡ tất cả balloon có interval chứa `x`. Vì vậy ta cần chọn ít điểm `x` nhất sao cho mỗi interval chứa ít nhất một điểm được chọn.

Greedy chuẩn là **sort theo `xend` tăng dần**. Với balloon kết thúc sớm nhất, nếu ta cần một arrow mới thì vị trí tốt nhất là chính `xend` của nó: đây là điểm xa nhất về bên phải nhưng vẫn chắc chắn bắn được balloon hiện tại, đồng thời tối đa hóa cơ hội arrow đó cũng nằm trong các balloon phía sau.

## 2. Requirement recap / Tóm tắt yêu cầu

- Mỗi arrow là một tọa độ `x`.
- Balloon `[start,end]` bị bắn nếu `start <= x <= end`.
- Một arrow có thể bắn nhiều balloon.
- Cần số arrow nhỏ nhất để cover toàn bộ intervals.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Earliest end is the restrictive balloon

Balloon có end nhỏ nhất sẽ hết vùng hợp lệ sớm nhất. Nếu ta chưa có arrow nào cover nó, ta buộc phải đặt một arrow không lớn hơn end đó.

### Observation 2: Place the arrow at the earliest end

Đặt arrow tại chính `xend` của balloon đó là lựa chọn greedy tốt nhất vì không làm mất khả năng bắn balloon hiện tại, đồng thời đặt arrow xa sang phải nhất có thể.

### Observation 3: Reuse while `start <= arrowX`

Sau khi sort theo end, nếu balloon tiếp theo có:

```text
start <= arrowX
```

thì arrow hiện tại đã nằm trong interval đó. Không cần quan tâm end của nó vì end hiện tại không nhỏ hơn `arrowX` theo thứ tự sort và định nghĩa interval.

## 4. Alternative approaches / Hướng khác

### Merge intervals first

Có thể merge các balloon overlap rồi đếm nhóm, nhưng việc merge theo union không trực tiếp tương đương với minimum stabbing points trong mọi cách triển khai nếu không giữ đúng giao của nhóm. Greedy by end đơn giản và trực tiếp hơn.

### Try every possible point

Không khả thi vì coordinate range lớn và không cần thiết.

### Greedy by start

Sort theo start không cho ta một vị trí arrow tối ưu rõ ràng; chọn quá sớm có thể làm mất cơ hội cover nhiều interval phía sau.

## 5. Optimal approach

1. Sort `points` theo `end` tăng dần.
2. Đặt arrow đầu tiên tại `points[0][1]`.
3. Scan từ interval thứ hai:
   - nếu `points[i][0] <= arrowX`, balloon đã được current arrow cover;
   - nếu `points[i][0] > arrowX`, cần arrow mới tại `points[i][1]`.
4. Trả về số arrow.

## 6. Java solution overview

```java
Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

int arrows = 1;
int arrowX = points[0][1];

for (int i = 1; i < points.length; i++) {
    if (points[i][0] > arrowX) {
        arrows++;
        arrowX = points[i][1];
    }
}

return arrows;
```

## 7. Code explanation / Giải thích code

### Safe comparator

Dùng:

```java
Integer.compare(a[1], b[1])
```

thay vì `a[1] - b[1]` để tránh integer overflow khi endpoint nằm gần hai biên của `int`.

### Why strict `>` creates a new arrow

Nếu `start == arrowX`, arrow vẫn nằm trên endpoint của balloon và balloon bị bắn vì điều kiện là inclusive. Do đó chỉ `start > arrowX` mới thực sự không được cover.

## 8. Dry run

Input:

```text
[[10,16],[2,8],[1,6],[7,12]]
```

Sort theo end:

```text
[[1,6],[2,8],[7,12],[10,16]]
```

Start:

```text
arrows = 1
arrowX = 6
```

`[2,8]`:

```text
2 <= 6 -> current arrow covers it
```

`[7,12]`:

```text
7 > 6 -> new arrow
arrows = 2
arrowX = 12
```

`[10,16]`:

```text
10 <= 12 -> current arrow covers it
```

Answer = `2`.

## 9. Time and space complexity

```text
Time: O(n log n)
```

Sort chi phối; scan chỉ `O(n)`.

```text
Space: O(n) worst-case Java sort workspace
```

State của greedy ngoài sorting chỉ `O(1)`. `int[][]` trong Java là object array, nên implementation của object sorting có thể cần auxiliary workspace.

## 10. Why the algorithm is correct / Vì sao đúng

Xét balloon chưa được cover có end nhỏ nhất. Bất kỳ lời giải hợp lệ nào cũng phải có một arrow tại một điểm `x <= end` và `x >= start` để bắn balloon đó.

Nếu lời giải tối ưu đặt arrow tại một điểm `x < end`, ta có thể dịch arrow đó sang `end`. Balloon hiện tại vẫn bị bắn. Với mọi balloon phía sau mà arrow cũ `x` bắn được và có start không lớn hơn `x`, vì chúng có end không nhỏ hơn current `end` sau sorting, việc dịch sang `end` vẫn không làm mất khả năng cover những balloon có start `<= end`. Vì vậy tồn tại một lời giải tối ưu đặt arrow tại earliest end.

Sau đó mọi balloon chứa `arrowX` được cover miễn phí. Balloon đầu tiên có `start > arrowX` không thể bị arrow hiện tại cover, nên cần một arrow mới; áp dụng cùng lập luận greedy cho suffix còn lại. Do đó thuật toán dùng số arrow tối thiểu.

## 11. Edge cases

- Chỉ một balloon.
- Tất cả balloons pairwise disjoint.
- Tất cả balloons cùng có một điểm chung.
- Touching endpoints như `[1,2]` và `[2,3]`.
- Nested intervals.
- Endpoint âm.
- Endpoint gần `Integer.MIN_VALUE` / `Integer.MAX_VALUE`.

## 12. Common mistakes / Lỗi thường gặp

- Sort theo start thay vì end rồi dùng greedy không đúng.
- Dùng comparator `a[1] - b[1]` và có nguy cơ overflow.
- Dùng `start >= arrowX` để tạo arrow mới, sai với touching endpoints.
- Cập nhật `arrowX` khi balloon vẫn được cover, làm giảm chất lượng greedy.
- Nhầm bài này với merge intervals và đếm merged unions một cách máy móc.

## 13. Pattern recognition / Khi nào tái sử dụng

Pattern **sort by end + greedy selection** xuất hiện trong:

- activity selection;
- maximum number of non-overlapping intervals;
- minimum points to cover intervals;
- interval scheduling;
- chọn deadline/endpoint sớm nhất để giữ nhiều lựa chọn cho tương lai.

Dấu hiệu: cần chọn ít tài nguyên/điểm nhất để cover intervals hoặc chọn nhiều intervals không xung đột nhất.

## 14. Vocabulary and algorithmic terminology

- **balloon interval**: khoảng ngang của balloon.
- **arrow position**: vị trí `x` của mũi tên.
- **earliest ending interval**: interval kết thúc sớm nhất.
- **greedy choice**: lựa chọn tham lam.
- **cover / burst**: bao phủ / bắn vỡ.
- **inclusive endpoint**: endpoint được tính vào interval.
- **interval stabbing**: chọn các điểm để chạm/cover mọi interval.
- **exchange argument**: lập luận hoán đổi để chứng minh greedy tối ưu.
