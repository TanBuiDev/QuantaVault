# 125. Valid Palindrome — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Palindrome chỉ xét alphanumeric và không phân biệt hoa thường, nên hai pointer từ hai đầu có thể bỏ qua ký tự không hợp lệ rồi so cặp ký tự chuẩn hóa.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tạo cleaned string rồi reverse rất dễ nhưng dùng O(n) extra space. Quan sát không cần materialize chuỗi lọc; left/right có thể skip trực tiếp trên input và quyết định mismatch ngay.

**State / invariant / data structure cần hiểu trước code.** left/right luôn trỏ phần chưa xác nhận. Trước mỗi compare, advance qua non-alphanumeric. Invariant: mọi cặp nằm ngoài [left,right] đã match sau lowercase normalization.

**Dry run mental theo implementation.** Dry run 'A man, a plan, a canal: Panama': left A và right a match; các space/comma/colon bị skip; pointers tiến dần tới giữa mà không tạo string mới.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là so trước khi skip hoặc normalize chỉ một side. Khi nào dùng: so sequence đối xứng với ký tự bỏ qua thường giải bằng converging two pointers.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Palindrome là property đối xứng, nên dùng hai pointer từ hai đầu:

```text
left  ->
       string
       <- right
```

Không cần tạo normalized string. Mỗi pointer tự skip các ký tự không alphanumeric; khi cả hai đang ở ký tự hợp lệ, so sánh lowercase.

```text
Time: O(n)
Space: O(1)
```

---

## 2. Why filtering can be done lazily

Đề mô tả hai bước conceptual:

1. bỏ non-alphanumeric;
2. lowercase rồi kiểm tra palindrome.

Ta không cần materialize kết quả bước 1. Khi pointer gặp invalid character, chỉ cần skip nó. Thứ tự các ký tự hợp lệ còn lại vẫn giống hệt normalized string.

---

## 3. Algorithm

Trong khi `left < right`:

1. Di chuyển `left` qua mọi invalid character.
2. Di chuyển `right` qua mọi invalid character.
3. Lowercase hai character hiện tại.
4. Nếu khác → `false`.
5. Nếu giống → `left++`, `right--`.

Nếu hai pointer gặp nhau mà chưa mismatch → `true`.

---

## 4. Optimal Java solution

```java
class Solution {
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;

        while (left < right) {
            // Skip lazily tương đương tạo một normalized string nhưng không cần
            // allocate buffer; hai pointer luôn tìm cặp alphanumeric ngoài cùng còn lại.
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }

            char leftChar = Character.toLowerCase(s.charAt(left));
            char rightChar = Character.toLowerCase(s.charAt(right));

            // Mismatch ở cặp hợp lệ ngoài cùng chứng minh ngay normalized sequence
            // không thể đối xứng, nên không cần kiểm tra phần bên trong nữa.
            if (leftChar != rightChar) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
```

---

## 5. Dry run

Với:

```text
"A man, a plan, a canal: Panama"
```

- `A` so với `a` → cùng lowercase `a`.
- skip spaces/punctuation.
- Tiếp tục so các cặp alphanumeric đối xứng.
- Không mismatch → `true`.

---

## 6. Alternative approach

Có thể build normalized `StringBuilder`, rồi reverse hoặc dùng two pointers trên builder. Code dễ hiểu nhưng cần `O(n)` extra space. Direct two-pointer giữ `O(1)` working space.

---

## 7. Correctness / Vì sao đúng

Hai pointer luôn trỏ tới ký tự chưa được so sánh ngoài cùng còn lại của normalized sequence. Skip invalid characters tương đương loại chúng khỏi sequence. Nếu hai ký tự hợp lệ ngoài cùng khác nhau sau lowercase thì normalized string không thể là palindrome. Nếu giống, bỏ cặp đó và lặp cho phần bên trong. Khi hết cặp mà không mismatch, mọi cặp đối xứng đều bằng nhau nên chuỗi là palindrome.

---

## 8. Complexity

Mỗi pointer chỉ di chuyển vào trong và mỗi character bị đi qua tối đa một lần:

```text
Time: O(n)
Space: O(1)
```

---

## 9. Common mistakes

1. Chỉ bỏ spaces nhưng quên punctuation.
2. So sánh case-sensitive.
3. Tạo normalized string rồi báo nhầm `O(1)` space.
4. Skip chỉ một bên rồi so khi bên kia vẫn invalid.

---

## 10. Pattern recognition

Khi cần so sánh một sequence sau khi bỏ một số phần tử, có thể dùng two pointers và **lazy skipping** thay vì xây sequence đã filter.
