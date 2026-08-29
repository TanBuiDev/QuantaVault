# 80. Remove Duplicates from Sorted Array II — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Sorted array cho phép mỗi value xuất hiện tối đa hai lần; với [1,1,1,2,2,3], prefix hợp lệ cần thành [1,1,2,2,3]. Ta chỉ cần biết candidate có bằng phần tử cách write hai vị trí không.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Đếm frequency bằng map là thừa và tốn space. Quan sát vì output prefix đã sorted, nếu write<2 luôn giữ; sau đó nums[write-2] là giá trị mà candidate sẽ tạo lần xuất hiện thứ ba nếu bằng nó.

**State / invariant / data structure cần hiểu trước code.** write là độ dài prefix hợp lệ. Invariant: nums[0..write) sorted và không value nào xuất hiện hơn hai lần; candidate được ghi chỉ khi write<2 hoặc candidate != nums[write-2].

**Dry run mental theo implementation.** Dry run [1,1,1,2]: hai số 1 đầu được ghi; số 1 thứ ba bằng nums[0] nên bỏ; 2 khác nums[0] nên ghi tại write=2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng nums[write-1] khiến chỉ giữ một copy. Khi nào dùng: sorted array cho phép tối đa k duplicates thường tổng quát thành candidate != nums[write-k].
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Intuition

Bài này là bước tổng quát hóa tự nhiên từ bài 26.

Bài 26 yêu cầu mỗi giá trị xuất hiện tối đa **1** lần. Bài 80 cho phép tối đa **2** lần.

Ta vẫn dùng write pointer. Câu hỏi duy nhất là:

> Khi nào phần tử hiện tại được phép ghi vào prefix kết quả?

Nếu đã ghi ít hơn hai phần tử thì luôn giữ. Nếu đã ghi ít nhất hai phần tử, ta so sánh với phần tử cách vị trí ghi hai ô:

```text
nums[write - 2]
```

Nếu giá trị hiện tại bằng giá trị đó, giữ thêm nó sẽ tạo bản sao thứ ba. Nếu khác, nó vẫn hợp lệ.

Rule:

```text
write < 2 || num != nums[write - 2]
```

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Input đã sort.
- Mỗi unique value được xuất hiện tối đa 2 lần trong kết quả.
- Giữ relative order.
- Sửa trực tiếp `nums`.
- Return logical length `k`.
- Dữ liệu sau `k` không quan trọng.

---

## 3. From problem 26 to problem 80 / Từ bài 26 sang bài 80

Bài 26:

```text
keep if current != last kept value
```

Có thể nhìn dưới dạng giới hạn `r = 1`:

```text
keep if write < 1 OR current != nums[write - 1]
```

Bài 80 có `r = 2`:

```text
keep if write < 2 OR current != nums[write - 2]
```

General form cho sorted array:

```text
allow at most r copies
keep if write < r OR current != nums[write - r]
```

Đây là insight quan trọng hơn việc học thuộc code.

---

## 4. Why `nums[write - 2]` works / Vì sao so với phần tử cách 2 vị trí?

Prefix đã ghi luôn hợp lệ và vẫn sorted.

Nếu `nums[write - 2] == current`, vì prefix sorted nên hai vị trí:

```text
write - 2
write - 1
```

đều đã chứa `current`. Ghi thêm `current` sẽ tạo bản sao thứ ba.

Nếu khác, trong hai vị trí gần nhất không thể đã có hai bản sao của `current`, nên giữ current vẫn không vượt quá giới hạn 2.

---

## 5. Alternative approaches / Các hướng khác

### Approach A — Count occurrences explicitly

Có thể giữ `previousValue` và `count`, reset count khi giá trị thay đổi.

Cũng đạt:

```text
Time:  O(n)
Space: O(1)
```

Nhưng nhiều state hơn và khó generalize đẹp bằng write-pointer rule.

### Approach B — Shift khi gặp bản sao thứ ba

Dịch toàn bộ suffix sang trái mỗi lần gặp phần tử thừa có thể dẫn tới `O(n²)`.

### Approach C — Generic write-pointer rule

Ngắn, trực tiếp, giữ invariant rõ ràng và mở rộng được cho `r` bản sao.

