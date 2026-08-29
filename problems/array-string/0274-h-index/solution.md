# 274. H-Index — Solution

## 1. Bài toán thực sự hỏi gì?

Đừng bắt đầu bằng bucket hay sorting. Trước tiên hãy đọc định nghĩa theo cách đời thường:

> Ta cần tìm số lớn nhất `h` sao cho có **ít nhất `h` bài báo**, và mỗi bài trong nhóm đó có **ít nhất `h` citations**.

Ví dụ:

```text
citations = [3, 0, 6, 1, 5]
```

Thử `h = 4`: cần 4 bài có ít nhất 4 citations, nhưng chỉ có `6` và `5` → không đủ.

Thử `h = 3`: có `3`, `6`, `5` → đúng 3 bài có ít nhất 3 citations.

Vậy đáp án là `3`.

Điểm dễ nhầm nhất là chữ **ít nhất**. Không cần đúng `h` bài; chỉ cần số bài đạt threshold không nhỏ hơn `h`.

---

## 2. Cách nghĩ tự nhiên đầu tiên

Ta có thể thử từng candidate:

```text
h = 0, 1, 2, ..., n
```

và với mỗi `h`, quét toàn bộ mảng để đếm bao nhiêu paper có `citation >= h`.

Cách này đúng nhưng tốn:

```text
O(n²)
```

Một cách tốt hơn là sort citations rồi tìm threshold, đạt `O(n log n)`.

Nhưng đề còn cho ta một quan sát mạnh hơn để bỏ cả bước sort.

---

## 3. Quan sát quyết định: H-index không thể lớn hơn số paper

Nếu có `n` bài báo thì chắc chắn:

```text
0 <= h <= n
```

Ngay cả khi một bài có một triệu citations, nó vẫn chỉ là **một** bài.

Vì vậy với mục tiêu tìm `h`, ta không cần phân biệt:

```text
citation = n
citation = n + 20
citation = 1_000_000
```

Tất cả đều có thể gom vào cùng bucket `n`, vì với mọi candidate `h <= n`, các giá trị này đều trả lời giống nhau cho câu hỏi:

```text
citation >= h ?
```

Đó là lý do của:

```java
count[Math.min(citation, n)]++;
```

---

## 4. Từ observation sinh ra state nào?

Ta dùng:

```text
count[x] = số paper có x citations
```

riêng:

```text
count[n] = số paper có citations >= n
```

Sau đó duyệt candidate `h` từ lớn xuống nhỏ và duy trì:

```text
papersAtLeastH
```

Ý nghĩa của biến này tại candidate `h`:

> Tổng số paper có citations `>= h`.

Mỗi khi giảm `h`, ta cộng thêm `count[h]`:

```java
papersAtLeastH += count[h];
```

Nếu:

```text
papersAtLeastH >= h
```

thì `h` hợp lệ.

Ta duyệt từ `n` xuống `0`, nên candidate hợp lệ đầu tiên chính là H-index lớn nhất.

---

## 5. Optimal Java solution

```java
class Solution {
    public int hIndex(int[] citations) {
        int n = citations.length;

        // H-index không thể lớn hơn tổng số bài báo n.
        // Mảng count[0..n] dùng kỹ thuật bucket: count[n] đại diện cho tất cả citation >= n.
        int[] count = new int[n + 1];

        for (int citation : citations) {
            // Gom các citation vượt quá n vào bucket n (bucket saturation)
            // vì số trích dẫn > n không thể làm H-index vượt quá n.
            count[Math.min(citation, n)]++;
        }

        int papersAtLeastH = 0;

        // Duyệt h từ n giảm dần về 0 để tìm giá trị h lớn nhất thỏa mãn định nghĩa.
        for (int h = n; h >= 0; h--) {
            // Cộng dồn: papersAtLeastH chính là tổng số bài báo có số trích dẫn >= h.
            papersAtLeastH += count[h];

            // Nếu có ít nhất h bài báo có >= h trích dẫn, h hiện tại là H-index lớn nhất.
            if (papersAtLeastH >= h) {
                return h;
            }
        }

        return 0;
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 6. Dry run theo đúng biến trong code

Với:

```text
citations = [3, 0, 6, 1, 5]
n = 5
```

Sau bucket saturation:

```text
count[0] = 1
count[1] = 1
count[2] = 0
count[3] = 1
count[4] = 0
count[5] = 2   // citation 5 và 6 cùng nằm ở đây
```

Bắt đầu:

```text
papersAtLeastH = 0
```

| h | cộng `count[h]` | `papersAtLeastH` | `>= h`? |
|---:|---:|---:|---|
| 5 | 2 | 2 | no |
| 4 | 0 | 2 | no |
| 3 | 1 | 3 | yes |

Ngay tại `h = 3`, có 3 paper có ít nhất 3 citations, nên trả `3`.

---

## 7. Vì sao thuật toán đúng?

Có hai ý cần giữ:

1. Mọi candidate H-index đều nằm trong `[0, n]`, nên gom tất cả citation `>= n` vào bucket `n` không làm mất thông tin cần thiết.
2. Khi đang xét `h`, cumulative sum từ bucket `n` xuống `h` chính xác là số paper có citation `>= h`.

Do đó điều kiện:

```text
papersAtLeastH >= h
```

đúng chính xác với định nghĩa H-index.

Vì ta thử `h` từ lớn xuống nhỏ, giá trị hợp lệ đầu tiên là maximum valid `h`.

---

## 8. Complexity

Ta quét citations một lần để tạo bucket và quét tối đa `n + 1` bucket một lần nữa:

```text
Time:  O(n)
Space: O(n)
```

---

## 9. Edge cases

- `[0,0,0]` → không có paper nào đạt threshold 1 → `0`.
- `[100]` → chỉ có một paper nên H-index tối đa là `1`.
- `[5,5,5,5,5]` với `n = 5` → cả 5 paper vào bucket 5 → `5`.
- Citation cực lớn không làm bucket array phình theo citation value.

---

## 10. Common mistakes

- Hiểu H-index là trung bình/median citations.
- Yêu cầu **đúng `h` paper** thay vì **ít nhất `h` paper**.
- Tạo bucket tới `max(citations)` dù output bị chặn bởi `n`.
- Duyệt `h` tăng dần rồi return candidate đầu tiên; ta cần maximum nên phải tìm từ lớn xuống.
- Nhớ tên “bucket saturation” nhưng không hiểu lý do: ta chỉ được phép saturate vì mọi candidate cần xét đều `<= n`.

---

## 11. Cách nhận ra ý tưởng này ở bài khác

Hãy để ý dạng bài:

```text
output là một threshold k
threshold bị chặn bởi số lượng phần tử n
input value có thể lớn hơn n rất nhiều
```

Khi các giá trị lớn hơn `n` đều tương đương đối với câu hỏi cần trả lời, ta có thể **gom chúng vào bucket biên** rồi dùng frequency/cumulative count thay vì sort toàn bộ dữ liệu.
