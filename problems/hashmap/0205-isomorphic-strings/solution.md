# 205. Isomorphic Strings — Solution

## 1. Core idea / Ý tưởng cốt lõi

Hai chuỗi isomorphic khi pattern lặp của các ký tự giống hệt nhau theo từng vị trí. Thay vì lưu trực tiếp mapping object, ta lưu **vị trí xuất hiện gần nhất** của mỗi character.

---

## 2. Optimal Java solution

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        int[] lastS = new int[256];
        int[] lastT = new int[256];

        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i);
            char b = t.charAt(i);

            // Hai ký tự tương ứng phải có cùng lịch sử xuất hiện. Equality này
            // đồng thời chặn một source map sang hai target và hai source map vào một target.
            if (lastS[a] != lastT[b]) {
                return false;
            }

            // Lưu i+1 để 0 dành riêng cho trạng thái "chưa từng xuất hiện";
            // nếu lưu i trực tiếp thì occurrence tại index 0 bị nhầm với unseen.
            lastS[a] = i + 1;
            lastT[b] = i + 1;
        }

        return true;
    }
}
```

---

## 3. Why comparing last-seen positions enforces both directions

Nếu một source character cố map sang hai target khác nhau, lần xuất hiện tiếp theo của source có last-seen khác với target mới → fail.

Nếu hai source characters khác nhau cùng cố map vào một target, target đó có last-seen từ source trước nhưng source mới chưa có cùng history → cũng fail.

Vì thế equality của hai last-seen signatures kiểm tra bijection theo cả hai chiều trong một điều kiện.

---

## 4. Dry run

Với `s = "egg"`, `t = "add"`: `e/a` đều unseen, `g/d` đều unseen, và lần lặp sau `g/d` có cùng encoded last position, nên hợp lệ.

---

## 5. Correctness / Vì sao đúng

Invariant: sau khi xử lý prefix `0..i-1`, hai bảng last-seen ghi cùng một encoded position cho chính xác các cặp character đang tương ứng trong pattern.

Tại `i`, nếu hai last-seen value khác nhau thì một phía đã từng xuất hiện ở vị trí mà phía kia không có cùng partner-history, nên bijection bị vi phạm. Nếu bằng nhau, cặp hiện tại tương thích với toàn bộ prefix; cập nhật cả hai về `i+1` bảo toàn invariant.

---

## 6. Complexity

```text
Time: O(n)
Extra space: O(1)
```

Hai array luôn có 256 entries theo ASCII constraint.

---

## 7. Common mistakes

- Chỉ kiểm tra mapping `s -> t`, bỏ sót hai source characters cùng map vào một target.
- Quên rằng mapping phải nhất quán ở mọi occurrence.
- Dùng index `0` trực tiếp làm last-seen và không phân biệt với unseen.
