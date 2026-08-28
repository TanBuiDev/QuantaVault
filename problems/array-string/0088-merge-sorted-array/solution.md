# 88. Merge Sorted Array — Solution

## 1. Core idea / Intuition

Điểm đặc biệt của bài này là `nums1` đã có đủ chỗ để chứa toàn bộ kết quả:

```text
nums1.length = m + n
```

Nếu merge từ trái sang phải, ta có thể ghi đè lên phần tử hợp lệ của `nums1` trước khi dùng nó. Nhưng nếu merge **từ phải sang trái**, ta luôn ghi vào vùng chưa chứa dữ liệu cần giữ.

Vì cả hai mảng đều đã sort, phần tử lớn nhất còn lại chỉ có thể nằm ở cuối phần chưa xử lý của `nums1` hoặc cuối `nums2`.

Ta dùng ba con trỏ:

```text
i     = m - 1
j     = n - 1
write = m + n - 1
```

Mỗi bước chọn phần tử lớn hơn giữa `nums1[i]` và `nums2[j]`, ghi vào `nums1[write]`, rồi dịch con trỏ tương ứng sang trái.

Kết quả:

```text
Time:  O(m + n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- `nums1[0..m-1]` là dữ liệu hợp lệ ban đầu.
- `nums1[m..m+n-1]` chỉ là vùng trống.
- `nums2[0..n-1]` là dữ liệu cần merge.
- Sau hàm `merge`, toàn bộ `nums1` phải chứa `m + n` phần tử theo thứ tự không giảm.
- Không cần return mảng.

Đề song ngữ đầy đủ nằm trong [`problem.md`](problem.md).

---

## 3. Key observations / Nhận xét quan trọng

### Observation 1 — Hai mảng đã được sắp xếp

Khi hai phần chưa xử lý là:

```text
nums1[0..i]
nums2[0..j]
```

phần tử lớn nhất còn lại chắc chắn là:

```text
max(nums1[i], nums2[j])
```

### Observation 2 — Vùng trống nằm ở cuối `nums1`

Đây là lý do ta nên đi từ cuối về đầu. Vị trí `write` chưa chứa dữ liệu hợp lệ cần bảo toàn.

### Observation 3 — Chỉ cần đảm bảo `nums2` được xử lý hết

Nếu `j < 0`, mọi phần tử của `nums2` đã được đặt đúng vị trí. Nếu lúc đó `i >= 0`, các phần tử còn lại của `nums1` vốn đã nằm đúng thứ tự ở phía đầu mảng.

Ngược lại, nếu `i < 0` nhưng `j >= 0`, ta vẫn phải chép phần còn lại của `nums2` vào `nums1`.

---

## 4. Alternative approaches / Các hướng khác

### Approach A — Mảng phụ

Tạo một mảng mới có độ dài `m + n`, dùng two pointers để merge như bước merge của Merge Sort, sau đó copy kết quả trở lại `nums1`.

```text
Time:  O(m + n)
Space: O(m + n)
```

Cách này dễ hiểu nhưng không tận dụng vùng trống sẵn có trong `nums1`.

### Approach B — Chèn từ trái sang phải

Mỗi khi phần tử từ `nums2` cần đứng trước `nums1[i]`, ta dịch các phần tử `nums1` sang phải để chừa chỗ.

Trong trường hợp xấu nhất, việc dịch mảng lặp lại nhiều lần khiến thời gian có thể lên tới:

```text
O(m * n)
```

### Approach C — Merge từ cuối

Đây là hướng tối ưu:

```text
Time:  O(m + n)
Space: O(1)
```

---

## 5. Optimal approach / Hướng tối ưu

Khởi tạo:

```java
int i = m - 1;
int j = n - 1;
int write = m + n - 1;
```

Trong khi `nums2` còn phần tử:

```java
while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
        nums1[write--] = nums1[i--];
    } else {
        nums1[write--] = nums2[j--];
    }
}
```

Tại sao điều kiện vòng lặp chỉ cần `j >= 0`?

- Nếu `nums2` hết trước: phần còn lại của `nums1` đã ở đúng chỗ.
- Nếu `nums1` hết trước: nhánh `else` tiếp tục chép toàn bộ phần còn lại của `nums2`.

---

## 6. Optimal Java solution

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        // Ghi từ cuối để tận dụng buffer của nums1 mà không ghi đè phần tử hợp lệ chưa đọc.
        int write = m + n - 1;

        // Chỉ cần bảo đảm nums2 được dùng hết: nếu nums2 hết trước,
        // phần nums1 còn lại vốn đã nằm đúng vị trí ở đầu mảng.
        while (j >= 0) {
            // Hai suffix chưa xử lý đều sorted, nên phần tử lớn nhất còn lại
            // phải là nums1[i] hoặc nums2[j] và có thể chốt ngay tại write.
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write--] = nums1[i--];
            } else {
                // Nhánh này cũng xử lý i < 0, khi mọi phần tử còn lại bắt buộc đến từ nums2.
                nums1[write--] = nums2[j--];
            }
        }
    }
}
```

