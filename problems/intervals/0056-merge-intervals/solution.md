# 56. Merge Intervals — Solution

## 1. Core idea / Intuition

Nếu các interval đang ở thứ tự bất kỳ, một interval có thể overlap với một interval nằm rất xa trong input. Vì vậy bước quan trọng nhất là **sort theo điểm bắt đầu**. Sau khi sort, ta scan một lần từ trái sang phải và duy trì interval đã merge hiện tại.

Với current interval `[currentStart, currentEnd]` và interval kế tiếp `[nextStart, nextEnd]`:

- nếu `nextStart <= currentEnd`, chúng overlap, nên mở rộng `currentEnd = max(currentEnd, nextEnd)`;
- nếu `nextStart > currentEnd`, current interval đã kết thúc chắc chắn và có thể đưa vào answer.

## 2. Requirement recap / Tóm tắt yêu cầu

Ta phải trả về các interval:

- không overlap nhau;
- bao phủ chính xác union của toàn bộ input intervals;
- các interval chạm nhau tại endpoint cũng được xem là overlap, ví dụ `[1,4]` và `[4,5]` phải thành `[1,5]`.

## 3. Key observations / Nhận xét quan trọng

### Observation 1: Sorting turns a global problem into a local comparison

Sau khi sort theo `start`, nếu interval kế tiếp không overlap với current merged interval thì không interval nào nằm sau nó có thể quay lại overlap với current interval nữa, vì các `start` phía sau chỉ lớn hơn hoặc bằng `nextStart`.

### Observation 2: The merged end is the maximum end seen in the current group

Khi overlap, ta không cộng hoặc thay thế đơn giản `end`; phải lấy:

```java
currentEnd = Math.max(currentEnd, nextEnd);
```

Điều này xử lý đúng nested intervals như `[1,10]` và `[2,3]`.

### Observation 3: Endpoint touching counts as overlap

Điều kiện phải là:

```text
nextStart <= currentEnd
```

không phải `<`.

## 4. Alternative approaches / Hướng khác

### Brute-force repeated merging

Có thể liên tục tìm bất kỳ hai interval overlap, merge chúng rồi lặp lại cho đến khi không còn overlap. Cách này khó quản lý và có thể tốn khoảng `O(n^2)` hoặc hơn tùy implementation.

### Sort + sweep

Đây là hướng chuẩn và tối ưu thực tế:

```text
sort by start -> sweep once -> merge locally
```

Sorting chi phối complexity: `O(n log n)`.

## 5. Optimal approach

1. Sort `intervals` theo `start` tăng dần.
2. Khởi tạo `currentStart`, `currentEnd` từ interval đầu tiên.
3. Với từng interval tiếp theo:
   - nếu overlap, mở rộng `currentEnd`;
   - nếu không overlap, add current interval vào result rồi reset current interval.
4. Sau loop, add current interval cuối cùng.
5. Chuyển `List<int[]>` thành `int[][]`.

## 6. Java solution overview

```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

List<int[]> merged = new ArrayList<>();
int currentStart = intervals[0][0];
int currentEnd = intervals[0][1];

for (int i = 1; i < intervals.length; i++) {
    int nextStart = intervals[i][0];
    int nextEnd = intervals[i][1];

    if (nextStart <= currentEnd) {
        currentEnd = Math.max(currentEnd, nextEnd);
    } else {
        merged.add(new int[]{currentStart, currentEnd});
        currentStart = nextStart;
        currentEnd = nextEnd;
    }
}

merged.add(new int[]{currentStart, currentEnd});
return merged.toArray(new int[merged.size()][]);
```

## 7. Code explanation / Giải thích code

### Sort

```java
Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
```

Sort theo start để mọi interval có khả năng nối tiếp current group xuất hiện theo thứ tự phù hợp.

Dùng `Integer.compare` thay vì `a[0] - b[0]` là thói quen an toàn hơn vì tránh overflow trong các bài có miền integer lớn.

### Merge condition

```java
if (nextStart <= currentEnd)
```

Nếu start của interval mới chưa vượt qua end hiện tại, hai interval có ít nhất một điểm chung.

### Close a group

