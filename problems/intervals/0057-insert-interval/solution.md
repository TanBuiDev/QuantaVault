# 57. Insert Interval — Solution

## 1. Core idea / Intuition

Vì `intervals` đã **sorted theo start** và **không overlap**, ta không cần sort lại. Chỉ cần scan một lần theo ba phase:

1. Add tất cả interval nằm hoàn toàn trước `newInterval`.
2. Merge tất cả interval overlap với `newInterval` thành một interval duy nhất.
3. Add phần còn lại nằm hoàn toàn sau interval đã merge.

Đây là điểm khác quan trọng so với bài 56. Merge Intervals: bài 56 phải sort input trước; bài 57 đã cho sẵn cấu trúc sorted + non-overlapping nên có thể giải `O(n)`.

## 2. Requirement recap / Tóm tắt yêu cầu

Sau khi chèn `newInterval`, kết quả phải:

- vẫn sorted theo start;
- không có interval overlap;
- bao phủ đúng toàn bộ các interval cũ cộng với `newInterval`.

Hai interval có chung endpoint được xem là overlap.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Intervals before the new interval are already final

Nếu:

```text
intervals[i][1] < newStart
```

thì interval hiện tại nằm hoàn toàn bên trái `newInterval` và không thể merge với nó.

### Observation 2: Overlap can form one continuous block

Do input sorted và non-overlapping, khi bắt đầu gặp overlap với `newInterval`, các interval cần merge sẽ xuất hiện liên tiếp.

Trong phase này:

```java
mergedStart = Math.min(mergedStart, intervals[i][0]);
mergedEnd = Math.max(mergedEnd, intervals[i][1]);
```

### Observation 3: After the overlap block, everything else is final

Khi gặp:

```text
intervals[i][0] > mergedEnd
```

thì interval đó và mọi interval phía sau đều nằm bên phải merged interval.

## 4. Alternative approaches / Hướng khác

Có thể append `newInterval` vào input rồi dùng lại solution của bài 56: sort tất cả và merge. Cách đó đúng nhưng tốn `O(n log n)` và bỏ phí điều kiện input đã sorted/non-overlapping.

Hướng tối ưu là three-phase scan `O(n)`.

## 5. Optimal approach

Giữ index `i` và hai biến `mergedStart`, `mergedEnd`.

### Phase 1 — before

```java
while (i < n && intervals[i][1] < mergedStart) {
    result.add(intervals[i]);
    i++;
}
```

### Phase 2 — overlap

```java
while (i < n && intervals[i][0] <= mergedEnd) {
    mergedStart = Math.min(mergedStart, intervals[i][0]);
    mergedEnd = Math.max(mergedEnd, intervals[i][1]);
    i++;
}
```

Sau đó add đúng một merged interval.

### Phase 3 — after

Add toàn bộ phần còn lại.

## 6. Java solution overview

```java
List<int[]> result = new ArrayList<>();
int i = 0;
int mergedStart = newInterval[0];
int mergedEnd = newInterval[1];

while (i < intervals.length && intervals[i][1] < mergedStart) {
    result.add(intervals[i]);
    i++;
}

while (i < intervals.length && intervals[i][0] <= mergedEnd) {
    mergedStart = Math.min(mergedStart, intervals[i][0]);
    mergedEnd = Math.max(mergedEnd, intervals[i][1]);
    i++;
}

result.add(new int[]{mergedStart, mergedEnd});

while (i < intervals.length) {
    result.add(intervals[i]);
    i++;
}
```

## 7. Code explanation / Giải thích code

Điều kiện phase 1 dùng `<`, không dùng `<=`, vì nếu old interval kết thúc đúng tại `newStart` thì hai interval có chung endpoint và phải merge.

Điều kiện phase 2 dùng:

```text
interval.start <= mergedEnd
```

Trong lúc merge, `mergedEnd` có thể tăng, nên một interval vốn không overlap trực tiếp với `newInterval` ban đầu vẫn có thể overlap với merged interval đã mở rộng.

## 8. Dry run

Input:

```text
intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]
newInterval = [4,8]
```

Phase 1:

```text
[1,2] nằm trước -> result = [[1,2]]
```

Phase 2:

```text
[3,5] overlap -> merged = [3,8]
[6,7] overlap -> merged = [3,8]
[8,10] overlap -> merged = [3,10]
```

Add merged:

```text
result = [[1,2],[3,10]]
```

Phase 3:

```text
add [12,16]
```

Kết quả:

```text
[[1,2],[3,10],[12,16]]
```

## 9. Time and space complexity

```text
Time: O(n)
Space: O(n) including output
```

Mỗi interval được xét tối đa một lần. Nếu không tính output, state bổ sung chỉ là `O(1)`.

## 10. Why the algorithm is correct / Vì sao đúng

Phase 1 chỉ output các interval có end nhỏ hơn `mergedStart`, nên chúng chắc chắn không overlap với interval mới.

Phase 2 xử lý toàn bộ block interval có start không vượt quá `mergedEnd`. Mỗi lần merge lấy min start và max end nên merged interval luôn biểu diễn chính xác union của `newInterval` và các interval overlap đã thấy.

Khi phase 2 dừng, interval kế tiếp có start lớn hơn `mergedEnd`. Do input sorted, mọi interval phía sau cũng bắt đầu còn muộn hơn, nên không thể overlap merged interval. Vì vậy merged interval có thể được output và phần còn lại giữ nguyên.

## 11. Edge cases

- `intervals` rỗng.
- `newInterval` nằm trước tất cả interval.
- `newInterval` nằm sau tất cả interval.
- `newInterval` nằm giữa hai interval và không overlap.
- `newInterval` bao phủ nhiều interval liên tiếp.
- `newInterval` nằm hoàn toàn trong một interval cũ.
- Touching endpoints như `[1,2]` và `[2,3]`.

## 12. Common mistakes / Lỗi thường gặp

- Sort lại input dù không cần thiết.
- Phase 1 dùng `interval.end <= newStart`, khiến touching intervals không merge.
- Chỉ kiểm tra overlap với `newInterval` ban đầu thay vì `mergedEnd` đang mở rộng.
- Add `newInterval` nhiều lần trong overlap loop.
- Quên trường hợp input rỗng.
- Mutate `newInterval` khi không cần thiết, làm side effect khó kiểm soát.

## 13. Pattern recognition / Khi nào tái sử dụng

Three-phase interval scan phù hợp khi:

- input intervals đã sorted;
- intervals ban đầu non-overlapping;
- cần insert/merge một range mới;
- muốn giữ linear time mà không sort lại.

Pattern tổng quát:

```text
before -> overlap/merge -> after
```

## 14. Vocabulary and algorithmic terminology

- **insert interval**: chèn một khoảng.
- **non-overlapping intervals**: các khoảng không chồng lấn.
- **sorted by start**: sắp xếp theo điểm bắt đầu.
- **overlap block**: nhóm interval overlap liên tiếp.
- **merged boundary**: biên của interval sau merge.
- **three-phase scan**: quét ba giai đoạn.
- **linear scan**: quét tuyến tính.
- **in-place**: chỉnh sửa trực tiếp trên input.
