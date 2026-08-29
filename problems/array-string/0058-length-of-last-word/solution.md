# 58. Length of Last Word — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Chuỗi có thể kết thúc bằng nhiều space, nên việc cần làm là bỏ qua khoảng trắng ở cuối rồi đếm liên tiếp các ký tự của word cuối cho tới space hoặc đầu chuỗi.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Split toàn chuỗi tạo nhiều substring/list không cần thiết. Quan sát đáp án chỉ phụ thuộc suffix, nên quét từ phải sang trái tránh xử lý mọi word trước đó và dùng O(1) extra space.

**State / invariant / data structure cần hiểu trước code.** Index i đi ngược; phase đầu bỏ trailing spaces, phase hai tăng length khi gặp ký tự. Invariant phase hai: length đúng bằng số non-space đã đi qua trong last word.

**Dry run mental theo implementation.** Dry run '   fly me   to   the moon  ': bỏ hai space cuối, bắt đầu ở n của moon và đếm n,o,o,m thành 4, dừng khi gặp space trước m.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là đếm trailing spaces vào word hoặc access khi chuỗi toàn space nếu constraint khác. Khi nào dùng: câu hỏi chỉ về token cuối/đầu thường nên scan từ phía gần token thay vì parse toàn chuỗi.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Vì chỉ cần độ dài của **từ cuối**, hướng tự nhiên nhất là quét từ phải sang trái:

1. Bỏ qua trailing spaces.
2. Đếm các ký tự không phải space.
3. Dừng khi gặp space tiếp theo hoặc hết chuỗi.

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Why scan backwards?

Nếu dùng:

```java
s.trim().split("\\s+")
```

code có thể ngắn, nhưng tạo thêm String/array và xử lý toàn bộ các từ dù ta chỉ cần từ cuối.

Reverse scan chỉ đọc phần cần thiết và không tạo cấu trúc phụ.

---

## 3. Algorithm

Đặt:

```text
i = s.length - 1
```

### Phase 1 — skip spaces

```java
while (i >= 0 && s.charAt(i) == ' ') {
    i--;
}
```

Sau vòng này, `i` nằm ở ký tự cuối của last word.

### Phase 2 — count the last word

```java
int length = 0;
while (i >= 0 && s.charAt(i) != ' ') {
    length++;
    i--;
}
```

Khi vòng lặp dừng, `length` chính là độ dài từ cuối.

---

## Optimal Java solution

```java
class Solution {
    public int lengthOfLastWord(String s) {
        int i = s.length() - 1;

        // Trailing spaces không thuộc last word, nên bỏ chúng trước để i
        // đứng đúng tại ký tự cuối cùng cần đếm.
        while (i >= 0 && s.charAt(i) == ' ') {
            i--;
        }

        int length = 0;
        // Từ vị trí đó chỉ cần đi tới separator gần nhất; parse các từ phía trước
        // không thể ảnh hưởng độ dài của last word.
        while (i >= 0 && s.charAt(i) != ' ') {
            length++;
            i--;
        }

        return length;
    }
}
```

---

## 4. Dry run

```text
s = "   fly me   to   the moon  "
```

- Bỏ qua hai space cuối.
- Gặp `n` trong `moon`.
- Đếm `n,o,o,m` → `4`.
- Gặp space → dừng.

---

## 5. Correctness / Vì sao đúng

Phase 1 bỏ chính xác mọi space nằm sau từ cuối, nên sau đó pointer nằm tại ký tự cuối cùng của last word.

Phase 2 di chuyển qua tất cả và chỉ các ký tự của last word vì một word được định nghĩa là maximal substring gồm non-space characters. Vì vậy số lần đếm bằng đúng độ dài last word.

---

## 6. Complexity

Trong worst case mỗi ký tự được kiểm tra tối đa một lần:

```text
Time: O(n)
Space: O(1)
```

---

## 7. Edge cases

- Chuỗi chỉ có một từ.
- Có nhiều leading/trailing spaces.
- Last word dài một ký tự.
- Không có trailing space.

---

## 8. Common mistakes

1. Không skip trailing spaces trước khi đếm.
2. Dùng `split(" ")` rồi gặp nhiều consecutive spaces.
3. Tạo toàn bộ danh sách words không cần thiết.
4. Quên guard `i >= 0`.

---

## 9. Pattern recognition

Khi câu hỏi chỉ cần **token cuối cùng** trong chuỗi và separator đơn giản, reverse scan thường tránh được parsing toàn bộ input.