```java
merged.add(new int[]{currentStart, currentEnd});
```

Chỉ khi `nextStart > currentEnd` ta mới biết current merged interval không thể mở rộng thêm bởi bất kỳ interval nào phía sau.

## 8. Dry run

Input:

```text
[[1,3],[2,6],[8,10],[15,18]]
```

Sau sort vẫn là:

```text
[[1,3],[2,6],[8,10],[15,18]]
```

Start:

```text
current = [1,3]
answer = []
```

Xét `[2,6]`:

```text
2 <= 3 -> overlap
current = [1,6]
```

Xét `[8,10]`:

```text
8 > 6 -> no overlap
answer = [[1,6]]
current = [8,10]
```

Xét `[15,18]`:

```text
15 > 10 -> no overlap
answer = [[1,6],[8,10]]
current = [15,18]
```

Flush cuối:

```text
[[1,6],[8,10],[15,18]]
```

## 9. Time and space complexity

```text
Time: O(n log n)
```

- sort: `O(n log n)`;
- scan: `O(n)`.

```text
Space: O(n) including output
```

Result có thể chứa `n` intervals khi tất cả disjoint. Java's object-array sort may also use auxiliary workspace depending on implementation; complexity statement here treats the returned result as part of total working storage.

## 10. Why the algorithm is correct / Vì sao đúng

Sau khi sort theo start, duy trì invariant:

> Trước mỗi iteration, `[currentStart, currentEnd]` là union đã merge hoàn chỉnh của một nhóm interval liên tiếp trong prefix đã xử lý nhưng chưa được output.

Nếu `nextStart <= currentEnd`, interval mới overlap current group nên union mới vẫn là một interval duy nhất `[currentStart, max(currentEnd, nextEnd)]`.

Nếu `nextStart > currentEnd`, interval mới không overlap current group. Vì input đã sort theo start, mọi interval còn lại cũng có start `>= nextStart > currentEnd`, nên không interval tương lai nào có thể overlap current group. Vì vậy output current group lúc này là an toàn và final.

Sau loop, current group cuối cùng chưa được output nên ta flush nó. Mỗi input interval được gộp vào đúng một output interval và mọi output interval pair đều disjoint.

## 11. Edge cases

- Chỉ có một interval: `[[1,2]]`.
- Tất cả intervals disjoint.
- Tất cả intervals overlap thành một interval.
- Nested intervals: `[[1,10],[2,3],[4,8]]`.
- Touching endpoints: `[[1,4],[4,5]]`.
- Input chưa sort: `[[4,7],[1,4]]`.
- Nhiều interval có cùng start.

## 12. Common mistakes / Lỗi thường gặp

- Không sort trước khi sweep.
- Dùng `nextStart < currentEnd` và bỏ sót touching intervals.
- Khi overlap lại gán `currentEnd = nextEnd` thay vì `max`.
- Quên flush current interval cuối cùng.
- Add reference của input interval rồi mutate nó không chủ ý.
- Chỉ so interval mới với interval gốc gần nhất thay vì current merged interval.

## 13. Pattern recognition / Khi nào tái sử dụng

Pattern **Sort Then Sweep** thường xuất hiện khi:

- cần merge intervals;
- tìm số phòng họp / số segment đang active;
- tính union của ranges;
- xác định gaps giữa intervals;
- xử lý scheduling sau khi sắp xếp theo thời điểm bắt đầu hoặc kết thúc.

Dấu hiệu mạnh: input là các ranges không đảm bảo thứ tự và yêu cầu liên quan đến overlap hoặc union.

## 14. Vocabulary and algorithmic terminology

- **interval**: khoảng.
- **overlap**: chồng lấn.
- **non-overlapping**: không chồng lấn.
- **endpoint**: đầu mút của interval.
- **sort by start**: sắp xếp theo điểm bắt đầu.
- **sweep / scan**: quét tuần tự.
- **current merged interval**: interval hiện tại sau khi đã gộp.
- **nested interval**: interval nằm hoàn toàn bên trong interval khác.
- **invariant**: tính chất luôn đúng trong quá trình thuật toán chạy.
- **flush**: đưa trạng thái/current group cuối cùng vào output trước khi kết thúc.
