# 169. Majority Element — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Majority element xuất hiện hơn n/2 lần, nên nếu ghép mỗi occurrence của majority với một phần tử khác để triệt tiêu, cuối cùng majority vẫn còn ít nhất một đại diện.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Map frequency dùng O(n) space, sort dùng O(n log n). Quan sát phép cancel cặp khác nhau dẫn tới Boyer-Moore: giữ một candidate và count balance, reset candidate khi balance về 0.

**State / invariant / data structure cần hiểu trước code.** candidate là giá trị đang thắng trong đoạn chưa bị cancel; count là số vote dư của candidate. Invariant: sau khi bỏ các cặp giá trị khác nhau trong prefix, phần dư có thể đại diện bằng candidate,count.

**Dry run mental theo implementation.** Dry run [2,2,1,1,1,2,2]: candidate 2 count tăng 2, hai số 1 kéo count về 0, reset candidate 1 rồi cuối các số 2 khiến candidate cuối là 2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là nghĩ candidate luôn là majority ở mọi prefix; chỉ cuối toàn mảng mới được đảm bảo bởi constraint. Khi nào dùng: phần tử xuất hiện hơn một nửa thường có cancellation invariant O(1) space.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Intuition

Điểm mạnh nhất của đề là điều kiện:

```text
majority frequency > n / 2
```

Nghĩa là phần tử majority xuất hiện nhiều hơn **tổng số phần tử không phải majority**.

Boyer–Moore Majority Vote khai thác điều này bằng tư duy **pair cancellation**:

> Mỗi lần gặp một phần tử khác candidate, ta xem như hủy một occurrence của candidate với một occurrence khác nó.

Nếu majority thật sự chiếm hơn một nửa mảng, dù ta hủy các cặp khác nhau theo cách nào, majority không thể bị hủy hết. Candidate sống sót cuối cùng phải là majority.

Thuật toán chỉ cần hai biến:

```text
candidate
count
```

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Tìm giá trị xuất hiện hơn `⌊n/2⌋` lần.
- Đề đảm bảo giá trị đó tồn tại.
- Follow-up mong muốn `O(n)` time và `O(1)` extra space.

Đề song ngữ đầy đủ nằm trong [`problem.md`](problem.md).

---

## 3. Alternative approaches / Các hướng khác

### Approach A — HashMap counting

Đếm số lần xuất hiện của từng giá trị.

```text
Time:  O(n)
Space: O(n)
```

Dễ hiểu và hữu ích nếu đề không đảm bảo majority tồn tại, nhưng không đạt follow-up về không gian.

### Approach B — Sorting

Sau khi sort, majority chắc chắn chiếm vị trí giữa:

```text
nums[n / 2]
```

Độ phức tạp thông thường:

```text
Time:  O(n log n)
Space: phụ thuộc thuật toán sort
```

Cách này ngắn nhưng chậm hơn tuyến tính và có thể sửa input.

### Approach C — Divide and conquer

Có thể tìm majority ở nửa trái, nửa phải rồi đếm để chọn candidate trên đoạn hiện tại. Ý tưởng hợp lệ nhưng phức tạp hơn và không tốt bằng Boyer–Moore cho yêu cầu này.

### Approach D — Boyer–Moore Majority Vote

```text
Time:  O(n)
Space: O(1)
```

Đây là canonical solution.

---

## 4. Boyer–Moore step by step / Từng bước

Khởi tạo:

```java
int candidate = 0;
int count = 0;
```

Với mỗi `num`:

```java
if (count == 0) {
    candidate = num;
}

count += (num == candidate) ? 1 : -1;
```

Ý nghĩa của `count` không phải là tần suất tuyệt đối của candidate trong toàn mảng. Nó là **số dư sau quá trình hủy cặp** trong đoạn đã duyệt.

Khi `count == 0`, các vote của candidate hiện tại đã bị các phần tử khác triệt tiêu hoàn toàn, vì vậy ta có thể bắt đầu một nhóm mới với candidate hiện tại.

---

## 5. Optimal Java solution

```java
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;

        for (int num : nums) {
            // count == 0 nghĩa là các vote của nhóm trước đã bị pair-cancel hết;
            // ta có thể bắt đầu một nhóm mới mà không làm mất majority thật.
            if (count == 0) {
                candidate = num;
            }

            // Cùng candidate tạo một vote dư; khác candidate triệt tiêu một vote.
            // Majority > n/2 nên sau mọi phép ghép cặp khác nhau nó không thể bị xóa hết.
            count += (num == candidate) ? 1 : -1;
        }

        // Đề đảm bảo majority tồn tại, nên survivor không cần verification pass.
        return candidate;
    }
}
```

