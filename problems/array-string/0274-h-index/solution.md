# 274. H-Index — Solution

## 1. Core idea / Ý tưởng cốt lõi

H-index là **ngưỡng lớn nhất `h`** sao cho có ít nhất `h` bài với citation `>= h`.

Nếu có `n` bài thì:

```text
0 <= h <= n
```

Do đó citation lớn hơn `n` không cần giữ giá trị chính xác. Ta gom tất cả vào bucket `n`, rồi đếm cumulative từ phải sang trái.

```text
Time:  O(n)
Space: O(n)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

Tìm maximum `h` thỏa:

```text
number of papers with citations >= h >= h
```

Không cần yêu cầu các bài còn lại có citation nhỏ hơn `h`; điều quyết định là điều kiện “ít nhất `h` bài có ít nhất `h` citations”.

---

## 3. Observation 1 — H-index bị chặn bởi số bài

Dù:

```text
citations = [1000000]
```

chỉ có một bài, nên h-index tối đa là `1`.

Vì vậy khi xây bucket:

```java
count[Math.min(citation, n)]++;
```

mọi giá trị `>= n` có thể cùng nằm ở bucket `n` mà không mất thông tin cần thiết.

---

## 4. Observation 2 — Cumulative count từ lớn xuống nhỏ

Sau khi có bucket, duyệt:

```text
h = n, n-1, ..., 0
```

và duy trì:

```text
papersAtLeastH += count[h]
```

Tại mỗi `h`, biến này bằng số bài có ít nhất `h` citations.

Ngay khi:

```text
papersAtLeastH >= h
```

thì `h` hợp lệ. Vì đang duyệt giảm dần, đó cũng là **h lớn nhất**.

---

## 5. Alternative approaches / Các hướng khác

### Approach A — Sorting

Sort citations tăng hoặc giảm rồi tìm ngưỡng phù hợp.

```text
Time:  O(n log n)
Space: tùy thuật toán sort
```

Dễ nghĩ và thường đủ nhanh với `n <= 5000`.

### Approach B — Test từng h

Với mỗi `h`, đếm lại số paper `>= h`.

```text
Time: O(n²)
```

Không cần thiết.

### Approach C — Counting buckets

Dựa vào bound `h <= n` để đạt:

```text
Time:  O(n)
Space: O(n)
```

Đây là canonical solution.

---

## 6. Optimal Java solution

```java
class Solution {
    public int hIndex(int[] citations) {
        int n = citations.length;
        int[] count = new int[n + 1];

        for (int citation : citations) {
            count[Math.min(citation, n)]++;
        }

        int papersAtLeastH = 0;

        for (int h = n; h >= 0; h--) {
            papersAtLeastH += count[h];
            if (papersAtLeastH >= h) {
                return h;
            }
        }

        return 0;
    }
}
```

---

## 7. Dry run

```text
citations = [3,0,6,1,5]
n = 5
```

Buckets sau saturation:

```text
0 -> 1
1 -> 1
2 -> 0
3 -> 1
4 -> 0
5 -> 2   // citation 5 và 6
```

Duyệt xuống:

| h | papers with >= h citations | valid? |
|---:|---:|---|
| 5 | 2 | no |
| 4 | 2 | no |
| 3 | 3 | yes |

Trả `3`.

---

## 8. Correctness / Vì sao đúng

Saturation `min(citation, n)` không thay đổi bất kỳ câu hỏi nào dạng “citation có >= h không?” với `h <= n`.

Khi duyệt từ `n` xuống `h`, cumulative sum chứa chính xác tất cả paper có citation `>= h`. Nếu cumulative >= `h`, ngưỡng `h` hợp lệ.

Do kiểm tra các giá trị từ lớn xuống nhỏ, giá trị hợp lệ đầu tiên là maximum valid `h`, đúng định nghĩa h-index.

---

## 9. Complexity

- Tạo bucket: `O(n)`.
- Duyệt `n+1` bucket: `O(n)`.
- Bucket array: `O(n)`.

```text
Time:  O(n)
Space: O(n)
```

---

## 10. Edge cases

- Tất cả citation bằng `0` → `h = 0`.
- Một paper có citation rất lớn → `h = 1`.
- Tất cả `n` paper có citation `>= n` → `h = n`.
- Citation lớn hơn `n` được bucket saturation xử lý đúng.

---

## 11. Common mistakes

1. Hiểu h-index là số citation trung bình hoặc median.
2. Yêu cầu **đúng h bài** thay vì **ít nhất h bài**.
3. Không nhận ra `h <= n`, dẫn đến bucket theo max citation không cần thiết.
4. Duyệt bucket tăng dần rồi trả ngưỡng hợp lệ đầu tiên — sẽ không đảm bảo maximum.

---

## 12. Pattern recognition

Khi output là một threshold bị chặn bởi `n`, còn input values có thể lớn hơn nhiều, hãy cân nhắc **saturating buckets** tại `n` rồi dùng cumulative frequency.
