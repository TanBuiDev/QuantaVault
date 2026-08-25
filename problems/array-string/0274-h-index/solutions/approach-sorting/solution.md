# 274. H-Index — Solution (Approach 2: Sorting)

## 1. Core idea / Ý tưởng cốt lõi

Nếu mảng `citations` được sắp xếp tăng dần, tại mỗi chỉ số `i`:
- Số lượng bài báo có số trích dẫn $\ge \text{citations}[i]$ chính là $n - i$.
- Nếu $\text{citations}[i] \ge n - i$, thì $h = n - i$ là một h-index hợp lệ.
- Do duyệt từ trái sang phải (chỉ số `i` nhỏ nhất tương ứng với $n - i$ lớn nhất), giá trị đầu tiên thỏa mãn chính là **h-index lớn nhất**.

```text
Time:  O(n log n)  (do bước Sort)
Space: O(1) hoặc O(n) tùy thuật toán Sort của ngôn ngữ
```

---

## 2. Java Code

```java
class Solution {
    public int hIndex(int[] citations) {
        java.util.Arrays.sort(citations);
        int n = citations.length;
        for (int i = 0; i < n; i++) {
            int h = n - i;
            if (citations[i] >= h) {
                return h;
            }
        }
        return 0;
    }
}
```

---

## 3. Complexity & Trade-offs

- **Ưu điểm:** Cực kỳ trực quan, dễ nhớ và viết rất nhanh trong phỏng vấn.
- **Nhược điểm:** Độ phức tạp thời gian là $O(n \log n)$, chậm hơn cách dùng Bucket Sort ($O(n)$).
