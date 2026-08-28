# 26. Remove Duplicates from Sorted Array — Solution

## 1. Core idea / Intuition

Bài 26 là phiên bản deduplication của pattern **read pointer + write pointer**.

Do mảng đã sort, mọi bản sao của cùng một giá trị nằm liên tiếp. Vì vậy khi đang đọc `nums[read]`, ta chỉ cần so sánh nó với **giá trị unique cuối cùng đã ghi**:

```text
nums[write - 1]
```

Nếu khác nhau, `nums[read]` là một giá trị unique mới.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Mỗi giá trị chỉ được xuất hiện một lần trong prefix kết quả.
- Giữ nguyên thứ tự tương đối.
- Return số giá trị unique `k`.
- `nums[0..k-1]` phải chứa các unique values đã sort.
- Phần sau `k` không quan trọng.

---

## 3. Why sorting changes the problem / Vì sao sorted array quan trọng?

Nếu mảng chưa sort, một giá trị đã gặp có thể xuất hiện lại ở bất kỳ đâu và thường cần `HashSet` để nhận biết.

Nhưng trong mảng sorted:

```text
[0,0,1,1,1,2,2,3]
```

mọi duplicate tạo thành một block liên tiếp. Chỉ cần phát hiện **ranh giới giữa hai giá trị khác nhau**.

Điều này cho phép giải với `O(1)` extra space.

---

## 4. Alternative approaches / Các hướng khác

### Approach A — HashSet

Đưa mọi giá trị vào set, sau đó ghi lại mảng.

```text
Time:  O(n) trung bình
Space: O(n)
```

Không tận dụng việc mảng đã sort và còn có thể phải xử lý thứ tự khi ghi lại.

### Approach B — Xóa/dịch phần tử mỗi khi thấy duplicate

Nếu mỗi duplicate làm ta shift toàn bộ suffix sang trái, worst-case có thể thành:

```text
O(n²)
```

### Approach C — Two pointers

Một lần quét, ghi mỗi unique value đúng một lần:

```text
Time:  O(n)
Space: O(1)
```

---

## 5. Optimal approach / Hướng tối ưu

Phần tử đầu tiên luôn unique vì `nums.length >= 1`:

```java
int write = 1;
```

Sau đó:

```java
for (int read = 1; read < nums.length; read++) {
    if (nums[read] != nums[write - 1]) {
        nums[write++] = nums[read];
    }
}
```

Cuối cùng:

```java
return write;
```

---

## Optimal Java solution

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        // Prefix nums[0..write-1] luôn chứa đúng các giá trị unique đã giữ.
        // Vì phần tử đầu chắc chắn unique, vị trí ghi tiếp theo bắt đầu từ 1.
        int write = 1;

        for (int read = 1; read < nums.length; read++) {
            // Mảng đã sort nên chỉ cần so với unique value cuối cùng đã giữ.
            // Nếu khác, nums[read] chưa thể xuất hiện trong prefix kết quả.
            if (nums[read] != nums[write - 1]) {
                // write không vượt quá read, nên ghi đè tại đây không thể phá dữ liệu chưa đọc.
                nums[write++] = nums[read];
            }
        }

        return write;
    }
}
```

---

## 6. Dry run / Chạy thử

```text
nums = [0,0,1,1,1,2,2,3,3,4]
```

Ban đầu:

```text
write = 1
prefix = [0]
```

| `read` | `nums[read]` | Last unique | Ghi? | Prefix sau bước |
|---:|---:|---:|---|---|
| 1 | 0 | 0 | Không | `[0]` |
| 2 | 1 | 0 | Có | `[0,1]` |
| 3 | 1 | 1 | Không | `[0,1]` |
| 4 | 1 | 1 | Không | `[0,1]` |
| 5 | 2 | 1 | Có | `[0,1,2]` |
| 6 | 2 | 2 | Không | `[0,1,2]` |
| 7 | 3 | 2 | Có | `[0,1,2,3]` |
| 8 | 3 | 3 | Không | `[0,1,2,3]` |
| 9 | 4 | 3 | Có | `[0,1,2,3,4]` |

Kết quả:

```text
k = 5
nums[0..4] = [0,1,2,3,4]
```

---

## 7. Correctness / Vì sao đúng?

Invariant sau khi xử lý tới `read - 1`:

> `nums[0..write-1]` chứa đúng tất cả giá trị unique trong phần input đã xử lý, theo thứ tự tăng không giảm, và `nums[write-1]` là unique value gần nhất.

Nếu `nums[read] == nums[write-1]`, vì mảng đã sort nên đây chỉ là duplicate của giá trị hiện tại và phải bỏ qua.

Nếu khác, `nums[read]` lớn hơn giá trị unique cuối cùng và chưa xuất hiện trong prefix kết quả, nên ghi nó vào `nums[write]` là chính xác.

Sau khi duyệt hết, prefix chứa mỗi unique value đúng một lần.

---

## 8. Complexity / Độ phức tạp

```text
Time:  O(n)
Space: O(1)
```

Mỗi vị trí được đọc một lần; chỉ dùng hai chỉ số logic `read` và `write`.

---

## 9. Edge cases / Trường hợp biên

- Một phần tử → `k = 1`.
- Tất cả giống nhau → chỉ giữ phần tử đầu.
- Không có duplicate → `write` cuối cùng bằng `nums.length`.
- Có số âm → không ảnh hưởng vì thuật toán chỉ dựa vào thứ tự và phép so sánh bằng.
- Duplicate nằm ở đầu/cuối/nhiều block → xử lý giống nhau.

---

## 10. Common mistakes / Lỗi thường gặp

1. Dùng `write = 0` nhưng lại đọc `nums[write - 1]`.
2. Quên rằng constraint đảm bảo mảng không rỗng.
3. So sánh với một giá trị bị ghi đè sai vị trí.
4. Shift mảng mỗi lần gặp duplicate làm tăng độ phức tạp.
5. Dùng `HashSet` dù mảng đã sort và yêu cầu `O(1)` extra space có thể đạt được.
6. Quan tâm phần mảng sau `k`.

---

## 11. Generalization / Khái quát hóa

Bài này có thể viết thành quy tắc:

```text
keep current value if it differs from the last kept value
```

Bài 80 sẽ đổi quy tắc thành:

```text
keep current value if it would not become the third copy
```

Đây là lý do học 26 trước 80 rất hữu ích.

---

## 12. Vocabulary / Từ vựng

| English | Tiếng Việt |
|---|---|
| duplicate | phần tử trùng lặp |
| unique element | phần tử duy nhất |
| relative order | thứ tự tương đối |
| sorted array | mảng đã sắp xếp |
| deduplication | loại trùng |
| last kept value | giá trị cuối đã giữ |
| write pointer | con trỏ ghi |
