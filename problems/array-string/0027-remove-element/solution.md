# 27. Remove Element — Solution

## 1. Core idea / Intuition

Bài không yêu cầu thu nhỏ mảng Java. Nó chỉ yêu cầu:

```text
nums[0 .. k-1]
```

phải chứa các phần tử khác `val`.

Vì vậy ta có thể xem đây là bài **lọc/compact mảng tại chỗ**. Dùng một con trỏ `write` chỉ vị trí tiếp theo cần ghi. Ta đọc từng phần tử ban đầu; nếu phần tử đó cần giữ thì ghi nó vào `nums[write]`.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Loại mọi giá trị bằng `val` khỏi phần kết quả hợp lệ.
- Trả về số phần tử còn lại `k`.
- Chỉ `k` phần tử đầu của `nums` có ý nghĩa sau khi hàm kết thúc.
- Phần tử sau `k` không cần xóa hoặc đặt về giá trị đặc biệt.
- Thứ tự kết quả không bắt buộc, nhưng lời giải chuẩn ở đây **giữ nguyên relative order** vì đơn giản và dễ giải thích.

---

## 3. Key observations / Nhận xét quan trọng

### Observation 1 — Không cần delete thật sự

Mảng Java có kích thước cố định. Ta chỉ cần ghi đè prefix đầu bằng các phần tử hợp lệ.

### Observation 2 — `write` cũng chính là số phần tử đã giữ

Ban đầu:

```text
write = 0
```

Mỗi khi gặp `num != val`:

```java
nums[write] = num;
write++;
```

Do đó sau khi duyệt xong:

```text
write == k
```

### Observation 3 — Ghi đè là an toàn

`write` không bao giờ vượt quá số phần tử đã đọc. Vì vậy ta không thể ghi vào một vị trí nằm phía trước `read` theo cách làm mất một phần tử chưa đọc.

---

## 4. Alternative approaches / Các hướng khác

### Approach A — Tạo mảng/list phụ

Thu thập mọi phần tử khác `val` vào cấu trúc mới rồi copy trở lại.

```text
Time:  O(n)
Space: O(n)
```

Đúng nhưng không đạt mục tiêu in-place.

### Approach B — Swap với phần tử cuối

Dùng một con trỏ ở cuối. Khi thấy `nums[i] == val`, thay nó bằng một phần tử ở cuối vùng chưa xử lý và giảm kích thước logic.

Ưu điểm:

- Có thể giảm số lần ghi khi `val` xuất hiện ít.
- Không cần giữ thứ tự.

Nhược điểm:

- Logic khó đọc hơn.
- Kết quả thay đổi thứ tự.

Vẫn có thể đạt `O(n)` time và `O(1)` space.

### Approach C — Write pointer

Đây là hướng canonical trong repo vì trực quan, ổn định và dễ tái sử dụng cho các bài compaction khác.

---

## 5. Optimal approach / Hướng tối ưu

```java
int write = 0;

for (int num : nums) {
    if (num != val) {
        nums[write++] = num;
    }
}

return write;
```

Interpretation:

- vòng `for` là read pointer;
- `write` là write pointer;
- mọi phần tử hợp lệ được copy đúng một lần vào prefix kết quả.

---

## Optimal Java solution

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        // write vừa là vị trí ghi tiếp theo, vừa là số phần tử hợp lệ đã giữ.
        // Prefix nums[0..write-1] luôn chỉ chứa các giá trị khác val.
        int write = 0;

        for (int num : nums) {
            if (num != val) {
                // write không thể vượt số phần tử đã đọc, nên compact tại chỗ
                // không làm mất phần tử nào mà vòng lặp chưa quan sát.
                nums[write++] = num;
            }
        }

        return write;
    }
}
```

---

## 6. Dry run / Chạy thử

```text
nums = [0,1,2,2,3,0,4,2]
val = 2
```

| Đọc | Giá trị | Giữ? | `write` sau bước | Prefix hợp lệ |
|---:|---:|---|---:|---|
| 0 | 0 | Có | 1 | `[0]` |
| 1 | 1 | Có | 2 | `[0,1]` |
| 2 | 2 | Không | 2 | `[0,1]` |
| 3 | 2 | Không | 2 | `[0,1]` |
| 4 | 3 | Có | 3 | `[0,1,3]` |
| 5 | 0 | Có | 4 | `[0,1,3,0]` |
| 6 | 4 | Có | 5 | `[0,1,3,0,4]` |
| 7 | 2 | Không | 5 | `[0,1,3,0,4]` |

Kết quả:

```text
k = 5
nums[0..4] = [0,1,3,0,4]
```

LeetCode chấp nhận vì thứ tự không bắt buộc.

---

## 7. Correctness / Vì sao thuật toán đúng?

Invariant sau khi đã đọc `r` phần tử:

> `nums[0..write-1]` chứa chính xác các phần tử khác `val` trong `r` phần tử đã đọc, theo đúng thứ tự xuất hiện.

- Nếu phần tử hiện tại bằng `val`, ta bỏ qua; invariant không đổi.
- Nếu khác `val`, ta ghi nó vào vị trí `write`; prefix kết quả được mở rộng thêm đúng một phần tử hợp lệ.

Sau khi đọc toàn bộ mảng, prefix `nums[0..write-1]` chứa tất cả và chỉ các phần tử khác `val`. Vì vậy `write` chính là `k` cần trả về.

---

## 8. Complexity / Độ phức tạp

Ta đọc mỗi phần tử đúng một lần:

```text
Time: O(n)
```

Chỉ dùng một biến `write`:

```text
Space: O(1)
```

---

## 9. Edge cases / Trường hợp biên

- `nums = []` → trả `0`.
- Tất cả phần tử bằng `val` → trả `0`.
- Không phần tử nào bằng `val` → trả `nums.length`.
- `val` xuất hiện liên tiếp nhiều lần → chỉ bỏ qua, không có logic đặc biệt.
- `val` có thể lớn hơn mọi `nums[i]` → toàn bộ mảng được giữ nguyên.

---

## 10. Common mistakes / Lỗi thường gặp

1. Cố xóa phần tử và thay đổi độ dài mảng Java.
2. Quan tâm tới dữ liệu sau index `k - 1` dù judge bỏ qua nó.
3. Tăng `write` cả khi gặp `val`.
4. Return `nums.length` thay vì số phần tử được giữ.
5. Tạo list phụ dù không cần.
6. Nhầm bài này với bài yêu cầu giữ thứ tự bắt buộc; ở đây thứ tự có thể thay đổi.

---

## 11. Pattern recognition / Nhận diện pattern

Pattern cốt lõi:

```text
Read Pointer + Write Pointer = In-place Compaction
```

Khi đề yêu cầu:

- remove/filter một số phần tử;
- giữ kết quả ở đầu mảng;
- return logical length;
- không cần thu nhỏ mảng vật lý;

hãy nghĩ tới write pointer.

Pattern này dẫn trực tiếp tới bài 26 và 80.

---

## 12. Vocabulary / Từ vựng

| English | Tiếng Việt |
|---|---|
| occurrence | lần xuất hiện |
| in-place | tại chỗ |
| prefix | đoạn đầu mảng |
| logical length | độ dài logic |
| write pointer | con trỏ ghi |
| compact | nén/gom phần tử hợp lệ |
| remaining elements | các phần tử còn lại |
| relative order | thứ tự tương đối |