---

## 6. Optimal Java solution

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        // Prefix nums[0..write-1] luôn là kết quả hợp lệ: sorted và mỗi giá trị xuất hiện tối đa 2 lần.
        int write = 0;

        for (int num : nums) {
            // Hai phần tử đầu luôn có thể giữ. Sau đó, nếu num == nums[write-2],
            // sorted order bảo đảm prefix đã có hai bản sao của num; giữ thêm sẽ tạo bản sao thứ ba.
            if (write < 2 || num != nums[write - 2]) {
                nums[write++] = num;
            }
        }

        return write;
    }
}
```

Canonical code: [`Solution.java`](Solution.java).

---

## 7. Dry run / Chạy thử

```text
nums = [0,0,1,1,1,1,2,3,3]
```

| Current | `write` trước | `nums[write-2]` khi có | Giữ? | Prefix |
|---:|---:|---:|---|---|
| 0 | 0 | — | Có | `[0]` |
| 0 | 1 | — | Có | `[0,0]` |
| 1 | 2 | 0 | Có | `[0,0,1]` |
| 1 | 3 | 0 | Có | `[0,0,1,1]` |
| 1 | 4 | 1 | Không | `[0,0,1,1]` |
| 1 | 4 | 1 | Không | `[0,0,1,1]` |
| 2 | 4 | 1 | Có | `[0,0,1,1,2]` |
| 3 | 5 | 1 | Có | `[0,0,1,1,2,3]` |
| 3 | 6 | 2 | Có | `[0,0,1,1,2,3,3]` |

Kết quả `k = 7`.

---

## 8. Correctness / Vì sao đúng?

Invariant:

> Sau mỗi phần tử đã đọc, `nums[0..write-1]` là prefix hợp lệ, sorted, giữ relative order và không có giá trị nào xuất hiện quá hai lần.

- Nếu `write < 2`, giữ phần tử không thể vi phạm giới hạn.
- Nếu `write >= 2` và `num == nums[write-2]`, prefix sorted đảm bảo đã có hai bản sao của `num` ở cuối vùng liên quan; bỏ qua là bắt buộc.
- Nếu `num != nums[write-2]`, giữ `num` không thể tạo bản sao thứ ba.

Mỗi quyết định giữ/bỏ đều đúng, nên invariant đúng tới cuối mảng.

---

## 9. Complexity / Độ phức tạp

Mỗi input element được đọc một lần:

```text
Time: O(n)
```

Chỉ dùng `write` và biến lặp:

```text
Space: O(1)
```

---

## 10. Edge cases / Trường hợp biên

- Một phần tử → giữ nguyên.
- Hai phần tử giống nhau → giữ cả hai.
- Nhiều phần tử giống nhau → chỉ giữ hai.
- Mọi giá trị đã xuất hiện tối đa hai lần → return `nums.length`.
- Có số âm hoặc zero → không ảnh hưởng.

---

## 11. Common mistakes / Lỗi thường gặp

1. So sánh với `nums[write - 1]` như bài 26, vô tình chỉ cho phép một bản sao.
2. Dùng `nums[read - 2]` thay vì prefix đã được compact; khi có nhiều duplicate điều này không biểu diễn số bản sao đã giữ.
3. Quên điều kiện `write < 2`, gây index âm.
4. Dùng cấu trúc đếm phụ dù sorted property cho phép `O(1)` space.
5. Quan tâm dữ liệu sau `k`.

---

## 12. Pattern recognition / Nhận diện pattern

Pattern tổng quát:

```text
Sorted Array + Keep At Most R Copies
```

Canonical rule:

```text
write < R || current != nums[write - R]
```

Đây là một pattern interview rất đáng nhớ vì từ một bài cụ thể có thể suy ra cả họ bài toán bounded duplicates.

---

## 13. Vocabulary / Từ vựng

| English | Tiếng Việt |
|---|---|
| at most twice | tối đa hai lần |
| bounded duplicates | duplicate có giới hạn |
| occurrence count | số lần xuất hiện |
| compacted prefix | prefix đã được nén |
| third copy | bản sao thứ ba |
| generalize | tổng quát hóa |