---

## 6. Dry run / Chạy thử

```text
nums = [2,2,1,1,1,2,2]
```

| `num` | candidate trước | count trước | Hành động | candidate sau | count sau |
|---:|---:|---:|---|---:|---:|
| 2 | — | 0 | chọn 2, +1 | 2 | 1 |
| 2 | 2 | 1 | cùng candidate | 2 | 2 |
| 1 | 2 | 2 | khác candidate | 2 | 1 |
| 1 | 2 | 1 | khác candidate | 2 | 0 |
| 1 | — | 0 | chọn 1, +1 | 1 | 1 |
| 2 | 1 | 1 | khác candidate | 1 | 0 |
| 2 | — | 0 | chọn 2, +1 | 2 | 1 |

Candidate cuối là `2`.

---

## 7. Correctness / Vì sao thuật toán đúng?

Gọi majority thật là `M`.

Vì `M` xuất hiện nhiều hơn `n/2` lần nên:

```text
count(M) > count(all non-M combined)
```

Mỗi phép giảm `count` có thể được nhìn như loại bỏ một cặp gồm hai giá trị khác nhau. Việc loại bỏ một cặp khác nhau không thể làm thay đổi việc `M` có chiếm đa số trong phần tử còn lại hay không: nếu cặp chứa `M`, ta loại một `M` và một non-`M`; nếu cặp không chứa `M`, lợi thế tương đối của `M` càng không giảm.

Do số lượng `M` ban đầu lớn hơn tổng phần còn lại, sau khi hủy tối đa các cặp khác nhau vẫn phải còn ít nhất một `M`. Boyer–Moore thực hiện quá trình hủy này bằng `candidate/count`, nên candidate sống sót cuối cùng là `M`.

### Tại sao không cần verification pass?

Vì đề **đảm bảo** majority tồn tại. Boyer–Moore luôn cho một candidate; với guarantee này candidate đó chắc chắn hợp lệ.

Nếu guarantee bị bỏ, ta phải quét thêm một lượt và kiểm tra:

```text
frequency(candidate) > n / 2
```

---

## 8. Complexity / Độ phức tạp

Duyệt mảng đúng một lần:

```text
Time: O(n)
```

Chỉ dùng `candidate` và `count`:

```text
Space: O(1)
```

---

## 9. Edge cases / Trường hợp biên

- Một phần tử → chính nó là majority.
- Majority là số âm → không ảnh hưởng.
- Majority chỉ vừa đủ `⌊n/2⌋ + 1` lần → vẫn sống sót qua cancellation.
- Majority xuất hiện xen kẽ với nhiều giá trị khác → thuật toán vẫn đúng.
- Candidate có thể thay đổi nhiều lần trong quá trình quét; điều đó hoàn toàn bình thường.

---

## 10. Common mistakes / Lỗi thường gặp

1. Nhầm majority với **mode**. Majority phải xuất hiện hơn một nửa, không chỉ là nhiều nhất.
2. Nghĩ `count` là tần suất thật của candidate.
3. Quên chọn candidate mới khi `count == 0`.
4. Thêm verification pass dù đề đã guarantee majority — không sai, nhưng không cần.
5. Ngược lại, dùng Boyer–Moore rồi return candidate trực tiếp trong phiên bản **không guarantee** majority.
6. Chỉ học thuộc code mà không giải thích được pair cancellation.

---

## 11. Pattern recognition / Nhận diện pattern

Khi thấy:

- cần tìm phần tử xuất hiện `> n/2`;
- có guarantee majority tồn tại;
- yêu cầu tuyến tính và constant space;

hãy nghĩ tới:

```text
Boyer–Moore Majority Vote
```

Insight quan trọng:

```text
majority > all others combined
→ cancel different pairs
→ majority must survive
```

---

## 12. Vocabulary / Từ vựng

| English | Tiếng Việt |
|---|---|
| majority element | phần tử chiếm đa số |
| candidate | ứng viên |
| vote | phiếu/bình chọn |
| pair cancellation | triệt tiêu theo cặp |
| frequency | tần suất |
| strict majority | đa số tuyệt đối (> 1/2) |
| verification pass | lượt duyệt xác minh |
| survives cancellation | còn lại sau quá trình triệt tiêu |