Canonical code nằm trong [`Solution.java`](Solution.java).

---

## 7. Dry run / Chạy thử

Với:

```text
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3
```

Ban đầu:

```text
i = 2 -> 3
j = 2 -> 6
write = 5
```

| Bước | `nums1[i]` | `nums2[j]` | Chọn | Ghi vào | `nums1` sau bước |
|---:|---:|---:|---:|---:|---|
| 1 | 3 | 6 | 6 | 5 | `[1,2,3,0,0,6]` |
| 2 | 3 | 5 | 5 | 4 | `[1,2,3,0,5,6]` |
| 3 | 3 | 2 | 3 | 3 | `[1,2,3,3,5,6]` |
| 4 | 2 | 2 | 2 từ `nums2` | 2 | `[1,2,2,3,5,6]` |

Lúc này `j < 0`, kết thúc. Hai phần tử đầu của `nums1` đã ở đúng vị trí.

---

## 8. Correctness / Vì sao thuật toán đúng?

Ta duy trì invariant sau trước mỗi lần lặp:

> Đoạn `nums1[write+1 .. m+n-1]` đã chứa đúng các phần tử lớn nhất trong toàn bộ phần tử đã xét và chúng nằm đúng thứ tự.

Ở mỗi bước, phần tử lớn nhất chưa được đặt phải là `nums1[i]` hoặc `nums2[j]` vì hai phần chưa xử lý đều đã sort. Ta lấy phần tử lớn hơn và đặt vào `nums1[write]`, nên invariant tiếp tục đúng.

Khi `j < 0`, mọi phần tử của `nums2` đã được đặt. Phần còn lại của `nums1` vẫn giữ nguyên thứ tự ban đầu và nhỏ hơn hoặc bằng đoạn đã hoàn thiện ở phía sau. Vì vậy toàn bộ `nums1` được merge đúng.

---

## 9. Complexity / Độ phức tạp

Mỗi phần tử được xét hoặc ghi nhiều nhất một lần:

```text
Time: O(m + n)
```

Chỉ dùng ba biến con trỏ:

```text
Space: O(1)
```

---

## 10. Edge cases / Trường hợp biên

### `n = 0`

Không cần làm gì. `j = -1` nên vòng lặp không chạy.

### `m = 0`

`i = -1`, mọi phần tử của `nums2` được chép vào `nums1`.

### Tất cả phần tử `nums2` nhỏ hơn `nums1`

Ví dụ:

```text
nums1 = [4,5,6,0,0,0]
nums2 = [1,2,3]
```

Thuật toán trước tiên đưa `6,5,4` về cuối rồi chép `3,2,1` vào đầu.

### Có nhiều giá trị bằng nhau

Không ảnh hưởng tính đúng. Khi bằng nhau, implementation hiện tại chọn phần tử từ `nums2` trước; thứ tự cuối vẫn không giảm.

---

## 11. Common mistakes / Lỗi thường gặp

1. **Merge từ đầu mà không có buffer**, làm mất dữ liệu trong `nums1`.
2. Dùng toàn bộ `nums1.length` như số phần tử hợp lệ ban đầu thay vì `m`.
3. Quên trường hợp `m = 0` hoặc `n = 0`.
4. Dừng khi `i < 0` dù `nums2` vẫn còn phần tử.
5. Copy lại phần dư của `nums1` không cần thiết.
6. Tạo mảng phụ dù bài có thể giải bằng `O(1)` extra space.

---

## 12. Pattern recognition / Nhận diện pattern

Khi thấy các dấu hiệu:

- hai mảng đã sort;
- một mảng có buffer ở cuối;
- yêu cầu in-place;
- cần merge trong thời gian tuyến tính;

hãy nghĩ ngay tới:

```text
Two/Three Pointers + Fill From the Back
```

Đây cũng là tư duy xuất hiện trong Merge Sort, merge linked lists và nhiều bài xử lý sorted sequences.

---

## 13. Vocabulary / Từ vựng

| English | Tiếng Việt |
|---|---|
| non-decreasing order | thứ tự không giảm |
| in-place | tại chỗ, sửa trực tiếp dữ liệu đầu vào |
| merge | gộp |
| pointer | con trỏ/chỉ số theo dõi |
| valid element | phần tử hợp lệ |
| extra space | bộ nhớ phụ |
| overwrite | ghi đè |
| remaining elements | các phần tử còn lại |
